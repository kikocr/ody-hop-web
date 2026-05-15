import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HeroDashboardPreview } from "@/components/operators/HeroDashboardPreview";
import { DashboardMockup } from "@/components/operators/DashboardMockup";
import { buildPageMetadata } from "@/lib/metadata";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "operators" });
  return buildPageMetadata({
    title: t("heroTitle"),
    description: t("heroSubtitle"),
    path: "/operators",
    locale,
    image: "/assets/splash.png",
  });
}

export default async function OperatorsLandingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OperatorsContent />;
}

function OperatorsContent() {
  const t = useTranslations("operators");
  const tc = useTranslations("common");

  return (
    <>
      <Hero t={t} tc={tc} />
      <ValueProps t={t} />
      <HowItWorks t={t} />
      <DashboardPreviewSection t={t} />
      <Pricing t={t} tc={tc} />
      <FinalCta t={t} tc={tc} />
    </>
  );
}

type Translator = ReturnType<typeof useTranslations>;

function Hero({ t, tc }: { t: Translator; tc: Translator }) {
  return (
    <section
      aria-label="Operators hero"
      className="relative isolate overflow-hidden border-b border-glass-border"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean via-ocean to-ocean-light"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(242,169,0,0.18),transparent_55%),radial-gradient(circle_at_85%_70%,rgba(18,58,111,0.55),transparent_55%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8 lg:py-24">
        <div className="flex flex-col gap-6 text-center lg:col-span-7 lg:text-left">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.32em] text-amber">
            {t("heroEyebrow")}
          </span>
          <h1 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto max-w-xl font-body text-base text-warmgray sm:text-lg lg:mx-0">
            {t("heroSubtitle")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button href="/operators/apply" variant="primary" size="lg">
              {tc("applyNow")}
            </Button>
            <Button href="/operators/login" variant="secondary" size="lg">
              {tc("logIn")}
            </Button>
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}

function ValueProps({ t }: { t: Translator }) {
  const values = [
    { icon: <PinIcon />, title: t("value1Title"), desc: t("value1Desc") },
    { icon: <CoinIcon />, title: t("value2Title"), desc: t("value2Desc") },
    { icon: <ShieldIcon />, title: t("value3Title"), desc: t("value3Desc") },
    { icon: <RocketIcon />, title: t("value4Title"), desc: t("value4Desc") },
  ];

  return (
    <section
      aria-label="Why Ody Hop"
      className="bg-[#0e2444] py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("valuePropsTitle")}
          subtitle={t("valuePropsSubtitle")}
          align="center"
        />
        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {values.map((value) => (
            <li key={value.title}>
              <GlassCard className="flex h-full flex-col gap-4 transition-colors duration-200 hover:border-amber/40">
                <div className="flex h-12 w-12 items-center justify-center rounded-card bg-amber-soft text-amber">
                  {value.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-white">
                  {value.title}
                </h3>
                <p className="font-body text-sm text-warmgray sm:text-base">
                  {value.desc}
                </p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function HowItWorks({ t }: { t: Translator }) {
  const steps = [
    t("step1"),
    t("step2"),
    t("step3"),
    t("step4"),
    t("step5"),
  ];

  return (
    <section
      aria-label="How operators work with Ody Hop"
      className="relative bg-ocean py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("howItWorksTitle")} align="center" />

        <ol className="relative mt-16">
          <div
            aria-hidden
            className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-amber/60 via-amber/40 to-amber/0 sm:block lg:left-1/2 lg:-translate-x-1/2"
          />
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isLeft = index % 2 === 0;
            return (
              <li
                key={label}
                className="relative pb-10 last:pb-0 sm:pl-20 lg:pl-0"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-card bg-amber font-display text-lg font-bold text-ocean shadow-[0_8px_24px_-12px_rgba(242,169,0,0.7)] sm:left-0 lg:left-1/2 lg:-translate-x-1/2"
                >
                  {stepNumber}
                </span>

                <div
                  className={[
                    "lg:grid lg:grid-cols-2 lg:gap-16",
                  ].join(" ")}
                >
                  {isLeft ? (
                    <>
                      <GlassCard className="lg:text-right">
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                          {t("stepLabel", { n: stepNumber })}
                        </p>
                        <p className="mt-2 font-display text-lg font-semibold text-white">
                          {label}
                        </p>
                      </GlassCard>
                      <div className="hidden lg:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden lg:block" />
                      <GlassCard>
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-amber">
                          {t("stepLabel", { n: stepNumber })}
                        </p>
                        <p className="mt-2 font-display text-lg font-semibold text-white">
                          {label}
                        </p>
                      </GlassCard>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function DashboardPreviewSection({ t }: { t: Translator }) {
  const callouts = [
    { icon: <BoltIcon />, label: t("dashboardCallout1") },
    { icon: <LayersIcon />, label: t("dashboardCallout2") },
    { icon: <StarIcon />, label: t("dashboardCallout3") },
  ];

  return (
    <section
      aria-label="Dashboard preview"
      className="bg-[#0e2444] py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("dashboardPreviewTitle")}
          subtitle={t("dashboardPreviewSubtitle")}
          align="center"
        />
        <div className="mt-14">
          <DashboardMockup />
        </div>
        <ul className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {callouts.map((callout) => (
            <li
              key={callout.label}
              className="flex items-start gap-3 rounded-card border border-glass-border bg-glass-bg p-4"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-card bg-amber-soft text-amber">
                {callout.icon}
              </span>
              <p className="font-body text-sm font-semibold text-white">
                {callout.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Pricing({ t, tc }: { t: Translator; tc: Translator }) {
  const freeFeatures = [
    t("freeTierF1"),
    t("freeTierF2"),
    t("freeTierF3"),
    t("freeTierF4"),
    t("freeTierF5"),
  ];
  const featuredFeatures = [
    t("featuredTierF1"),
    t("featuredTierF2"),
    t("featuredTierF3"),
    t("featuredTierF4"),
    t("featuredTierF5"),
    t("featuredTierF6"),
  ];

  return (
    <section aria-label="Pricing" className="bg-ocean py-20 sm:py-24">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeader title={t("pricingTitle")} align="center" />

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <PriceCard
            tier={t("freeTier")}
            tagline={t("freeTierDesc")}
            price={t("freePriceLabel")}
            priceSuffix={t("freePriceSuffix")}
            features={freeFeatures}
            cta={tc("applyNow")}
            ctaHref="/operators/apply"
            ctaVariant="primary"
          />
          <PriceCard
            tier={t("featuredTier")}
            tagline={t("featuredTierDesc")}
            price={t("featuredPricePlaceholder")}
            priceSuffix={t("pricingComingSoon")}
            features={featuredFeatures}
            cta={tc("applyNow")}
            ctaHref="/operators/apply"
            ctaVariant="secondary"
            popular
            popularLabel={t("pricingPopular")}
          />
        </div>

        <p className="mt-10 text-center font-body text-sm italic text-warmgray">
          {t("pricingNote")}
        </p>
      </div>
    </section>
  );
}

function PriceCard({
  tier,
  tagline,
  price,
  priceSuffix,
  features,
  cta,
  ctaHref,
  ctaVariant,
  popular,
  popularLabel,
}: {
  tier: string;
  tagline: string;
  price: string;
  priceSuffix: string;
  features: string[];
  cta: string;
  ctaHref: string;
  ctaVariant: "primary" | "secondary";
  popular?: boolean;
  popularLabel?: string;
}) {
  return (
    <GlassCard
      className={[
        "relative flex h-full flex-col gap-5",
        popular && "border-amber/60 bg-amber-soft/30",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {popular && popularLabel ? (
        <span className="absolute -top-3 right-5 inline-flex items-center rounded-card bg-amber px-3 py-1 font-body text-[11px] font-bold uppercase tracking-wider text-ocean shadow-[0_8px_20px_-10px_rgba(242,169,0,0.7)]">
          {popularLabel}
        </span>
      ) : null}

      <div>
        <h3 className="font-display text-2xl font-bold text-white">{tier}</h3>
        <p className="mt-1 font-body text-sm text-warmgray">{tagline}</p>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold text-amber">
          {price}
        </span>
        <span className="font-body text-xs text-warmgray">{priceSuffix}</span>
      </div>

      <ul className="flex flex-col gap-2">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2 font-body text-sm text-warmgray"
          >
            <CheckIcon />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <Button href={ctaHref} variant={ctaVariant} fullWidth>
          {cta}
        </Button>
      </div>
    </GlassCard>
  );
}

function FinalCta({ t, tc }: { t: Translator; tc: Translator }) {
  return (
    <section
      aria-label="Final call to action"
      className="relative overflow-hidden bg-ocean-dark py-20 sm:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,169,0,0.16),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent"
      />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
          {t("finalCtaTitle")}
        </h2>
        <Button href="/operators/apply" variant="primary" size="lg">
          {t("applyCta")}
        </Button>
        <p className="font-body text-sm text-warmgray">
          {t("alreadyPartner")}{" "}
          <Link
            href="/operators/login"
            className="font-semibold text-amber hover:underline"
          >
            {t("loginLink")}
          </Link>
        </p>
        <p className="sr-only">{tc("logIn")}</p>
      </div>
    </section>
  );
}

/* --- icons --- */

function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s7-7 7-12a7 7 0 1 0-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="9" r="2.6" />
    </svg>
  );
}

function CoinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14.5 3.5c4 0 6 2 6 6 0 6-7 11-9 11 0 0-1.5-3-1.5-4l4-4-4-1c0-2 5-8 4.5-8z" />
      <circle cx="15" cy="9" r="1.4" />
      <path d="M5 14c-1 1-1 4-1 5 1 0 4 0 5-1" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M13 2 4 14h6l-1 8 9-12h-6z" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
      <path d="M3 17l9 5 9-5" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.95 6.59 7.05.77-5.3 4.94 1.5 7.2L12 18.4l-6.2 3.6 1.5-7.2L2 9.36l7.05-.77z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F2A900"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="mt-0.5 shrink-0"
    >
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}
