import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { ReviewsList } from "@/components/operators/dashboard/reviews/ReviewsList";
import { createClient } from "@/lib/supabase/server";
import { MOCK_REVIEWS, type DashboardReview } from "@/lib/dashboard-mock";

type PageProps = { params: Promise<{ locale: string }> };

type LoadResult = {
  reviews: DashboardReview[];
  isMock: boolean;
};

export default async function DashboardReviewsPage({ params }: PageProps) {
  await params;
  const locale = "en-US";
  setRequestLocale("en");
  const t = await getTranslations("reviews");
  const { reviews } = await loadReviews();

  const total = reviews.length;
  const avg =
    total === 0
      ? 0
      : reviews.reduce((sum, r) => sum + r.rating, 0) / total;
  const distribution = computeDistribution(reviews);
  const numFmt = new Intl.NumberFormat(locale);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 font-body text-sm text-warmgray">{t("subtitle")}</p>
      </header>

      {total === 0 ? (
        <EmptyState message={t("empty")} />
      ) : (
        <>
          <GlassCard>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:gap-10">
              <div className="flex flex-col items-center gap-3 text-center lg:items-start lg:text-left">
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-6xl font-bold text-amber">
                    {avg.toFixed(1)}
                  </span>
                  <span className="font-body text-sm text-warmgray">/ 5</span>
                </div>
                <RatingStars rating={Math.round(avg)} size={22} />
                <p className="font-body text-sm font-semibold uppercase tracking-[0.16em] text-warmgray">
                  {t("totalReviews", { n: total })}
                </p>
              </div>

              <div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-warmgray">
                  {t("distributionTitle")}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {([5, 4, 3, 2, 1] as const).map((star) => {
                    const count = distribution[star] ?? 0;
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <li
                        key={star}
                        className="flex items-center gap-3"
                      >
                        <span className="flex w-12 shrink-0 items-center gap-1 font-body text-xs font-semibold text-warmgray">
                          {star}
                          <svg
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="var(--color-amber)"
                            aria-hidden
                          >
                            <path d="M12 2.5l2.95 6.59 7.05.77-5.3 4.94 1.5 7.2L12 18.4l-6.2 3.6 1.5-7.2L2 9.86l7.05-.77z" />
                          </svg>
                        </span>
                        <span
                          aria-hidden
                          className="relative h-2 flex-1 overflow-hidden rounded-card bg-glass-bg"
                        >
                          <span
                            className="absolute inset-y-0 left-0 rounded-card bg-amber transition-[width] duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </span>
                        <span className="w-12 shrink-0 text-right font-body text-xs font-semibold text-white">
                          {numFmt.format(count)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </GlassCard>

          <ReviewsList reviews={reviews} />
        </>
      )}
    </div>
  );
}

function computeDistribution(
  reviews: DashboardReview[]
): Record<1 | 2 | 3 | 4 | 5, number> {
  const dist: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
  for (const r of reviews) {
    const k = Math.max(1, Math.min(5, Math.round(r.rating))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    dist[k]++;
  }
  return dist;
}

function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-glass-border bg-glass-bg px-6 py-14 text-center">
      <div className="relative h-28 w-28">
        <Image
          src="/assets/empty-states/empty-no-guides.png"
          alt=""
          fill
          sizes="112px"
          className="object-contain opacity-90"
        />
      </div>
      <p className="max-w-md font-body text-sm text-warmgray">{message}</p>
    </div>
  );
}

async function loadReviews(): Promise<LoadResult> {
  const fallback: LoadResult = {
    reviews: MOCK_REVIEWS,
    isMock: true,
  };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return fallback;

    const { data: guide } = await supabase
      .from("guides")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!guide) return fallback;

    const { data: rows } = await supabase
      .from("reviews")
      .select("id, tourist_name, badge_id, rating, comment, created_at")
      .eq("guide_id", guide.id)
      .order("created_at", { ascending: false });

    const reviews: DashboardReview[] = (rows ?? []).map(
      (r: {
        id: string;
        tourist_name: string;
        badge_id: string;
        rating: number;
        comment: string;
        created_at: string;
      }) => ({
        id: r.id,
        tourist_name: r.tourist_name ?? "—",
        badge_name: r.badge_id,
        rating: Number(r.rating ?? 0),
        comment: r.comment ?? "",
        created_at: r.created_at,
      })
    );

    return { reviews, isMock: false };
  } catch {
    return fallback;
  }
}
