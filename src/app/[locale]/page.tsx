import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { OdyEvolution } from "@/components/home/OdyEvolution";
import { DestinationsCarousel } from "@/components/home/DestinationsCarousel";
import { FeaturesGrid } from "@/components/home/FeaturesGrid";
import { StatsSection } from "@/components/home/StatsSection";
import { FinalCta } from "@/components/home/FinalCta";

type PageProps = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
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
