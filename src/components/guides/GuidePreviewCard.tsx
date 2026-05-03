import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { type SampleGuide } from "@/lib/mock-data";

type Props = {
  guide: SampleGuide;
  className?: string;
};

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function GuidePreviewCard({ guide, className }: Props) {
  const t = useTranslations("destinations");
  return (
    <GlassCard
      className={cn(
        "flex h-full flex-col gap-4 transition-colors duration-200 hover:border-amber/40",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber/30 bg-amber-soft font-display text-lg font-bold text-amber"
        >
          {guide.initials}
        </div>
        <div className="flex flex-1 flex-col">
          <h4 className="font-display text-base font-semibold text-white">
            {guide.name}
          </h4>
          <p className="font-body text-sm text-warmgray">
            {guide.businessName}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <RatingStars rating={guide.rating} />
            <span className="font-body text-xs font-semibold text-warmgray">
              {guide.rating.toFixed(1)}
            </span>
            <span className="font-body text-xs text-warmgray">
              ({guide.reviewCount})
            </span>
          </div>
        </div>
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {guide.specialties.map((specialty) => (
          <li
            key={specialty}
            className="inline-flex items-center rounded-card border border-glass-border bg-glass-bg px-2 py-0.5 font-body text-xs text-warmgray"
          >
            {specialty}
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="mt-auto inline-flex items-center justify-between rounded-card border border-amber/40 bg-transparent px-3 py-2 font-body text-sm font-semibold text-amber transition-colors hover:bg-amber-soft"
      >
        <span>{t("viewProfile")}</span>
        <span aria-hidden>→</span>
      </button>
    </GlassCard>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="flex items-center" aria-label={`${rating} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star key={i} filled={filled} half={i === full && half && !filled} />
        );
      })}
    </div>
  );
}

function Star({ filled, half }: { filled: boolean; half: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill={filled ? "var(--color-amber)" : "none"}
      stroke="var(--color-amber)"
      strokeWidth="1.5"
      aria-hidden
    >
      <path
        d="M12 2.5l2.95 6.59 7.05.77-5.3 4.94 1.5 7.2L12 18.4l-6.2 3.6 1.5-7.2L2 9.86l7.05-.77z"
        fill={half ? "url(#half)" : undefined}
      />
      {half ? (
        <defs>
          <linearGradient id="half">
            <stop offset="50%" stopColor="var(--color-amber)" />
            <stop offset="50%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
      ) : null}
    </svg>
  );
}
