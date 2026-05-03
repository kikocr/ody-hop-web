import type { ReactNode } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("dashboard");

  const navItems = [
    { href: "/operators/dashboard", label: t("home") },
    { href: "/operators/dashboard/listings", label: t("listings") },
    { href: "/operators/dashboard/bookings", label: t("bookings") },
    { href: "/operators/dashboard/reviews", label: t("reviews") },
    { href: "/operators/dashboard/profile", label: t("profile") },
    { href: "/operators/dashboard/billing", label: t("billing") },
  ] as const;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:px-8 lg:py-12">
      <aside
        aria-label="Dashboard navigation"
        className="lg:w-60 lg:shrink-0"
      >
        <nav className="rounded-card border border-glass-border bg-glass-bg p-3 backdrop-blur-glass">
          <ul className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:gap-0.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block whitespace-nowrap rounded-card px-4 py-2 font-body text-sm font-medium text-white/85 transition-colors hover:bg-amber-soft hover:text-amber"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
