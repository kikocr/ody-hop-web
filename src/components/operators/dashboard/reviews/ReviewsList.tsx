"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import type { DashboardReview } from "@/lib/dashboard-mock";

type Sort = "recent" | "highest" | "lowest";

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function ReviewsList({ reviews }: { reviews: DashboardReview[] }) {
  const t = useTranslations("reviews");
  const locale = useLocale();
  const [sort, setSort] = useState<Sort>("recent");

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (sort === "highest") {
      copy.sort(
        (a, b) =>
          b.rating - a.rating ||
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sort === "lowest") {
      copy.sort(
        (a, b) =>
          a.rating - b.rating ||
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else {
      copy.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return copy;
  }, [reviews, sort]);

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-3">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-warmgray">
          {t("sortLabel")}
        </span>
        <div role="group" aria-label={t("sortLabel")} className="flex gap-1">
          <SortPill
            active={sort === "recent"}
            onClick={() => setSort("recent")}
          >
            {t("sortRecent")}
          </SortPill>
          <SortPill
            active={sort === "highest"}
            onClick={() => setSort("highest")}
          >
            {t("sortHighest")}
          </SortPill>
          <SortPill
            active={sort === "lowest"}
            onClick={() => setSort("lowest")}
          >
            {t("sortLowest")}
          </SortPill>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {sorted.map((review) => (
          <li key={review.id}>
            <GlassCard className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <RatingStars rating={review.rating} />
                <span className="font-body text-xs text-warmgray">
                  {dateFormatter.format(new Date(review.created_at))}
                </span>
              </div>
              <p className="font-body text-sm text-white sm:text-base">
                &ldquo;{review.comment}&rdquo;
              </p>
              <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-glass-border pt-3">
                <span className="font-display text-sm font-semibold text-white">
                  {review.tourist_name}
                </span>
                <span className="font-body text-[10px] uppercase tracking-wider text-warmgray">
                  {review.badge_name}
                </span>
              </footer>
            </GlassCard>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SortPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center rounded-card border px-3 py-1.5 font-body text-xs font-semibold transition-colors",
        active
          ? "border-amber bg-amber text-ocean"
          : "border-glass-border bg-glass-bg text-warmgray hover:border-amber/40 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function RatingStars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? "var(--color-amber)" : "none"}
          stroke="var(--color-amber)"
          strokeWidth="1.6"
          aria-hidden
        >
          <path d="M12 2.5l2.95 6.59 7.05.77-5.3 4.94 1.5 7.2L12 18.4l-6.2 3.6 1.5-7.2L2 9.86l7.05-.77z" />
        </svg>
      ))}
    </div>
  );
}
