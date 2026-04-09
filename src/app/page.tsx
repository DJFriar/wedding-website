import Image from 'next/image'
import Link from 'next/link'

const WEDDING_DATE_LINE = 'June 11, 2026'
const VENUE_NAME = 'Hollow Hill Event Center'
const VENUE_ADDRESS_LINE = '1680 Mary Dr, Weatherford, TX'
const MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(`${VENUE_NAME}, ${VENUE_ADDRESS_LINE}`)

function BarnSilhouette({ className }: { className?: string }) {
  return (
    <svg
      className={`mx-auto block ${className ?? ''}`}
      viewBox="0 0 120 72"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M60 8L12 38v6h8v20h80V44h8v-6L60 8zm-4 58V48h8v18h-8zm-28 0V42h16v24H28zm40 0V42h16v24H68zM44 28h32v8H44v-8z" />
    </svg>
  )
}

function WheatDivider({ className }: { className?: string }) {
  return (
    <svg
      className={`mx-auto block max-w-full ${className ?? ''}`}
      viewBox="0 0 200 16"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M 8 8 C 38 3.5, 72 12.5, 100 8 C 128 12.5, 162 3.5, 192 8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="100" cy="8" r="2.5" fill="currentColor" opacity="0.35" />
    </svg>
  )
}

export default function HomePage() {
  return (
    <div className="homestead-page min-h-screen">
      <header className="homestead-hero-strip relative overflow-hidden px-6 py-10 text-center sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center text-center">
          <BarnSilhouette className="mb-4 aspect-[120/72] h-12 w-auto shrink-0 text-wedding-marigold-soft drop-shadow-sm sm:h-14" />
          <h1 className="mb-4 font-kapakana text-[2.8125rem] font-normal leading-tight tracking-tight text-pretty text-wedding-teal-dark sm:text-[4.6875rem] sm:text-balance sm:leading-[1.05]">
              Kasi &amp; Tommy
            </h1>
          <p className="font-display text-2xl font-semibold tracking-wide text-wedding-paper sm:text-3xl">
            {WEDDING_DATE_LINE}
          </p>
          <p className="mt-2 font-display text-sm font-medium text-wedding-marigold-soft/95 sm:text-base">
            {VENUE_NAME}
          </p>
          <WheatDivider className="mt-4 aspect-[200/16] h-4 w-auto max-w-[12.5rem] text-wedding-silver-mist sm:max-w-[14rem]" />
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-6 pt-10 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">

          </div>
        </section>

        <section className="relative px-6 pb-4 pt-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative rounded-sm p-3 sm:p-4 sm:pb-6">
              <p className="mb-3 text-center font-display text-xs font-semibold tracking-widest text-wedding-wood-mid uppercase">
                Our story, in one frame
              </p>
              <div className="wood-frame rounded-sm">
                <Image
                  alt="Kasi and Tommy engaged"
                  src="/images/KasiTommyEngaged.jpeg"
                  width={2432}
                  height={1442}
                  className="block w-full rounded-sm object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-6 pt-8 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mt-2 text-lg/8 text-wedding-muted">
              We&apos;re throwing the kind of party where boots are welcome, string lights glow against worn timber,
              and the dance floor lives inside a big red barn. Join us at Hollow Hill as we gather everyone we love
              under one roof—Tommy asked, Kasi said yes, and we can&apos;t wait to celebrate.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-1">
            <div className="rounded-xl border border-wedding-silver-light bg-wedding-paper/80 px-5 py-6 shadow-sm ring-1 ring-wedding-barn/10">
              <p className="font-display text-sm font-semibold text-wedding-barn">Under the rafters</p>
              <p className="mt-2 text-sm leading-relaxed text-wedding-muted">
                We&apos;ll say our vows and dance the night away at{' '}
                <span className="font-medium text-wedding-ink">{VENUE_NAME}</span>{' '}
                —{' '}a red barn with room for the whole guest list.
              </p>
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-wedding-teal underline decoration-wedding-teal/35 underline-offset-2 hover:text-wedding-teal-dark"
              >
                Open in Maps
              </a>
            </div>
          </div>
        </section>

        <section className="bg-linear-to-b from-wedding-barn-dark via-wedding-barn to-wedding-barn-dark px-6 py-14 text-center text-wedding-paper sm:py-16">
          <WheatDivider className="mb-6 h-4 w-[min(20rem,calc(100%-2rem))] text-wedding-silver opacity-80" />
          <p className="font-display text-lg font-semibold tracking-wide text-wedding-marigold-soft sm:text-xl">{`Save the date — ${WEDDING_DATE_LINE}`}</p>
          <p className="mx-auto mt-2 max-w-lg text-sm text-wedding-silver-mist sm:text-base">
            {VENUE_NAME}
          </p>
          <p className="mx-auto mt-1 max-w-lg text-sm text-wedding-silver-mist sm:text-base">
            {VENUE_ADDRESS_LINE}
          </p>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-wedding-silver-mist sm:text-base">
            Mark your calendar—we&apos;ll share more timing and weekend plans here as we finalize details. Right now
            we&apos;re focused on knowing who we&apos;ll get to hug in the barn aisle.
          </p>
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
            <Link
              href="/invite"
              className="inline-flex rounded-full border-2 border-white/30 bg-wedding-terracotta px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:border-white/45 hover:bg-wedding-terracotta-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wedding-paper"
            >
              RSVP — find your invitation
            </Link>
            <Link
              href="/registry"
              className="inline-flex rounded-full border-2 border-wedding-silver-mist/50 bg-white/10 px-8 py-3.5 text-sm font-semibold text-wedding-paper shadow-sm transition hover:border-wedding-paper/40 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wedding-paper"
            >
              Registry
            </Link>
          </div>
          <p className="mt-6 text-xs text-wedding-silver-mist/90 sm:text-sm">
            You&apos;ll look up your invite by last name—the same one on your envelope.
          </p>
        </section>
      </main>

      <footer className="border-t-4 border-wedding-wood bg-wedding-field/50">
        <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <p className="text-center text-sm text-wedding-muted">
            Kasi &amp; Tommy · {WEDDING_DATE_LINE}
            <br />
            {VENUE_NAME}, {VENUE_ADDRESS_LINE}
            <br />
            <Link href="/registry" className="font-semibold text-wedding-teal hover:text-wedding-teal-dark">
              Registry
            </Link>
            <span className="text-wedding-silver-light"> · </span>
            <Link href="/invite" className="font-semibold text-wedding-teal hover:text-wedding-teal-dark">
              RSVP
            </Link>
            <br />
            <span className="whitespace-nowrap">&copy; {new Date().getFullYear()} ambitiousNerds</span>
          </p>
        </div>
      </footer>
    </div>
  )
}
