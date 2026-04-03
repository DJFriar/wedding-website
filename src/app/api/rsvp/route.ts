import { NextResponse } from 'next/server'
import { buildFormSubmitBody } from '@/lib/rsvp-form-submit'
import { getGuestById } from '@/lib/guests'

type RsvpPayload = {
  guestId: string
  name: string
  attending: boolean
  guestCount: number
  dietary?: string
  message?: string
}

function logRsvp(entry: Record<string, unknown>) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), scope: 'rsvp', ...entry }))
}

export async function POST(request: Request) {
  let body: RsvpPayload
  try {
    body = (await request.json()) as RsvpPayload
  } catch {
    logRsvp({ phase: 'request_invalid_json' })
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const guestId = typeof body.guestId === 'string' ? body.guestId.trim() : ''
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!guestId || !name) {
    logRsvp({
      phase: 'validation_failed',
      error: 'missing_fields',
      submission: {
        guestId: guestId || null,
        name: name || null,
        attending: body.attending,
        guestCount: body.guestCount,
        dietary: typeof body.dietary === 'string' ? body.dietary : null,
        message: typeof body.message === 'string' ? body.message : null,
      },
    })
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 400 })
  }

  const guest = getGuestById(guestId)
  if (!guest) {
    logRsvp({
      phase: 'validation_failed',
      error: 'unknown_guest',
      submission: {
        guestId,
        name,
        attending: body.attending,
        guestCount: body.guestCount,
        dietary: typeof body.dietary === 'string' ? body.dietary : null,
        message: typeof body.message === 'string' ? body.message : null,
      },
    })
    return NextResponse.json({ ok: false, error: 'unknown_guest' }, { status: 400 })
  }

  const attending = Boolean(body.attending)
  const guestCount =
    typeof body.guestCount === 'number' && body.guestCount >= 1 && body.guestCount <= 999
      ? Math.floor(body.guestCount)
      : attending
        ? 1
        : 0

  const dietary = typeof body.dietary === 'string' ? body.dietary.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  const submission = {
    guestId,
    displayName: guest.displayName,
    name,
    attending,
    guestCount: attending ? guestCount : 0,
    dietary: dietary || null,
    message: message || null,
  }

  const formBody = buildFormSubmitBody({
    guest,
    name,
    attending,
    guestCount: attending ? guestCount : 0,
    dietary,
    message,
  })

  logRsvp({
    phase: 'submission_received',
    submission,
    outgoingPayload: formBody,
  })

  return NextResponse.json({ ok: true, formSubmit: formBody })
}