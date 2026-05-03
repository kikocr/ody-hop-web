import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DestinationCard } from "@/components/destinations/DestinationCard";
import { DESTINATIONS } from "@/lib/constants";

export function DestinationsCarousel() {
  const t = useTranslations("home");

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
          <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-3 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            {DESTINATIONS.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                variant="compact"
                className="w-[280px] shrink-0 snap-start sm:w-[320px]"
              />
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
