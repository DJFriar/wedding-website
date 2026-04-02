import { NextResponse } from 'next/server'
import { findGuestsByLastName } from '@/lib/guests'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lastName = searchParams.get('lastName') ?? ''
  const matches = findGuestsByLastName(lastName)

  return NextResponse.json({
    matches: matches.map((g) => ({
      id: g.id,
      lastName: g.lastName,
      displayName: g.displayName,
      invitedCount: g.invitedCount,
    })),
  })
}
