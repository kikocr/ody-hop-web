import { useTranslations } from "next-intl";
import { CountUp } from "@/components/home/CountUp";

export function StatsSection() {
  const t = useTranslations("home");

  return (
    <section
      aria-label="Stats"
      className="relative overflow-hidden bg-ocean-dark py-20 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,169,0,0.10),transparent_50%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          <Stat value={6} label={t("statsDestinations")} />
          <Stat value={550} suffix="+" label={t("statsBadges")} />
          <Stat value={8} label={t("statsCategories")} />
        </ul>

        <p className="mt-14 text-center font-body text-sm italic text-warmgray">
          {t("testimonialsComing")}
        </p>
      </div>
    </section>
  );
}

function Stat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  return (
    <li className="flex flex-col items-center text-center">
      <span className="font-display text-6xl font-bold tracking-tight text-amber sm:text-7xl">
        <CountUp end={value} suffix={suffix} />
      </span>
      <span className="mt-2 font-body text-sm font-semibold uppercase tracking-[0.18em] text-warmgray">
        {label}
      </span>
    </li>
  );
}
