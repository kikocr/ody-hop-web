import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/Button";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <section
      aria-label="Page not found"
      className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean-light/30 via-ocean to-ocean"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(242,169,0,0.16),transparent_55%)]"
      />

      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-4 text-center sm:px-6 lg:px-8">
        <div className="relative h-[200px] w-[200px] sm:h-[260px] sm:w-[260px]">
          <Image
            src="/assets/empty-states/empty-error.png"
            alt=""
            fill
            sizes="(max-width: 640px) 200px, 260px"
            priority
            className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
          />
        </div>
        <p className="font-body text-xs font-semibold uppercase tracking-[0.32em] text-amber">
          404
        </p>
        <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
          {t("title")}
        </h1>
        <p className="max-w-md font-body text-base text-warmgray sm:text-lg">
          {t("subtitle")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="primary" size="lg">
            {t("backHome")}
          </Button>
          <Link
            href="/destinations"
            className="font-body text-sm font-semibold text-amber hover:underline"
          >
            {t("exploreDestinations")} →
          </Link>
        </div>
      </div>
    </section>
  );
}
