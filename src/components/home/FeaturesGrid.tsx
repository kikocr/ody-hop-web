import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function FeaturesGrid() {
  const t = useTranslations("home");

  const features = [
    { emoji: "📍", title: t("feature1"), desc: t("feature1Desc") },
    { emoji: "🗺️", title: t("feature2"), desc: t("feature2Desc") },
    { emoji: "🏆", title: t("feature3"), desc: t("feature3Desc") },
    { emoji: "🎁", title: t("feature4"), desc: t("feature4Desc") },
    { emoji: "🧑‍✈️", title: t("feature5"), desc: t("feature5Desc") },
    { emoji: "🌐", title: t("feature6"), desc: t("feature6Desc") },
  ];

  return (
    <section aria-label="Features" className="bg-ocean py-20 sm:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("featuresTitle")} align="center" />

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title}>
              <GlassCard className="h-full transition-colors duration-200 hover:border-amber/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-card bg-amber-soft text-2xl">
                  <span aria-hidden>{feature.emoji}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 font-body text-sm text-warmgray">
                  {feature.desc}
                </p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
