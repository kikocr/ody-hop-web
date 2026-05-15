import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { AppStoreBadges } from "@/components/home/AppStoreBadges";

export function Hero() {
  const t = useTranslations("home");

  return (
    <section
      aria-label="Hero"
      className="relative isolate flex min-h-[calc(100vh-5rem)] w-full items-center overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean via-ocean to-ocean-light"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(242,169,0,0.18),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(18,58,111,0.65),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-amber/15 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-24 pt-12 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:pb-0 lg:pt-0 lg:px-8">
        <div className="flex flex-col gap-6 text-center lg:col-span-7 lg:text-left">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.32em] text-amber">
            Ody Hop
          </span>
          <h1 className="font-display text-3xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
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

          <div className="pt-2">
            <AppStoreBadges className="justify-center lg:justify-start" />
          </div>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <div className="relative aspect-square w-[260px] sm:w-[340px] lg:w-[460px]">
            <div
              aria-hidden
              className="absolute inset-x-8 bottom-4 h-6 rounded-[50%] bg-amber/20 blur-2xl"
            />
            <div className="relative h-full w-full animate-float">
              <Image
                src="/assets/branding/ody-explorer.png"
                alt="Ody the otter, ready to go"
                fill
                priority
                sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 460px"
                className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
              />
            </div>
          </div>
        </div>
      </div>

      <a
        href="#how-it-works"
        aria-label="Scroll to how it works"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center justify-center text-warmgray transition-colors hover:text-amber lg:flex"
      >
        <span className="flex h-10 w-10 items-center justify-center animate-bob">
          <ChevronDown />
        </span>
      </a>
    </section>
  );
}

function ChevronDown() {
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
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
