import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BadgeCard } from "@/components/badges/BadgeCard";
import { GuidePreviewCard } from "@/components/guides/GuidePreviewCard";
import { CategoryGrid } from "@/components/destinations/CategoryGrid";
import { AppStoreBadges } from "@/components/home/AppStoreBadges";
import {
  DESTINATIONS,
  type Destination,
  type DestinationSlug,
} from "@/lib/constants";
import {
  CATEGORY_BREAKDOWN,
  SAMPLE_BADGES,
  SAMPLE_GUIDES,
} from "@/lib/mock-data";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  touristDestinationSchema,
} from "@/lib/structured-data";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = DESTINATIONS.find((d) => d.slug === slug);
  if (!destination) return {};

  const title = `${destination.brandName} — ${destination.country} | Ody Hop`;
  const description = `${destination.tagline}. Collect ${destination.badgeCount} badges across 8 categories on Ody Hop.`;

  return {
    title,
    description,
    openGraph: {
      title: `${destination.brandName} — ${destination.country}`,
      description,
      type: "website",
      siteName: "Ody Hop",
      images: [
        {
          url: destination.heroImage,
          width: 1200,
          height: 630,
          alt: `${destination.brandName} hero photo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${destination.brandName} — ${destination.country}`,
      description,
      images: [destination.heroImage],
    },
  };
}

export default async function DestinationPage({ params }: PageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const destination = DESTINATIONS.find((d) => d.slug === slug);
  if (!destination) notFound();

  return (
    <>
      <JsonLd
        data={[
          touristDestinationSchema(destination),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Destinations", path: "/destinations" },
            {
              name: `${destination.brandName} — ${destination.country}`,
              path: `/destinations/${destination.slug}`,
            },
          ]),
        ]}
      />
      <DestinationContent destination={destination} />
    </>
  );
}

function DestinationContent({ destination }: { destination: Destination }) {
  const t = useTranslations("destinations");
  const tc = useTranslations("common");

  const slug = destination.slug as DestinationSlug;
  const badges = SAMPLE_BADGES[slug] ?? [];
  const guides = SAMPLE_GUIDES[slug] ?? [];
  const breakdown = CATEGORY_BREAKDOWN[slug];

  return (
    <>
      <DestinationHero
        destination={destination}
        guideCount={guides.length}
        labels={{
          badges: tc("badges"),
          categories: tc("categories"),
          guides: t("guides"),
        }}
      />

      <section
        aria-label="Categories"
        className="bg-ocean py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("categories")} />
          <div className="mt-12">
            <CategoryGrid breakdown={breakdown} />
          </div>
        </div>
      </section>

      <section
        aria-label="Top experiences"
        className="bg-[#0e2444] py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("topExperiences")} />
          <div className="relative mt-12">
            <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              {badges.map((badge) => (
                <li
                  key={badge.id}
                  className="w-[260px] shrink-0 snap-start sm:w-[280px]"
                >
                  <BadgeCard badge={badge} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        aria-label="Local guides"
        className="bg-ocean py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("meetGuides")} />
          {guides.length >= 3 ? (
            <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {guides.map((guide) => (
                <li key={guide.id}>
                  <GuidePreviewCard guide={guide} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-12 font-body text-base italic text-warmgray">
              {t("guidesComingSoon")}
            </p>
          )}
        </div>
      </section>

      <DestinationDownloadCta destination={destination} />
    </>
  );
}

function DestinationHero({
  destination,
  guideCount,
  labels,
}: {
  destination: Destination;
  guideCount: number;
  labels: { badges: string; categories: string; guides: string };
}) {
  return (
    <section
      aria-label="Destination hero"
      className="relative isolate flex h-[420px] items-end overflow-hidden border-b border-glass-border"
    >
      <Image
        src={destination.heroImage}
        alt={`${destination.brandName} — ${destination.country}`}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[rgba(11,31,58,0.92)] via-[rgba(11,31,58,0.55)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(242,169,0,0.12),transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8 lg:pb-16">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
          <span aria-hidden className="mr-2">{destination.flag}</span>
          {destination.country}
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
          {destination.brandName}
        </h1>
        <p className="mt-3 max-w-2xl font-body text-base text-warmgray sm:text-lg">
          {destination.tagline}
        </p>
        <p className="mt-6 font-body text-xs font-semibold uppercase tracking-[0.2em] text-warmgray">
          {destination.badgeCount} {labels.badges}
          <Sep />
          8 {labels.categories}
          <Sep />
          {guideCount} {labels.guides}
        </p>
      </div>
    </section>
  );
}

function DestinationDownloadCta({
  destination,
}: {
  destination: Destination;
}) {
  const t = useTranslations("destinations");

  return (
    <section
      aria-label="Download CTA"
      className="relative overflow-hidden bg-ocean py-20 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(242,169,0,0.18),transparent_55%),radial-gradient(circle_at_85%_50%,rgba(242,169,0,0.08),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="flex flex-col gap-5 text-center lg:col-span-8 lg:text-left">
          <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            {t("readyToExplore", { country: destination.country })}
          </h2>
          <p className="mx-auto max-w-xl font-body text-base text-warmgray sm:text-lg lg:mx-0">
            {t("downloadAndCollect")}
          </p>
          <div>
            <AppStoreBadges className="justify-center lg:justify-start" />
          </div>
        </div>

        <div className="flex justify-center lg:col-span-4 lg:justify-end">
          <div className="relative aspect-square w-[200px] sm:w-[260px] lg:w-[320px]">
            <div
              aria-hidden
              className="absolute inset-x-8 bottom-2 h-4 rounded-[50%] bg-amber/20 blur-2xl"
            />
            <div className="relative h-full w-full animate-float-slow">
              <Image
                src="/assets/branding/ody-explorer.png"
                alt="Ody, the otter explorer"
                fill
                sizes="(max-width: 640px) 200px, (max-width: 1024px) 260px, 320px"
                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sep() {
  return <span aria-hidden className="mx-3 text-amber/60">·</span>;
}
