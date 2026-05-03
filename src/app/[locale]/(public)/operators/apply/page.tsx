import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OperatorApplicationForm } from "@/components/operators/apply/OperatorApplicationForm";
import { buildPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apply" });
  return buildPageMetadata({
    title: t("title"),
    description: t("subtitle"),
    path: "/operators/apply",
    locale,
    image: "/assets/splash.png",
  });
}

export default async function OperatorApplyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OperatorApplicationForm />;
}
