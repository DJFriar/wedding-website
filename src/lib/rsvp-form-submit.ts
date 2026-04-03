import type { GuestRecord } from '@/lib/guests'

export type FormSubmitAjaxResponse = {
  success?: string | boolean
  message?: string
}

export function formSubmitFailed(data: FormSubmitAjaxResponse): boolean {
  const s = data.success
  if (s === false || s === 'false') return true
  if (typeof s === 'string' && s.toLowerCase() === 'false') return true
  return false
}

export function buildFormSubmitBody(params: {
  guest: Pick<GuestRecord, 'id' | 'displayName'>
  name: string
  attending: boolean
  guestCount: number
  dietary: string
  message: string
}): Record<string, string | boolean> {
  const attendingLabel = params.attending ? 'Yes, celebrating with you!' : 'Unable to attend'
  return {
    _subject: `${params.guest.displayName} RSVP'd to your wedding!`,
    _captcha: false,
    guest_id: params.guest.id,
    name: params.name,
    attending: attendingLabel,
    guest_count: String(params.attending ? params.guestCount : 0),
    dietary_restrictions: params.dietary || '—',
    message: params.message || '—',
  }
}

/** Classify FormSubmit ajax outcome after JSON parse (or parse failure). */
export function getFormSubmitDeliveryError(
  res: Response,
  data: FormSubmitAjaxResponse,
  parseError: boolean,
): 'formsubmit_needs_activation' | 'formsubmit_rejected' | 'upstream' | null {
  if (!parseError && res.ok && !formSubmitFailed(data)) return null
  if (parseError) return 'upstream'
  const msg = typeof data.message === 'string' ? data.message : ''
  if (/activation|activate form/i.test(msg)) return 'formsubmit_needs_activation'
  if (/web server|file:\/\//i.test(msg)) return 'formsubmit_rejected'
  return 'upstream'
}
