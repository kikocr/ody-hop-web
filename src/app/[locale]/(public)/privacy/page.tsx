import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalContent } from "@/components/legal/LegalContent";
import { buildPageMetadata } from "@/lib/metadata";

// TODO(legal): Replace "Ody Hop" with the registered legal entity name in the
// privacy policy copy before public launch.

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return buildPageMetadata({
    title: t("title"),
    description: t("metaDescription"),
    path: "/privacy",
    locale,
    image: "/assets/splash.png",
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalContent namespace="privacy" />;
}
