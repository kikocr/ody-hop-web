import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { OdyEvolution } from "@/components/home/OdyEvolution";
import { DestinationsCarousel } from "@/components/home/DestinationsCarousel";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { FinalCta } from "@/components/home/FinalCta";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema } from "@/lib/structured-data";
import { buildPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return buildPageMetadata({
    title: t("heroTitle"),
    description: t("heroSubtitle"),
    path: "/",
    locale,
    image: "/assets/splash.png",
  });
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd data={organizationSchema()} />
      <Hero />
      <HowItWorks />
      <OdyEvolution />
      <DestinationsCarousel />
      <FeaturesGrid />
      <StatsSection />
      <FinalCta />
    </>
  );
}
