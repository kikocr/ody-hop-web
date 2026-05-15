import Image from "next/image";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { OTTER_TIERS } from "@/lib/constants";

const TIER_TRANSLATION_KEYS = {
  newcomer: {
    label: "evolutionTierNewcomerLabel",
    desc: "evolutionTierNewcomerDesc",
  },
  regular: {
    label: "evolutionTierRegularLabel",
    desc: "evolutionTierRegularDesc",
  },
  insider: {
    label: "evolutionTierInsiderLabel",
    desc: "evolutionTierInsiderDesc",
  },
  local: {
    label: "evolutionTierLocalLabel",
    desc: "evolutionTierLocalDesc",
  },
  legend: {
    label: "evolutionTierLegendLabel",
    desc: "evolutionTierLegendDesc",
  },
} as const;

export function OdyEvolution() {
  const t = useTranslations("home");

  return (
    <section
      aria-label="Avatar evolution"
      className="relative overflow-hidden bg-ocean py-20 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(242,169,0,0.10),transparent_50%),radial-gradient(circle_at_50%_80%,rgba(108,74,182,0.18),transparent_55%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("evolutionTitle")}
          subtitle={t("evolutionSubtitle")}
          align="center"
        />

        <ol className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-2">
          {OTTER_TIERS.map((tier, index) => {
            const keys = TIER_TRANSLATION_KEYS[tier.id];
            const label = t(keys.label);
            const desc = t(keys.desc);
            const range =
              tier.maxBadges === null
                ? `${tier.minBadges}+ badges`
                : `${tier.minBadges}–${tier.maxBadges} badges`;
            return (
              <li
                key={tier.id}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative aspect-square w-[140px] sm:w-[160px] lg:w-[200px]">
                  <div
                    aria-hidden
                    className="absolute inset-x-6 bottom-2 h-3 rounded-[50%] bg-amber/15 blur-xl"
                  />
                  <Image
                    src={tier.image}
                    alt={`Ody as ${label}`}
                    fill
                    sizes="(max-width: 640px) 140px, (max-width: 1024px) 160px, 200px"
                    className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold text-white sm:text-lg">
                  {label}
                </h3>
                <span className="mt-1 inline-flex items-center rounded-card border border-amber/40 bg-amber-soft px-2.5 py-0.5 font-body text-xs font-semibold text-amber">
                  {range}
                </span>
                <p className="mt-2 max-w-[180px] font-body text-xs leading-snug text-warmgray">
                  {desc}
                </p>

                {index < OTTER_TIERS.length - 1 ? (
                  <span
                    aria-hidden
                    className="absolute right-[-14px] top-[60px] hidden text-amber/70 lg:block"
                  >
                    <ChevronRight />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>

        <p className="mt-12 text-center font-body text-xs uppercase tracking-[0.22em] text-warmgray">
          {t("evolutionTopTierNames")}
        </p>
      </div>
    </section>
  );
}

function ChevronRight() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}
