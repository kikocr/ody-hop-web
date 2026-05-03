import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { DashboardShell } from "@/components/operators/dashboard/DashboardShell";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function DashboardLayout({
  children,
  params,
}: LayoutProps) {
  // Operator dashboard is English-only for V1. Even if the user lands here
  // from a /es/* URL, force translations to resolve in English so the
  // sidebar/topbar/page chrome stays consistent with the dashboard pages
  // themselves (which also call setRequestLocale("en")).
  await params;
  setRequestLocale("en");
  return <DashboardShell>{children}</DashboardShell>;
}
