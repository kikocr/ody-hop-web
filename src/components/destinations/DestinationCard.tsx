import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { CATEGORIES, type Destination } from "@/lib/constants";

type Variant = "compact" | "full";

type Props = {
  destination: Destination;
  variant?: Variant;
  className?: string;
};

const SAMPLE_CATEGORY_IDS = ["nature", "wildlife", "adventure", "culture"] as const;

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function DestinationCard({
  destination,
  variant = "compact",
  className,
}: Props) {
  return variant === "full" ? (
    <FullCard destination={destination} className={className} />
  ) : (
    <CompactCard destination={destination} className={className} />
  );
}

function CompactCard({
  destination,
  className,
}: {
  destination: Destination;
  className?: string;
}) {
  const t = useTranslations("destinations");
  const tc = useTranslations("common");

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-card border border-glass-border bg-glass-bg backdrop-blur-glass transition-transform duration-200 hover:-translate-y-1 hover:border-amber/40",
        className
      )}
      aria-label={`${destination.brandName} — ${destination.country}`}
    >
      <div className="relative h-[220px] w-full overflow-hidden">
        <Image
          src={destination.heroImage}
          alt=""
          fill
          sizes="(max-width: 640px) 280px, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ocean-dark via-ocean/40 to-transparent transition-opacity duration-300 group-hover:opacity-80"
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-card bg-amber px-2.5 py-1 font-body text-xs font-bold text-ocean">
          {destination.badgeCount} {tc("badges")}
        </span>
      </div>
      <div className="flex flex-col gap-1 p-5">
        <span className="font-body text-xs uppercase tracking-widest text-warmgray">
          <span aria-hidden className="mr-1">{destination.flag}</span>
          {destination.country}
        </span>
        <h3 className="font-display text-xl font-bold text-white">
          {destination.brandName}
        </h3>
        <p className="font-body text-sm text-warmgray">{destination.tagline}</p>
        <span className="mt-3 inline-flex items-center gap-1 font-body text-sm font-semibold text-amber transition-transform duration-150 group-hover:translate-x-0.5">
          {t("exploreCta")}
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}

function FullCard({
  destination,
  className,
}: {
  destination: Destination;
  className?: string;
}) {
  const t = useTranslations("destinations");
  const tc = useTranslations("common");

  const sampleCategories = CATEGORIES.filter((c) =>
    (SAMPLE_CATEGORY_IDS as readonly string[]).includes(c.id)
  );

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={cn(
        "group relative block h-[420px] overflow-hidden rounded-card border border-glass-border bg-ocean-dark transition-transform duration-200 hover:-translate-y-1 hover:border-amber/40 hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]",
        className
      )}
      aria-label={`${destination.brandName} — ${destination.country}`}
    >
      <Image
        src={destination.heroImage}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ocean-dark via-ocean-dark/60 to-ocean/10 transition-opacity duration-300 group-hover:opacity-85"
      />
      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-card bg-amber px-3 py-1.5 font-body text-xs font-bold text-ocean shadow-[0_8px_20px_-10px_rgba(0,0,0,0.6)]">
        {destination.badgeCount} {tc("badges")}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-7">
        <span className="font-body text-xs uppercase tracking-[0.18em] text-warmgray">
          <span aria-hidden className="mr-1">{destination.flag}</span>
          {destination.country}
        </span>
        <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {destination.brandName}
        </h3>
        <p className="font-body text-sm text-warmgray sm:text-base">
          {destination.tagline}
        </p>

        <ul
          aria-label="Sample badge categories"
          className="flex items-center gap-2 pt-1"
        >
          {sampleCategories.map((cat) => (
            <li
              key={cat.id}
              className="relative h-9 w-9 rounded-card border border-glass-border bg-glass-bg p-1 backdrop-blur-glass"
              title={cat.name}
            >
              <Image
                src={cat.icon}
                alt=""
                fill
                sizes="36px"
                className="object-contain p-1"
              />
            </li>
          ))}
        </ul>

        <span className="pt-1 inline-flex items-center gap-1 font-body text-sm font-semibold text-amber transition-transform duration-150 group-hover:translate-x-0.5">
          {t("exploreCta")}
          <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
