"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useAuth } from "@/components/providers/AuthProvider";

type DashboardKey =
  | "home"
  | "listings"
  | "bookings"
  | "reviews"
  | "profile"
  | "billing";

type NavItem = {
  href: string;
  key: DashboardKey;
  icon: () => ReactNode;
};

const NAV_ITEMS: ReadonlyArray<NavItem> = [
  { href: "/operators/dashboard", key: "home", icon: HomeIcon },
  { href: "/operators/dashboard/listings", key: "listings", icon: ListIcon },
  { href: "/operators/dashboard/bookings", key: "bookings", icon: CalendarIcon },
  { href: "/operators/dashboard/reviews", key: "reviews", icon: StarIcon },
  { href: "/operators/dashboard/profile", key: "profile", icon: UserIcon },
  { href: "/operators/dashboard/billing", key: "billing", icon: CardIcon },
];

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

function derivePageKey(pathname: string): DashboardKey {
  const stripped = pathname.replace(/^\/operators\/dashboard\/?/, "");
  switch (stripped) {
    case "":
      return "home";
    case "listings":
      return "listings";
    case "bookings":
      return "bookings";
    case "reviews":
      return "reviews";
    case "profile":
      return "profile";
    case "billing":
      return "billing";
    default:
      return "home";
  }
}

function deriveInitials(name: string | null | undefined): string {
  if (!name) return "OP";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "OP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const t = useTranslations("dashboard");
  const pathname = usePathname();
  const router = useRouter();
  const { profile, guide, isLoading, signOut } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

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

  const pageKey = derivePageKey(pathname);
  const pageTitle = t(pageKey);

  const operatorName = useMemo(
    () => guide?.business_name || profile?.display_name || "",
    [guide, profile]
  );
  const initials = useMemo(
    () => deriveInitials(operatorName),
    [operatorName]
  );

  async function handleSignOut() {
    await signOut();
    router.replace("/operators/login");
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-ocean">
        <div className="flex flex-col items-center gap-3">
          <span
            aria-hidden
            className="h-9 w-9 animate-spin rounded-full border-2 border-amber border-t-transparent"
          />
          <p className="font-body text-sm text-warmgray">
            {t("loadingDashboard")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ocean">
      <DesktopSidebar
        currentKey={pageKey}
        operatorName={operatorName}
        initials={initials}
        onSignOut={handleSignOut}
      />

      <MobileTopBar onMenuOpen={() => setMobileOpen(true)} />
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentKey={pageKey}
        operatorName={operatorName}
        initials={initials}
        onSignOut={handleSignOut}
      />

      <div className="flex min-h-screen flex-col lg:pl-60">
        <DesktopTopBar
          title={pageTitle}
          operatorName={operatorName}
          initials={initials}
          onSignOut={handleSignOut}
        />
        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

/* ---------------- Sidebar (desktop) ---------------- */

function DesktopSidebar({
  currentKey,
  operatorName,
  initials,
  onSignOut,
}: {
  currentKey: DashboardKey;
  operatorName: string;
  initials: string;
  onSignOut: () => void;
}) {
  const t = useTranslations("dashboard");
  return (
    <aside
      aria-label="Dashboard navigation"
      className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-glass-border bg-[#0e2444] lg:flex"
    >
      <Link
        href="/operators/dashboard"
        className="flex h-20 items-center gap-2 border-b border-glass-border px-5 font-display text-2xl font-bold tracking-wide text-amber"
        aria-label="Ody Hop dashboard"
      >
        <Image
          src="/assets/icon.png"
          alt=""
          width={32}
          height={32}
          priority
          className="h-8 w-8 shrink-0 rounded-lg"
        />
        <span>Ody Hop</span>
      </Link>

      <nav aria-label="Dashboard primary" className="flex-1 px-3 py-4">
        <SidebarNav currentKey={currentKey} />
      </nav>

      <div className="border-t border-glass-border px-5 py-4">
        <UserBlock
          operatorName={operatorName}
          initials={initials}
          onSignOut={onSignOut}
          signOutLabel={t("signOut")}
        />
      </div>
    </aside>
  );
}

function SidebarNav({
  currentKey,
  onNavigate,
}: {
  currentKey: DashboardKey;
  onNavigate?: () => void;
}) {
  const t = useTranslations("dashboard");
  return (
    <ul className="flex flex-col gap-1">
      {NAV_ITEMS.map((item) => {
        const active = item.key === currentKey;
        const Icon = item.icon;
        return (
          <li key={item.key}>
            <Link
              href={item.href as "/operators/dashboard"}
              onClick={onNavigate}
              className={cn(
                "group relative flex items-center gap-3 rounded-card px-3 py-2.5 font-body text-sm font-medium transition-colors",
                active
                  ? "bg-amber-soft text-amber"
                  : "text-warmgray hover:bg-glass-bg hover:text-white"
              )}
            >
              {active ? (
                <span
                  aria-hidden
                  className="absolute -left-3 top-1/2 h-6 -translate-y-1/2 rounded-r-card border-l-[3px] border-amber"
                />
              ) : null}
              <span className="flex h-5 w-5 shrink-0 items-center justify-center">
                <Icon />
              </span>
              <span>{t(item.key)}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function UserBlock({
  operatorName,
  initials,
  onSignOut,
  signOutLabel,
}: {
  operatorName: string;
  initials: string;
  onSignOut: () => void;
  signOutLabel: string;
}) {
  return <UserBlockInner operatorName={operatorName} initials={initials} onSignOut={onSignOut} signOutLabel={signOutLabel} />;
}

function UserBlockInner({
  operatorName,
  initials,
  onSignOut,
  signOutLabel,
}: {
  operatorName: string;
  initials: string;
  onSignOut: () => void;
  signOutLabel: string;
}) {
  const t = useTranslations("dashboard");
  const roleLabel = t("operatorRoleLabel");
  const fallbackName = t("operatorFallbackName");
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber/30 bg-amber-soft font-display text-sm font-bold text-amber"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate font-body text-sm font-semibold text-white">
            {operatorName || fallbackName}
          </p>
          <p className="font-body text-[10px] uppercase tracking-wider text-warmgray">
            {roleLabel}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSignOut}
        className="inline-flex items-center justify-between rounded-card border border-glass-border bg-glass-bg px-3 py-2 font-body text-xs font-semibold text-warmgray transition-colors hover:border-amber/40 hover:text-amber"
      >
        <span>{signOutLabel}</span>
        <SignOutIcon />
      </button>
    </div>
  );
}

/* ---------------- Topbar (desktop) ---------------- */

function DesktopTopBar({
  title,
  operatorName,
  initials,
  onSignOut,
}: {
  title: string;
  operatorName: string;
  initials: string;
  onSignOut: () => void;
}) {
  const t = useTranslations("dashboard");
  const roleLabel = t("operatorRoleLabel");
  const fallbackName = t("operatorFallbackName");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onClick = () => setOpen(false);
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  return (
    <div className="hidden h-20 items-center justify-between border-b border-glass-border bg-[rgba(11,31,58,0.95)] backdrop-blur-glass px-6 lg:flex lg:px-10">
      <h1 className="font-display text-2xl font-semibold text-white">
        {title}
      </h1>
      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="flex items-center gap-3 rounded-card border border-glass-border bg-glass-bg px-3 py-1.5 transition-colors hover:border-amber/40"
        >
          <span
            aria-hidden
            className="flex h-9 w-9 items-center justify-center rounded-full border border-amber/30 bg-amber-soft font-display text-sm font-bold text-amber"
          >
            {initials}
          </span>
          <span className="hidden flex-col items-start sm:flex">
            <span className="font-body text-xs uppercase tracking-wider text-warmgray">
              {roleLabel}
            </span>
            <span className="font-body text-sm font-semibold text-white">
              {operatorName || fallbackName}
            </span>
          </span>
          <ChevronDownIcon />
        </button>

        {open ? (
          <div
            role="menu"
            onClick={(e) => e.stopPropagation()}
            className="absolute right-0 top-full z-40 mt-2 w-56 overflow-hidden rounded-card border border-glass-border bg-ocean-dark shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
          >
            <Link
              href="/operators/dashboard/profile"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 font-body text-sm text-white transition-colors hover:bg-glass-bg"
            >
              <UserIcon />
              <ProfileMenuLabel />
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onSignOut();
              }}
              className="flex w-full items-center gap-2 border-t border-glass-border px-4 py-2.5 font-body text-sm text-alert transition-colors hover:bg-alert/10"
            >
              <SignOutIcon />
              <SignOutMenuLabel />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProfileMenuLabel() {
  const t = useTranslations("dashboard");
  return <span>{t("viewProfile")}</span>;
}

function SignOutMenuLabel() {
  const t = useTranslations("dashboard");
  return <span>{t("signOut")}</span>;
}

/* ---------------- Mobile (top bar + drawer) ---------------- */

function MobileTopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const t = useTranslations("dashboard");
  return (
    <div className="flex h-16 items-center justify-between border-b border-glass-border bg-[rgba(11,31,58,0.95)] backdrop-blur-glass px-4 lg:hidden">
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label={t("menu")}
        className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-glass-border text-white transition-colors hover:bg-glass-bg"
      >
        <HamburgerIcon />
      </button>
      <Link
        href="/operators/dashboard"
        className="flex items-center gap-2 font-display text-lg font-bold text-amber"
      >
        <Image
          src="/assets/icon.png"
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 shrink-0 rounded-lg"
        />
        <span>Ody Hop</span>
      </Link>
      <button
        type="button"
        aria-label={t("notifications")}
        className="inline-flex h-10 w-10 items-center justify-center rounded-card border border-glass-border text-white transition-colors hover:bg-glass-bg"
      >
        <BellIcon />
      </button>
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  currentKey,
  operatorName,
  initials,
  onSignOut,
}: {
  open: boolean;
  onClose: () => void;
  currentKey: DashboardKey;
  operatorName: string;
  initials: string;
  onSignOut: () => void;
}) {
  const t = useTranslations("dashboard");
  return (
    <>
      <div
        aria-hidden
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-ocean-dark/70 backdrop-blur-sm transition-opacity duration-200 lg:hidden",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      />
      <aside
        aria-label="Dashboard navigation"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(82vw,300px)] flex-col bg-[#0e2444] border-r border-glass-border shadow-2xl",
          "transition-transform duration-200 ease-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-glass-border px-4">
          <Link
            href="/operators/dashboard"
            className="flex items-center gap-2 font-display text-lg font-bold text-amber"
          >
            <Image
              src="/assets/icon.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 shrink-0 rounded-lg"
            />
            <span>Ody Hop</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="inline-flex h-9 w-9 items-center justify-center rounded-card border border-glass-border text-white transition-colors hover:bg-glass-bg"
          >
            <CloseIcon />
          </button>
        </div>
        <nav className="flex-1 px-3 py-4" aria-label="Dashboard primary">
          <SidebarNav currentKey={currentKey} onNavigate={onClose} />
        </nav>
        <div className="border-t border-glass-border px-5 py-4">
          <UserBlock
            operatorName={operatorName}
            initials={initials}
            onSignOut={onSignOut}
            signOutLabel={t("signOut")}
          />
        </div>
      </aside>
    </>
  );
}

/* ---------------- Icons ---------------- */

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 11l9-8 9 8" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-6h4v6" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <circle cx="4" cy="6" r="1.4" />
      <circle cx="4" cy="12" r="1.4" />
      <circle cx="4" cy="18" r="1.4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.95 6.59 7.05.77-5.3 4.94 1.5 7.2L12 18.4l-6.2 3.6 1.5-7.2L2 9.36l7.05-.77z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 5-6 8-6s7 2 8 6" />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="6" width="18" height="13" rx="1.5" />
      <path d="M3 10h18" />
      <path d="M7 15h4" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
      <path d="M3 6h18" />
      <path d="M3 12h18" />
      <path d="M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" aria-hidden>
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warmgray" aria-hidden>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
      <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
    </svg>
  );
}
