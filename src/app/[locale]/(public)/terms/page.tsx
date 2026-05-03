import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalContent } from "@/components/legal/LegalContent";
import { buildPageMetadata } from "@/lib/metadata";

// TODO(legal): Update the governing-law jurisdiction in the "Governing law"
// section of the terms before public launch, and confirm the legal entity name.

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "terms" });
  return buildPageMetadata({
    title: t("title"),
    description: t("metaDescription"),
    path: "/terms",
    locale,
    image: "/assets/splash.png",
  });
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalContent namespace="terms" />;
}
