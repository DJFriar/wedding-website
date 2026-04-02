import type { Metadata } from 'next'
import Link from 'next/link'
import { InviteRsvpForm } from './InviteRsvpForm'

export const metadata: Metadata = {
  title: 'RSVP | Kasi & Tommy\'s Wedding',
  description:
    'RSVP for June 11, 2026 at Hollow Hill Event Center, 1680 Mary Dr, Weatherford, TX. Look up your invite by last name.',
}

function firstParam(value: string | string[] | undefined): string {
  if (typeof value === 'string') return value
  if (Array.isArray(value) && value[0]) return value[0]
  return ''
}

export default function InvitePage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  const defaultLastName =
    firstParam(searchParams.last).trim() ||
    firstParam(searchParams.lastName).trim() ||
    firstParam(searchParams.name).trim()

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-lg px-6 py-16 sm:py-24">
        <p className="text-center font-display text-sm font-semibold tracking-[0.2em] text-wedding-teal uppercase">
          You&apos;re invited
        </p>
        <p className="mx-auto mt-3 h-1 w-12 rounded-full bg-linear-to-r from-wedding-marigold to-wedding-pink" />
        <h1 className="font-display mt-4 text-center text-3xl font-semibold tracking-tight text-pretty text-wedding-teal-dark sm:text-4xl">
          RSVP
        </h1>
        <p className="mt-4 text-center text-base text-wedding-muted">
          Look up your invitation by last name, then send your reply. We can&apos;t wait to hear from you.
        </p>

        <div className="mt-10">
          <InviteRsvpForm defaultLastName={defaultLastName} />
        </div>

        <p className="mt-8 text-center text-sm text-wedding-silver">
          Questions?{' '}
          <Link
            href="/"
            className="font-semibold text-wedding-teal transition hover:text-wedding-teal-dark"
          >
            Back to the main site
          </Link>
        </p>
      </div>
    </div>
  )
}
