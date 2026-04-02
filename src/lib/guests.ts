import raw from '@/data/guests.json'

export type GuestRecord = {
  id: string
  lastName: string
  displayName: string
  email?: string
  /** Default party size when this invite is selected (guests can change it). */
  invitedCount: number
}

type GuestsFile = {
  guests: GuestRecord[]
}

const data = raw as GuestsFile

function normalizeLastName(value: string) {
  return value.trim().toLowerCase()
}

export function findGuestsByLastName(lastName: string): GuestRecord[] {
  const q = normalizeLastName(lastName)
  if (!q) return []
  return data.guests.filter((g) => normalizeLastName(g.lastName) === q)
}

export function getGuestById(id: string): GuestRecord | undefined {
  return data.guests.find((g) => g.id === id)
}
