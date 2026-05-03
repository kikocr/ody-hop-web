import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OperatorLoginForm } from "@/components/operators/OperatorLoginForm";
import { buildPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "login" });
  return buildPageMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/operators/login",
    locale,
    image: "/assets/splash.png",
    noindex: true,
  });
}

export default async function OperatorLoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense>
      <OperatorLoginForm />
    </Suspense>
  );
}
