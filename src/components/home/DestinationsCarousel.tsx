import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Link } from "@/i18n/routing";
import { DESTINATIONS } from "@/lib/constants";

export function DestinationsCarousel() {
  const t = useTranslations("home");
  const td = useTranslations("destinations");
  const tc = useTranslations("common");

  return (
    <section
      aria-label="Destinations"
      className="relative bg-[#0e2444] py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("destinationsTitle")}
          subtitle={t("destinationsSubtitle")}
        />

        <div className="relative mt-12">
          <div
            className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
          >
            {DESTINATIONS.map((dest) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="group relative flex w-[280px] shrink-0 snap-start flex-col overflow-hidden rounded-card border border-glass-border bg-glass-bg backdrop-blur-glass transition-transform duration-200 hover:-translate-y-1 sm:w-[320px]"
              >
                <div className="relative h-[220px] w-full overflow-hidden">
                  <Image
                    src={dest.heroImage}
                    alt={`${dest.brandName} — ${dest.country}`}
                    fill
                    sizes="(max-width: 640px) 280px, 320px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ocean-dark via-ocean/40 to-transparent"
                  />
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-card bg-amber px-2.5 py-1 font-body text-xs font-bold text-ocean">
                    {dest.badgeCount} {tc("badges")}
                  </span>
                </div>
                <div className="flex flex-col gap-1 p-5">
                  <span className="font-body text-xs uppercase tracking-widest text-warmgray">
                    <span aria-hidden className="mr-1">{dest.flag}</span>
                    {dest.country}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">
                    {dest.brandName}
                  </h3>
                  <p className="font-body text-sm text-warmgray">
                    {dest.tagline}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 font-body text-sm font-semibold text-amber transition-transform duration-150 group-hover:translate-x-0.5">
                    {td("exploreCta")}
                    <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="mt-6 text-center font-body text-sm italic text-warmgray sm:text-left">
            {t("moreDestinations")}
          </p>
        </div>
      </div>
    </section>
  );
}
