'use client'

import Link from 'next/link'
import { FormEvent, useMemo, useState } from 'react'

type GuestMatch = {
  id: string
  lastName: string
  displayName: string
  invitedCount: number
}

const PARTY_MAX = 999

function useCopyText() {
  const [copied, setCopied] = useState(false)
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return { copied, copy }
}

function buildMailtoBody(values: {
  guestId: string
  name: string
  attending: boolean
  guestCount: number
  dietary: string
  message: string
}) {
  const lines = [
    `Guest list ID: ${values.guestId}`,
    `Name: ${values.name}`,
    `Attending: ${values.attending ? 'Yes' : 'No'}`,
    values.attending ? `Guests (including you): ${values.guestCount}` : '',
    values.dietary ? `Dietary / allergies: ${values.dietary}` : '',
    values.message ? `Note: ${values.message}` : '',
  ].filter(Boolean)
  return lines.join('\n')
}

const mailtoRecipient =
  typeof process.env.NEXT_PUBLIC_RSVP_MAILTO_EMAIL === 'string'
    ? process.env.NEXT_PUBLIC_RSVP_MAILTO_EMAIL
    : ''

export function InviteRsvpForm({ defaultLastName }: { defaultLastName: string }) {
  const { copied, copy } = useCopyText()

  const [step, setStep] = useState<'lookup' | 'form'>('lookup')
  const [lookupInput, setLookupInput] = useState(defaultLastName)
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupMessage, setLookupMessage] = useState<string | null>(null)
  const [matches, setMatches] = useState<GuestMatch[]>([])
  const [selectedGuest, setSelectedGuest] = useState<GuestMatch | null>(null)

  const [name, setName] = useState('')
  const [attending, setAttending] = useState(true)
  const [guestCount, setGuestCount] = useState(1)
  const [dietary, setDietary] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const rsvpMailBody = useMemo(
    () =>
      buildMailtoBody({
        guestId: selectedGuest?.id ?? '—',
        name,
        attending,
        guestCount,
        dietary,
        message,
      }),
    [selectedGuest?.id, name, attending, guestCount, dietary, message],
  )

  const mailtoHref = useMemo(() => {
    if (!mailtoRecipient) return ''
    const displayName = selectedGuest?.displayName ?? 'Guest'
    const subject = encodeURIComponent(`${displayName} RSVP'd to your wedding!`)
    return `mailto:${mailtoRecipient}?subject=${subject}&body=${encodeURIComponent(rsvpMailBody)}`
  }, [selectedGuest?.displayName, rsvpMailBody])

  function applyGuest(guest: GuestMatch) {
    setSelectedGuest(guest)
    setName(guest.displayName)
    setGuestCount(Math.max(1, guest.invitedCount))
    setStep('form')
    setLookupMessage(null)
  }

  async function runLookup() {
    const last = lookupInput.trim()
    setLookupMessage(null)
    setMatches([])
    if (!last) {
      setLookupMessage('Enter the last name that appears on your invitation.')
      return
    }
    setLookupLoading(true)
    try {
      const res = await fetch(`/api/guests?lastName=${encodeURIComponent(last)}`)
      const data = (await res.json()) as { matches?: GuestMatch[] }
      const found = Array.isArray(data.matches) ? data.matches : []
      if (found.length === 0) {
        setLookupMessage(
          "We couldn't find that name. Try the spelling on your envelope, or reach out to the couple.",
        )
        return
      }
      if (found.length === 1) {
        applyGuest(found[0]!)
        return
      }
      setMatches(found)
      setLookupMessage('Multiple households share that last name—pick yours below.')
    } catch {
      setLookupMessage('Something went wrong. Please try again in a moment.')
    } finally {
      setLookupLoading(false)
    }
  }

  function resetLookup() {
    setStep('lookup')
    setSelectedGuest(null)
    setMatches([])
    setName('')
    setGuestCount(1)
    setLookupMessage(null)
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setErrorMessage(null)
    if (!selectedGuest) return
    if (!name.trim()) {
      setErrorMessage('Please add your name.')
      return
    }
    setStatus('submitting')

    const payload = {
      guestId: selectedGuest.id,
      name: name.trim(),
      attending,
      guestCount: attending ? guestCount : 0,
      dietary: dietary.trim(),
      message: message.trim(),
    }

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json()) as { ok?: boolean; error?: string }

      if (res.ok && data.ok) {
        setStatus('success')
        return
      }

      if (res.status === 503 && data.error === 'formsubmit_needs_activation') {
        setStatus('error')
        setErrorMessage(
          'Email RSVP is almost ready: open the message FormSubmit sent to your notification address and click “Activate Form,” then try again.',
        )
        return
      }

      setStatus('error')
      setErrorMessage('Something went wrong sending your RSVP. Please try again or use the email option below.')
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong sending your RSVP. Please try again or use the email option below.')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-wedding-teal/25 bg-wedding-paper/95 p-8 text-center shadow-lg shadow-wedding-teal/10 ring-1 ring-wedding-silver-mist">
        <p className="font-display text-lg font-semibold text-wedding-teal-dark">We got it—thank you!</p>
        <p className="mt-3 text-sm text-wedding-muted">
          {attending
            ? "We're so glad you can make it and can't wait to celebrate with you."
            : "We're sorry to miss you and appreciate you letting us know."}
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex text-sm font-semibold text-wedding-teal transition hover:text-wedding-teal-dark"
        >
          ← Back to the wedding site
        </Link>
      </div>
    )
  }

  if (step === 'lookup') {
    return (
      <div className="rounded-2xl border border-wedding-silver-light bg-wedding-paper/95 p-6 shadow-lg shadow-wedding-teal/5 ring-1 ring-wedding-silver-mist sm:p-8">
        <p className="text-sm text-wedding-muted">
          Enter the <span className="font-medium text-wedding-ink">last name</span> from your invitation (same as on
          the outer envelope works great).
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <label htmlFor="invite-lastname" className="text-sm font-medium text-wedding-ink">
            Last name
          </label>
          <input
            id="invite-lastname"
            type="text"
            autoComplete="family-name"
            value={lookupInput}
            onChange={(e) => setLookupInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                void runLookup()
              }
            }}
            className="block w-full rounded-lg border border-wedding-silver-light bg-white px-3 py-2 text-wedding-ink shadow-sm placeholder:text-wedding-silver focus:border-wedding-teal focus:outline-none focus:ring-2 focus:ring-wedding-teal/30 sm:text-sm"
            placeholder="e.g. Oakwood"
          />
        </div>
        {lookupMessage && (
          <p
            className={
              matches.length > 1
                ? 'mt-4 text-sm font-medium text-wedding-marigold'
                : 'mt-4 text-sm text-wedding-terracotta-dark'
            }
            role="status"
          >
            {lookupMessage}
          </p>
        )}
        {matches.length > 1 && (
          <ul className="mt-4 space-y-2">
            {matches.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => applyGuest(m)}
                  className="w-full rounded-lg border border-wedding-silver-light bg-white px-4 py-3 text-left text-sm text-wedding-ink shadow-sm transition hover:border-wedding-teal/40 hover:bg-wedding-teal-soft/50"
                >
                  <span className="font-medium">{m.displayName}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-center text-sm font-semibold text-wedding-teal hover:text-wedding-teal-dark sm:text-left"
          >
            ← Home
          </Link>
          <button
            type="button"
            onClick={() => void runLookup()}
            disabled={lookupLoading}
            className="inline-flex justify-center rounded-full bg-wedding-terracotta px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-wedding-terracotta-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wedding-teal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {lookupLoading ? 'Looking…' : 'Find my invite'}
          </button>
        </div>
      </div>
    )
  }

  if (!selectedGuest) {
    return null
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-wedding-silver-light bg-wedding-paper/95 p-6 shadow-lg shadow-wedding-teal/5 ring-1 ring-wedding-silver-mist sm:p-8"
    >
      <div className="rounded-xl border border-wedding-teal/20 bg-wedding-teal-soft/60 px-4 py-3 text-sm">
        <p className="text-wedding-muted">
          RSVP for{' '}
          <span className="font-display font-semibold text-wedding-teal-dark">{selectedGuest.displayName}</span>
        </p>
        <button
          type="button"
          onClick={resetLookup}
          className="mt-2 text-xs font-semibold text-wedding-teal hover:text-wedding-teal-dark"
        >
          Not you? Look up again
        </button>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="rsvp-name" className="text-sm font-medium text-wedding-ink">
            Name on RSVP <span className="text-wedding-pink">*</span>
          </label>
          <input
            id="rsvp-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-lg border border-wedding-silver-light bg-white px-3 py-2 text-wedding-ink shadow-sm placeholder:text-wedding-silver focus:border-wedding-teal focus:outline-none focus:ring-2 focus:ring-wedding-teal/30 sm:text-sm"
            placeholder="Adjust if needed"
          />
        </div>

        <fieldset className="flex min-w-0 flex-col gap-3 border-0 p-0">
          <legend className="w-full text-sm font-medium text-wedding-ink">Will you attend?</legend>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-wedding-silver-light bg-white px-4 py-3 has-[:checked]:border-wedding-teal has-[:checked]:bg-wedding-teal-soft/80">
              <input
                type="radio"
                name="attending"
                checked={attending}
                onChange={() => setAttending(true)}
                className="size-4 border-wedding-silver text-wedding-teal focus:ring-wedding-teal"
              />
              <span className="text-sm text-wedding-ink">Joyfully accept</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-wedding-silver-light bg-white px-4 py-3 has-[:checked]:border-wedding-teal has-[:checked]:bg-wedding-teal-soft/80">
              <input
                type="radio"
                name="attending"
                checked={!attending}
                onChange={() => setAttending(false)}
                className="size-4 border-wedding-silver text-wedding-teal focus:ring-wedding-teal"
              />
              <span className="text-sm text-wedding-ink">Regretfully decline</span>
            </label>
          </div>
        </fieldset>

        {attending && (
          <div className="flex flex-col gap-2">
            <label htmlFor="rsvp-guests" className="text-sm font-medium text-wedding-ink">
              Guests in your party (including you)
            </label>
            <input
              id="rsvp-guests"
              name="guestCount"
              type="number"
              min={1}
              max={PARTY_MAX}
              value={guestCount}
              onChange={(e) =>
                setGuestCount(Math.max(1, Math.min(PARTY_MAX, Number(e.target.value) || 1)))
              }
              className="block w-full max-w-xs rounded-lg border border-wedding-silver-light bg-white px-3 py-2 text-wedding-ink shadow-sm focus:border-wedding-teal focus:outline-none focus:ring-2 focus:ring-wedding-teal/30 sm:text-sm"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="rsvp-dietary" className="text-sm font-medium text-wedding-ink">
            Dietary needs or allergies
          </label>
          <textarea
            id="rsvp-dietary"
            name="dietary"
            rows={2}
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            className="block w-full rounded-lg border border-wedding-silver-light bg-white px-3 py-2 text-wedding-ink shadow-sm placeholder:text-wedding-silver focus:border-wedding-teal focus:outline-none focus:ring-2 focus:ring-wedding-teal/30 sm:text-sm"
            placeholder="Optional — helps our catering team"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="rsvp-message" className="text-sm font-medium text-wedding-ink">
            A note for the couple
          </label>
          <textarea
            id="rsvp-message"
            name="message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="block w-full rounded-lg border border-wedding-silver-light bg-white px-3 py-2 text-wedding-ink shadow-sm placeholder:text-wedding-silver focus:border-wedding-teal focus:outline-none focus:ring-2 focus:ring-wedding-teal/30 sm:text-sm"
            placeholder="Optional"
          />
        </div>
      </div>

      {errorMessage && errorMessage !== 'mailto_fallback' && (
        <p className="mt-4 text-sm text-wedding-terracotta-dark" role="alert">
          {errorMessage}
        </p>
      )}

      {errorMessage === 'mailto_fallback' && (
        <div className="mt-4 rounded-xl border border-wedding-marigold/40 bg-wedding-marigold-soft/50 p-4 text-sm text-wedding-ink">
          <p>
            Online RSVP isn&apos;t connected yet. Use your email app with the text below, or copy it and
            send it to the address on your invitation.
          </p>
          {mailtoHref ? (
            <a
              href={mailtoHref}
              className="mt-3 inline-flex text-sm font-semibold text-wedding-teal underline hover:text-wedding-teal-dark"
            >
              Open in email app
            </a>
          ) : null}
          <pre className="mt-4 max-h-40 overflow-auto rounded-lg border border-wedding-silver-light bg-white p-3 text-xs text-wedding-muted whitespace-pre-wrap">
            {rsvpMailBody}
          </pre>
          <button
            type="button"
            onClick={() => copy(rsvpMailBody)}
            className="mt-3 text-sm font-semibold text-wedding-terracotta hover:text-wedding-terracotta-dark"
          >
            {copied ? 'Copied!' : 'Copy message'}
          </button>
        </div>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="text-center text-sm font-semibold text-wedding-teal hover:text-wedding-teal-dark sm:text-left"
        >
          ← Home
        </Link>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="inline-flex justify-center rounded-full bg-wedding-terracotta px-8 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-wedding-terracotta-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wedding-teal disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : 'Submit RSVP'}
        </button>
      </div>
    </form>
  )
}
