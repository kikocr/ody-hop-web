"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

const NAV_KEYS = [
  { href: "/destinations" as const, key: "destinations" },
  { href: "/operators" as const, key: "forGuides" },
  { href: "/about" as const, key: "about" },
  { href: "/download" as const, key: "download" },
];

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function Header() {
  const t = useTranslations("common");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-shadow duration-200",
          "bg-[rgba(11,31,58,0.95)] backdrop-blur-glass",
          "border-b border-glass-border",
          scrolled && "shadow-[0_8px_32px_-12px_rgba(0,0,0,0.6)]"
        )}
      >
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-bold tracking-wide text-amber sm:text-2xl"
            aria-label="Ody Hop home"
          >
            <Image
              src="/assets/icon.png"
              alt=""
              width={32}
              height={32}
              priority
              className="h-8 w-8 shrink-0"
            />
            <span>Ody Hop</span>
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 lg:flex"
          >
            {NAV_KEYS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-body text-sm font-medium text-white/90 transition-colors hover:text-amber"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher className="hidden sm:inline-flex" />
            <div className="hidden sm:block">
              <Button href="/download" variant="primary" size="md">
                {t("downloadApp")}
              </Button>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-glass-border text-white transition-colors hover:bg-glass-bg lg:hidden"
              aria-label="Open menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>
      </header>

      <div className="h-16 sm:h-20" aria-hidden />

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("common");

  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-ocean-dark/70 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      <aside
        id="mobile-menu"
        aria-label="Mobile navigation"
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-[min(82vw,320px)] bg-ocean-dark border-l border-glass-border shadow-2xl",
          "flex flex-col gap-6 px-6 pt-6 pb-8",
          "transition-transform duration-200 ease-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-bold text-amber">
            Menu
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-glass-border text-white transition-colors hover:bg-glass-bg"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="flex flex-col gap-1" aria-label="Mobile primary">
          {NAV_KEYS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="rounded-card px-3 py-3 font-body text-base font-medium text-white/90 transition-colors hover:bg-glass-bg hover:text-amber"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-body text-xs font-semibold uppercase tracking-widest text-warmgray">
              Language
            </span>
            <LanguageSwitcher />
          </div>
          <Button href="/download" variant="primary" fullWidth>
            {t("downloadApp")}
          </Button>
        </div>
      </aside>
    </>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden
    >
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden
    >
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </svg>
  );
}
