export const RSVP_INBOX = 'gettinghitched@thecrafts.cc' as const

export function getFormSubmitAjaxUrl() {
  return `https://formsubmit.co/ajax/${encodeURIComponent(RSVP_INBOX)}`
}
