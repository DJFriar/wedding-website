import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { registryPayments } from '@/data/registry-payments'

export const metadata: Metadata = {
  title: 'Registry | Kasi & Tommy\'s Wedding',
  description:
    'No gifts expected—your presence is enough. Optional contributions toward our future home down payment via Zelle, Venmo, or Cash App.',
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

export default function RegistryPage() {
  const { venmo, cashApp } = registryPayments

  return (
    <div className="homestead-page min-h-screen">
      <header className="homestead-hero-strip relative overflow-hidden px-6 py-10 text-center sm:py-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto max-w-2xl">
          <p className="font-display text-sm font-semibold tracking-[0.2em] text-wedding-paper/90 uppercase">
            Kasi &amp; Tommy
          </p>
          <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-wedding-paper sm:text-4xl">
            Registry
          </h1>
          <WheatDivider className="mt-5 aspect-[200/16] h-4 w-48 text-wedding-marigold-soft/80 sm:w-56" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
        <div className="rounded-xl border border-wedding-silver-light bg-wedding-paper/90 p-6 shadow-sm ring-1 ring-wedding-teal/10 sm:p-8">
          <p className="font-display text-lg font-semibold text-wedding-teal-dark">Your presence is the gift</p>
          <p className="mt-4 text-base leading-relaxed text-wedding-muted">
            We don&apos;t need anything other than you celebrating with us at the wedding. If you still wish to give a
            wedding present, we&apos;d be grateful for help toward our goal of buying a home next year—a contribution to
            our down payment fund means more than any registry item.
          </p>
        </div>

        <p className="mt-10 text-center font-display text-sm font-semibold tracking-wide text-wedding-barn">
          Send a gift toward our home
        </p>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-wedding-muted">
          Choose the app you use most; each option goes to us directly. Thank you for your generosity.
        </p>

        <ul className="mt-8 flex flex-col gap-5">
          <li className="rounded-xl border border-wedding-silver-light bg-wedding-paper/80 px-5 py-5 shadow-sm sm:px-6">
            <p className="font-display text-base font-semibold text-wedding-ink">Zelle</p>
            <p className="mt-2 text-sm leading-relaxed text-wedding-muted">
              Scan the code with your banking app if it supports Zelle QR pay. Most apps include Zelle under transfer or
              pay.
            </p>
            <div className="mt-4 flex justify-center rounded-lg border border-wedding-silver-light bg-white p-4 shadow-inner">
              <Image
                src="/images/ZelleQR.jpeg"
                alt="Zelle QR code — scan to pay"
                width={502}
                height={619}
                className="h-auto max-w-[min(220px,75vw)] object-contain"
                sizes="(max-width: 640px) 75vw, 220px"
              />
            </div>
          </li>

          <li className="rounded-xl border border-wedding-silver-light bg-wedding-paper/80 px-5 py-5 shadow-sm sm:px-6">
            <p className="font-display text-base font-semibold text-wedding-ink">Venmo</p>
            <p className="mt-2 text-sm leading-relaxed text-wedding-muted">
              Open our profile in the Venmo app or on the web—tap to pay with your Venmo balance or linked account.
            </p>
            <p className="mt-3 text-sm font-medium text-wedding-muted">Profile: {venmo.handle}</p>
            <a
              href={venmo.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-wedding-terracotta px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-wedding-terracotta-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wedding-teal"
            >
              Open Venmo
            </a>
          </li>

          <li className="rounded-xl border border-wedding-silver-light bg-wedding-paper/80 px-5 py-5 shadow-sm sm:px-6">
            <p className="font-display text-base font-semibold text-wedding-ink">Cash App</p>
            <p className="mt-2 text-sm leading-relaxed text-wedding-muted">
              Pay with Cash App using our cashtag. You&apos;ll be taken to Cash App on the web or in the app.
            </p>
            <p className="mt-3 text-sm font-medium text-wedding-muted">{cashApp.cashtag}</p>
            <a
              href={cashApp.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-wedding-terracotta px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-wedding-terracotta-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-wedding-teal"
            >
              Open Cash App
            </a>
          </li>

        </ul>

        <p className="mt-12 text-center text-sm text-wedding-silver">
          <Link href="/" className="font-semibold text-wedding-teal transition hover:text-wedding-teal-dark">
            ← Back to home
          </Link>
          <span className="mx-2 text-wedding-silver-light">·</span>
          <Link href="/invite" className="font-semibold text-wedding-teal transition hover:text-wedding-teal-dark">
            RSVP
          </Link>
        </p>
      </main>

      <footer className="border-t border-wedding-silver-light bg-wedding-field/40">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-center text-xs text-wedding-muted sm:text-sm">
            Kasi &amp; Tommy · June 11, 2026 · Hollow Hill Event Center
          </p>
        </div>
      </footer>
    </div>
  )
}
