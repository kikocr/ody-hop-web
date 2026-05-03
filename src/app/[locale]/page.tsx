import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

type PageProps = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("home");
  const tc = useTranslations("common");

  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean via-ocean to-ocean-light opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(242,169,0,0.12),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(18,58,111,0.6),transparent_60%)]"
      />

      <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-amber">
          Ody Hop · Coming Soon
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl">
          {t("heroTitle")}
        </h1>
        <p className="max-w-xl font-body text-base text-warmgray sm:text-lg">
          {t("heroSubtitle")}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/download" variant="primary" size="lg">
            {t("downloadCta")}
          </Button>
          <Button href="/operators" variant="secondary" size="lg">
            {t("guideCta")}
          </Button>
        </div>

        <GlassCard className="mt-10 w-full max-w-2xl">
          <SectionHeader
            title={t("destinationsTitle")}
            subtitle={t("destinationsSubtitle")}
            align="center"
          />
          <ul className="mt-6 grid grid-cols-2 gap-4 text-left font-body text-sm text-warmgray sm:grid-cols-4">
            <li className="rounded-card border border-glass-border bg-glass-bg p-3 text-center">
              <div className="font-display text-2xl font-bold text-amber">6</div>
              <div className="mt-1 text-xs uppercase tracking-widest">
                {t("statsDestinations")}
              </div>
            </li>
            <li className="rounded-card border border-glass-border bg-glass-bg p-3 text-center">
              <div className="font-display text-2xl font-bold text-amber">550+</div>
              <div className="mt-1 text-xs uppercase tracking-widest">
                {t("statsBadges")}
              </div>
            </li>
            <li className="rounded-card border border-glass-border bg-glass-bg p-3 text-center">
              <div className="font-display text-2xl font-bold text-amber">8</div>
              <div className="mt-1 text-xs uppercase tracking-widest">
                {t("statsCategories")}
              </div>
            </li>
            <li className="rounded-card border border-glass-border bg-glass-bg p-3 text-center">
              <div className="font-display text-2xl font-bold text-amber">4</div>
              <div className="mt-1 text-xs uppercase tracking-widest">
                Rarities
              </div>
            </li>
          </ul>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-warmgray">
            <Link href="/destinations" className="text-amber hover:underline">
              {tc("destinations")}
            </Link>
            <span>·</span>
            <Link href="/operators" className="text-amber hover:underline">
              {tc("forGuides")}
            </Link>
            <span>·</span>
            <Link href="/about" className="text-amber hover:underline">
              {tc("about")}
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
