import Link from "next/link";
import { DESTINATIONS } from "@/lib/constants";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/", label: "Home" },
      { href: "/destinations", label: "Destinations" },
      { href: "/download", label: "Download App" },
      { href: "/about", label: "About" },
    ],
  },
  {
    heading: "For Guides",
    links: [
      { href: "/operators", label: "Why Ody Hop" },
      { href: "/operators/apply", label: "Apply Now" },
      { href: "/operators/login", label: "Operator Login" },
      { href: "/operators/dashboard", label: "Dashboard" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "mailto:hello@odyhop.com", label: "Contact" },
    ],
  },
];

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com/odyhop",
    icon: InstagramIcon,
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com/odyhop",
    icon: TwitterIcon,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@odyhop",
    icon: TikTokIcon,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-glass-border bg-ocean-dark">
      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-display text-2xl font-bold tracking-wide text-amber"
              aria-label="Ody Hop home"
            >
              <span aria-hidden className="text-2xl">🦦</span>
              <span>Ody Hop</span>
            </Link>
            <p className="font-body text-sm text-warmgray">
              Collect the world. One badge at a time.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-card border border-glass-border text-white transition-colors hover:bg-glass-bg hover:text-amber"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-amber">
              Destinations
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {DESTINATIONS.map((dest) => (
                <li key={dest.id}>
                  <Link
                    href={`/destinations/${dest.slug}`}
                    className="font-body text-sm text-warmgray transition-colors hover:text-amber"
                  >
                    <span aria-hidden className="mr-2">{dest.flag}</span>
                    {dest.brandName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.slice(1).map((column) => (
            <div key={column.heading}>
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-amber">
                {column.heading}
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-body text-sm text-warmgray transition-colors hover:text-amber"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-glass-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-warmgray">
            © 2026 Ody Hop. All rights reserved.
          </p>
          <div className="flex items-center gap-3 font-body text-xs text-warmgray">
            <span>Language:</span>
            <span className="rounded-card border border-glass-border bg-glass-bg px-2 py-1 font-semibold text-amber">
              EN
            </span>
            <span className="rounded-card border border-glass-border px-2 py-1 font-semibold text-warmgray">
              ES
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

function TwitterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2H21.5l-7.4 8.456L22.5 22h-6.812l-5.328-6.97L4.3 22H1.04l7.916-9.046L1 2h6.984l4.82 6.36L18.244 2zm-1.193 18h1.852L7.04 4H5.04l12.011 16z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-6.39 6.83 6.84 6.84 0 0 0 11.18 5.27 6.74 6.74 0 0 0 2.59-5.32V9.04a8.16 8.16 0 0 0 4.77 1.52V7.11a4.85 4.85 0 0 1-2.92-.42z" />
    </svg>
  );
}
