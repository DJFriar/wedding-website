import { NextResponse } from 'next/server'
import { getGuestById } from '@/lib/guests'

const RSVP_INBOX = 'gettinghitched@thecrafts.cc'

type RsvpPayload = {
  guestId: string
  name: string
  attending: boolean
  guestCount: number
  dietary?: string
  message?: string
}

type FormSubmitAjaxResponse = {
  success?: string | boolean
  message?: string
}

function inferOriginAndReferer(request: Request): { origin: string | null; referer: string | null } {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  if (origin) {
    return { origin, referer: referer ?? `${origin}/` }
  }
  try {
    const u = new URL(request.url)
    const o = u.origin
    return { origin: o, referer: `${o}/` }
  } catch {
    return { origin: null, referer: null }
  }
}

function formSubmitFailed(data: FormSubmitAjaxResponse): boolean {
  const s = data.success
  if (s === false || s === 'false') return true
  if (typeof s === 'string' && s.toLowerCase() === 'false') return true
  return false
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
  logRsvp({ phase: 'submission_received', submission })

  const attendingLabel = attending ? 'Yes, celebrating with you!' : 'Unable to attend'
  const formBody = {
    _subject: `${guest.displayName} RSVP'd to your wedding!`,
    _captcha: false,
    guest_id: guestId,
    name,
    attending: attendingLabel,
    guest_count: String(attending ? guestCount : 0),
    dietary_restrictions: dietary || '—',
    message: message || '—',
  }

  const { origin, referer } = inferOriginAndReferer(request)
  const forwardHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (origin) forwardHeaders.Origin = origin
  if (referer) forwardHeaders.Referer = referer

  const res = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(RSVP_INBOX)}`,
    {
      method: 'POST',
      headers: forwardHeaders,
      body: JSON.stringify(formBody),
    },
  )

  let fsData: FormSubmitAjaxResponse = {}
  let responseParseError = false
  try {
    fsData = (await res.json()) as FormSubmitAjaxResponse
  } catch {
    responseParseError = true
  }

  const formSubmitOk = res.ok && !responseParseError && !formSubmitFailed(fsData)

  if (responseParseError) {
    logRsvp({
      phase: 'formsubmit_response',
      submission,
      outgoingPayload: formBody,
      httpStatus: res.status,
      responseBody: null,
      responseParseError: true,
      outcome: 'failed',
      apiError: 'upstream',
    })
    return NextResponse.json({ ok: false, error: 'upstream' }, { status: 502 })
  }

  if (!res.ok || formSubmitFailed(fsData)) {
    const msg = typeof fsData.message === 'string' ? fsData.message : ''
    let apiError: string
    if (/activation|activate form/i.test(msg)) {
      apiError = 'formsubmit_needs_activation'
    } else if (/web server|file:\/\//i.test(msg)) {
      apiError = 'formsubmit_rejected'
    } else {
      apiError = 'upstream'
    }
    logRsvp({
      phase: 'formsubmit_response',
      submission,
      outgoingPayload: formBody,
      httpStatus: res.status,
      responseBody: fsData,
      outcome: 'failed',
      apiError,
    })
    if (/activation|activate form/i.test(msg)) {
      return NextResponse.json({ ok: false, error: 'formsubmit_needs_activation' }, { status: 503 })
    }
    if (/web server|file:\/\//i.test(msg)) {
      return NextResponse.json({ ok: false, error: 'formsubmit_rejected' }, { status: 502 })
    }
    return NextResponse.json({ ok: false, error: 'upstream' }, { status: 502 })
  }

  logRsvp({
    phase: 'formsubmit_response',
    submission,
    outgoingPayload: formBody,
    httpStatus: res.status,
    responseBody: fsData,
    outcome: 'delivered',
  })

  return NextResponse.json({ ok: true })
}
