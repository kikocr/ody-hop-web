import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { DESTINATIONS } from "@/lib/constants";

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

export async function Footer() {
  const t = await getTranslations("common");

  const productLinks = [
    { href: "/" as const, label: "Home" },
    { href: "/destinations" as const, label: t("destinations") },
    { href: "/download" as const, label: t("download") },
    { href: "/about" as const, label: t("about") },
  ];

  const guideLinks = [
    { href: "/operators" as const, label: t("forGuides") },
    { href: "/operators/apply" as const, label: t("applyNow") },
    { href: "/operators/login" as const, label: t("logIn") },
  ];

  const companyLinks = [
    { href: "/about" as const, label: t("about") },
    { href: "/privacy" as const, label: t("privacy") },
    { href: "/terms" as const, label: t("terms") },
  ];

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
              {t("destinations")}
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

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-amber">
              {t("forGuides")}
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {guideLinks.map((link) => (
                <li key={link.href}>
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

          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-amber">
              Ody Hop
            </h3>
            <ul className="mt-4 flex flex-col gap-2">
              {productLinks.slice(1).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-warmgray transition-colors hover:text-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {companyLinks.slice(1).map((link) => (
                <li key={link.href}>
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
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-glass-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-xs text-warmgray">{t("copyright")}</p>
          <LanguageSwitcher />
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
