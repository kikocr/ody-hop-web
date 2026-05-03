import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { AppStoreBadges } from "@/components/home/AppStoreBadges";
import { CATEGORIES, DESTINATIONS } from "@/lib/constants";

type PageProps = { params: Promise<{ locale: string }> };

export default async function DestinationsHubPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HubContent />;
}

function HubContent() {
  const t = useTranslations("destinations");
  const tc = useTranslations("common");
  const th = useTranslations("home");

  const totalBadges = DESTINATIONS.reduce(
    (sum, dest) => sum + dest.badgeCount,
    0
  );

  return (
    <>
      <section
        aria-label="Destinations hero"
        className="relative isolate flex h-[300px] items-center justify-center overflow-hidden border-b border-glass-border"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean-light via-ocean to-ocean"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
        >
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2">
            {DESTINATIONS.slice(0, 6).map((dest, i) => (
              <div key={dest.id} className="relative overflow-hidden">
                <Image
                  src={dest.heroImage}
                  alt=""
                  fill
                  sizes="33vw"
                  className="object-cover"
                  priority={i < 3}
                />
              </div>
            ))}
          </div>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean/85 via-ocean/70 to-ocean"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(242,169,0,0.18),transparent_60%)]"
        />

        <div className="relative px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            {t("hubTitle")}
          </h1>
          <p className="mt-3 font-body text-base text-warmgray sm:text-lg">
            {t("hubSubtitle")}
          </p>
          <p className="mt-6 font-body text-xs font-semibold uppercase tracking-[0.22em] text-warmgray">
            {DESTINATIONS.length} {th("statsDestinations")}
            <Separator />
            {totalBadges}+ {tc("badges")}
            <Separator />
            {CATEGORIES.length} {tc("categories")}
          </p>
        </div>
      </section>

      <section
        aria-label="All destinations"
        className="bg-ocean py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="grid grid-cols-1 gap-6 sm:gap-7 lg:grid-cols-2 xl:gap-8">
            {DESTINATIONS.map((dest) => (
              <li key={dest.id}>
                <DestinationCard destination={dest} variant="full" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        aria-label="Coming soon"
        className="relative overflow-hidden bg-ocean-dark py-20 sm:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,169,0,0.10),transparent_55%)]"
        />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {th("moreDestinations")}
          </h2>
          <p className="font-body text-base text-warmgray sm:text-lg">
            {t("downloadCta")}.
          </p>
          <AppStoreBadges className="justify-center" />
        </div>
      </section>
    </>
  );
}

function Separator() {
  return <span aria-hidden className="mx-3 text-amber/60">·</span>;
}
