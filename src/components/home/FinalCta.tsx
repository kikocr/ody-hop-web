import Image from "next/image";
import { useTranslations } from "next-intl";
import { AppStoreBadges } from "@/components/home/AppStoreBadges";
import { Button } from "@/components/ui/Button";

export function FinalCta() {
  const t = useTranslations("home");

  return (
    <section
      aria-label="Final call to action"
      className="relative overflow-hidden bg-ocean py-24 sm:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_50%,rgba(242,169,0,0.18),transparent_55%),radial-gradient(circle_at_85%_30%,rgba(242,169,0,0.08),transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber/40 to-transparent"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="flex flex-col gap-6 text-center lg:col-span-7 lg:text-left">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.32em] text-amber">
            Ody Hop
          </span>
          <h2 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {t("finalCta")}
          </h2>
          <p className="mx-auto max-w-xl font-body text-base text-warmgray sm:text-lg lg:mx-0">
            {t("heroSubtitle")}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button href="/download" variant="primary" size="lg">
              {t("downloadCta")}
            </Button>
            <Button href="/operators" variant="secondary" size="lg">
              {t("guideCta")}
            </Button>
          </div>

          <div>
            <AppStoreBadges className="justify-center lg:justify-start" />
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="relative aspect-square w-[240px] sm:w-[300px] lg:w-[400px]">
            <div
              aria-hidden
              className="absolute inset-x-8 bottom-3 h-5 rounded-[50%] bg-amber/25 blur-2xl"
            />
            <div className="relative h-full w-full animate-float-slow">
              <Image
                src="/assets/branding/ody-legendary.png"
                alt="Ody, Legendary Explorer"
                fill
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 400px"
                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
