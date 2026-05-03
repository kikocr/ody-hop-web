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
  const { locale } = await params;
  setRequestLocale(locale);
  return <DashboardShell>{children}</DashboardShell>;
}
