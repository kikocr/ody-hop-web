import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

type PageProps = { params: Promise<{ locale: string }> };

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("about");

  return (
    <>
      <section
        aria-label="About hero"
        className="relative isolate flex h-[250px] items-center justify-center overflow-hidden border-b border-glass-border"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean-light via-ocean to-ocean"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(242,169,0,0.18),transparent_55%)]"
        />
        <div className="relative px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-2xl font-body text-base text-warmgray sm:text-lg">
            {t("mission")}
          </p>
        </div>
      </section>

      <section aria-label="Our story" className="bg-ocean py-20 sm:py-24">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <SectionHeader title={t("storyTitle")} />
            <div className="mt-8 flex flex-col gap-5 font-body text-base text-warmgray sm:text-lg">
              <p>{t("storyPara1")}</p>
              <p>{t("storyPara2")}</p>
              <p>{t("storyPara3")}</p>
            </div>
          </div>
          <div className="order-1 flex justify-center lg:order-2 lg:col-span-5 lg:justify-end">
            <div className="relative aspect-square w-[260px] sm:w-[340px] lg:w-[420px]">
              <div
                aria-hidden
                className="absolute inset-x-8 bottom-2 h-5 rounded-[50%] bg-amber/20 blur-2xl"
              />
              <div className="relative h-full w-full animate-float-slow">
                <Image
                  src="/assets/splash.png"
                  alt="Ody on a globe with map pins"
                  fill
                  sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 420px"
                  className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label="The team"
        className="bg-[#0e2444] py-20 sm:py-24"
      >
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={t("teamTitle")}
            subtitle={t("teamSubtitle")}
            align="center"
          />
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <li>
              <FounderCard
                name={t("founder1Name")}
                role={t("founder1Role")}
                bio={t("founder1Bio")}
                initials="F1"
              />
            </li>
            <li>
              <FounderCard
                name={t("founder2Name")}
                role={t("founder2Role")}
                bio={t("founder2Bio")}
                initials="F2"
              />
            </li>
          </ul>
        </div>
      </section>

      <section aria-label="Values" className="bg-ocean py-20 sm:py-24">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader title={t("valuesTitle")} align="center" />
          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
            <li>
              <ValueCard
                badge="01"
                title={t("value1Title")}
                desc={t("value1Desc")}
              />
            </li>
            <li>
              <ValueCard
                badge="02"
                title={t("value2Title")}
                desc={t("value2Desc")}
              />
            </li>
            <li>
              <ValueCard
                badge="03"
                title={t("value3Title")}
                desc={t("value3Desc")}
              />
            </li>
          </ul>
        </div>
      </section>

      <section
        aria-label="Press and partnerships"
        className="relative overflow-hidden bg-ocean-dark py-20 sm:py-24"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(242,169,0,0.10),transparent_55%)]"
        />
        <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {t("pressTitle")}
          </h2>
          <p className="font-body text-base text-warmgray sm:text-lg">
            {t("pressDesc")}
          </p>
          <Button
            href={`mailto:${t("pressEmail")}`}
            variant="primary"
            size="lg"
          >
            {t("pressCta")}
          </Button>
          <span className="font-body text-xs uppercase tracking-[0.2em] text-warmgray">
            {t("pressEmail")}
          </span>
        </div>
      </section>
    </>
  );
}

function FounderCard({
  name,
  role,
  bio,
  initials,
}: {
  name: string;
  role: string;
  bio: string;
  initials: string;
}) {
  return (
    <GlassCard className="flex h-full flex-col items-center gap-4 text-center transition-colors duration-200 hover:border-amber/40">
      <div
        aria-hidden
        className="flex h-20 w-20 items-center justify-center rounded-full border border-amber/30 bg-amber-soft font-display text-2xl font-bold text-amber"
      >
        {initials}
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold text-white">
          {name}
        </h3>
        <p className="mt-1 font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber">
          {role}
        </p>
      </div>
      <p className="font-body text-sm text-warmgray">{bio}</p>
    </GlassCard>
  );
}

function ValueCard({
  badge,
  title,
  desc,
}: {
  badge: string;
  title: string;
  desc: string;
}) {
  return (
    <GlassCard className="flex h-full flex-col gap-4 transition-colors duration-200 hover:border-amber/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-card bg-amber font-display text-lg font-bold text-ocean">
        {badge}
      </div>
      <h3 className="font-display text-xl font-semibold text-white">
        {title}
      </h3>
      <p className="font-body text-sm text-warmgray">{desc}</p>
    </GlassCard>
  );
}
