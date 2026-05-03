import Image from "next/image";
import { type ReactNode } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/server";
import {
  MOCK_BOOKINGS,
  MOCK_GUIDE,
  MOCK_REVIEWS,
  MOCK_STATS,
  type DashboardBooking,
  type DashboardGuide,
  type DashboardReview,
  type DashboardStats,
} from "@/lib/dashboard-mock";
import type { BookingStatus } from "@/lib/types";
import type { DestinationSlug } from "@/lib/constants";

type PageProps = { params: Promise<{ locale: string }> };

type DashboardData = {
  guide: DashboardGuide;
  bookings: DashboardBooking[];
  reviews: DashboardReview[];
  stats: DashboardStats;
  isMock: boolean;
};

export default async function DashboardHomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const data = await loadDashboardData();
  const t = await getTranslations("dashboard");

  const today = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const currencyFormatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
  const numberFormatter = new Intl.NumberFormat(locale);
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          {t("welcomeName", { name: data.guide.business_name })}
        </h1>
        <p className="font-body text-sm text-warmgray">{today}</p>
      </header>

      <section aria-label="Dashboard stats">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            icon={<CalendarIcon />}
            label={t("totalBookings")}
            value={numberFormatter.format(data.stats.totalBookings)}
            trendPct={data.stats.totalBookingsTrend}
            caption={t("vsLastMonth")}
          />
          <StatCard
            icon={<MoneyIcon />}
            label={t("revenue")}
            value={currencyFormatter.format(data.stats.revenue)}
            trendPct={data.stats.revenueTrend}
            caption={t("thisMonth")}
          />
          <StatCard
            icon={<StarIcon />}
            label={t("avgRating")}
            value={data.stats.avgRating.toFixed(1)}
            secondary={`${numberFormatter.format(
              data.stats.reviewCount
            )} ${t("reviews").toLowerCase()}`}
          />
          <StatCard
            icon={<EyeIcon />}
            label={t("profileViews")}
            value={numberFormatter.format(data.stats.profileViews)}
            trendPct={data.stats.profileViewsTrend}
            caption={t("vsLastMonth")}
          />
        </ul>
      </section>

      <section aria-label="Recent bookings" className="flex flex-col gap-4">
        <header className="flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
            {t("recentBookings")}
          </h2>
          <Link
            href="/operators/dashboard/bookings"
            className="font-body text-sm font-semibold text-amber hover:underline"
          >
            {t("viewAll")} →
          </Link>
        </header>
        {data.bookings.length === 0 ? (
          <EmptyState
            image="/assets/empty-states/empty-no-badges.png"
            label={t("emptyBookings")}
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {data.bookings.slice(0, 5).map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                statusLabel={t(`bookingStatus.${booking.status}`)}
                dateLabel={dateFormatter.format(new Date(booking.date))}
                amountLabel={currencyFormatter.format(booking.total_price)}
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Recent reviews" className="flex flex-col gap-4">
        <header className="flex items-end justify-between">
          <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
            {t("recentReviews")}
          </h2>
          <Link
            href="/operators/dashboard/reviews"
            className="font-body text-sm font-semibold text-amber hover:underline"
          >
            {t("viewAll")} →
          </Link>
        </header>
        {data.reviews.length === 0 ? (
          <EmptyState
            image="/assets/empty-states/empty-no-guides.png"
            label={t("emptyReviews")}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 lg:grid-cols-3">
            {data.reviews.slice(0, 3).map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                dateLabel={dateFormatter.format(new Date(review.created_at))}
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Quick actions" className="flex flex-col gap-4">
        <h2 className="font-display text-xl font-semibold text-white sm:text-2xl">
          {t("quickActions")}
        </h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <li>
            <QuickAction
              href="/operators/dashboard/listings"
              icon={<ListIcon />}
              title={t("editListings")}
              caption={t("actionEditListings")}
            />
          </li>
          <li>
            <QuickAction
              href="/operators/dashboard/bookings"
              icon={<CalendarIcon />}
              title={t("viewBookings")}
              caption={t("actionViewBookings")}
            />
          </li>
          <li>
            <QuickAction
              href="/operators/dashboard/profile"
              icon={<UserIcon />}
              title={t("updateProfile")}
              caption={t("actionUpdateProfile")}
            />
          </li>
        </ul>
      </section>
    </div>
  );
}

async function loadDashboardData(): Promise<DashboardData> {
  const mock: DashboardData = {
    guide: MOCK_GUIDE,
    bookings: MOCK_BOOKINGS,
    reviews: MOCK_REVIEWS,
    stats: MOCK_STATS,
    isMock: true,
  };

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return mock;

    const { data: guide } = await supabase
      .from("guides")
      .select("id, business_name")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!guide) return mock;

    const [bookingsRes, reviewsRes, statsRes] = await Promise.all([
      supabase
        .from("bookings")
        .select(
          "id, tourist_name, badge_id, destination_id, date, party_size, status, total_price, commission, message, created_at"
        )
        .eq("guide_id", guide.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("reviews")
        .select("id, tourist_name, badge_id, rating, comment, created_at")
        .eq("guide_id", guide.id)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("bookings")
        .select("status, total_price, commission, created_at", {
          count: "exact",
        })
        .eq("guide_id", guide.id),
    ]);

    const bookings: DashboardBooking[] = (bookingsRes.data ?? []).map(
      (b: {
        id: string;
        tourist_name: string;
        badge_id: string;
        destination_id: string;
        date: string;
        party_size: number;
        status: BookingStatus;
        total_price: number;
        commission: number;
        message: string | null;
        created_at: string;
      }) => ({
        id: b.id,
        tourist_name: b.tourist_name ?? "—",
        badge_name: b.badge_id,
        badge_id: b.badge_id,
        destination_id: b.destination_id as DestinationSlug,
        destination_brand: b.destination_id,
        date: b.date,
        party_size: Number(b.party_size ?? 1),
        status: b.status,
        total_price: Number(b.total_price ?? 0),
        commission: Number(b.commission ?? 0),
        currency: "USD",
        message: b.message,
        created_at: b.created_at,
      })
    );

    const reviews: DashboardReview[] = (reviewsRes.data ?? []).map(
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

    const allBookings = (statsRes.data ?? []) as Array<{
      status: BookingStatus;
      total_price: number;
      commission: number;
      created_at: string;
    }>;
    const totalBookings = statsRes.count ?? allBookings.length;

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const revenue = allBookings
      .filter(
        (b) =>
          b.status === "completed" &&
          new Date(b.created_at).getTime() >= monthStart.getTime()
      )
      .reduce(
        (sum, b) => sum + (Number(b.total_price) - Number(b.commission)),
        0
      );

    const ratings = reviews.map((r) => r.rating);
    const avgRating =
      ratings.length > 0
        ? ratings.reduce((s, r) => s + r, 0) / ratings.length
        : 0;

    const stats: DashboardStats = {
      totalBookings,
      totalBookingsTrend: 0,
      revenue,
      revenueTrend: 0,
      avgRating,
      reviewCount: reviews.length,
      profileViews: 0,
      profileViewsTrend: 0,
    };

    return {
      guide: { id: guide.id, business_name: guide.business_name },
      bookings,
      reviews,
      stats,
      isMock: false,
    };
  } catch {
    return mock;
  }
}

/* ---------------- Components ---------------- */

function StatCard({
  icon,
  label,
  value,
  trendPct,
  caption,
  secondary,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  trendPct?: number;
  caption?: string;
  secondary?: string;
}) {
  const trendUp = (trendPct ?? 0) >= 0;
  const trendClass = trendUp ? "text-success" : "text-alert";
  const trendArrow = trendUp ? "↑" : "↓";

  return (
    <li>
      <GlassCard className="flex h-full flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="flex h-10 w-10 items-center justify-center rounded-card bg-amber-soft text-amber">
            {icon}
          </span>
          {trendPct != null ? (
            <span
              className={`inline-flex items-center gap-1 font-body text-xs font-semibold ${trendClass}`}
            >
              <span aria-hidden>{trendArrow}</span>
              {Math.abs(trendPct)}%
            </span>
          ) : null}
        </div>
        <div>
          <p className="font-display text-3xl font-bold text-white">{value}</p>
          <p className="mt-1 font-body text-xs font-semibold uppercase tracking-[0.16em] text-warmgray">
            {label}
          </p>
        </div>
        {caption || secondary ? (
          <p className="font-body text-xs text-warmgray">
            {secondary ?? caption}
          </p>
        ) : null}
      </GlassCard>
    </li>
  );
}

const STATUS_TINT: Record<BookingStatus, string> = {
  pending: "border-amber/40 bg-amber-soft text-amber",
  confirmed: "border-info/50 bg-info/10 text-info",
  completed: "border-success/40 bg-success/10 text-success",
  cancelled: "border-alert/40 bg-alert/10 text-alert",
};

function BookingRow({
  booking,
  statusLabel,
  dateLabel,
  amountLabel,
}: {
  booking: DashboardBooking;
  statusLabel: string;
  dateLabel: string;
  amountLabel: string;
}) {
  return (
    <li className="flex flex-wrap items-center gap-3 rounded-card border border-glass-border bg-glass-bg px-4 py-3 transition-colors hover:border-amber/40">
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-semibold text-white">
          {booking.tourist_name}
        </p>
        <p className="truncate font-body text-xs text-warmgray">
          {booking.badge_name}
          <span aria-hidden className="mx-2 text-amber/60">·</span>
          {dateLabel}
        </p>
      </div>
      <span
        className={`inline-flex shrink-0 items-center rounded-card border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider ${STATUS_TINT[booking.status]}`}
      >
        {statusLabel}
      </span>
      <span className="ml-auto shrink-0 font-display text-sm font-semibold text-amber sm:ml-0">
        {amountLabel}
      </span>
    </li>
  );
}

function ReviewCard({
  review,
  dateLabel,
}: {
  review: DashboardReview;
  dateLabel: string;
}) {
  return (
    <li className="h-full">
      <GlassCard className="flex h-full flex-col gap-3 transition-colors duration-200 hover:border-amber/40">
        <div className="flex items-center justify-between">
          <RatingStars rating={review.rating} />
          <span className="font-body text-xs text-warmgray">{dateLabel}</span>
        </div>
        <p className="line-clamp-2 font-body text-sm text-white">
          {review.comment ? `"${review.comment}"` : "—"}
        </p>
        <div className="mt-auto flex flex-col gap-0.5">
          <span className="font-body text-xs font-semibold text-white">
            {review.tourist_name}
          </span>
          <span className="font-body text-[10px] uppercase tracking-wider text-warmgray">
            {review.badge_name}
          </span>
        </div>
      </GlassCard>
    </li>
  );
}

function RatingStars({ rating }: { rating: number }) {
  const filled = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < filled ? "var(--color-amber)" : "none"}
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

function QuickAction({
  href,
  icon,
  title,
  caption,
}: {
  href: string;
  icon: ReactNode;
  title: string;
  caption: string;
}) {
  return (
    <Link
      href={href as "/operators/dashboard/listings"}
      className="group flex h-full flex-col gap-3 rounded-card border border-glass-border bg-glass-bg p-5 transition-colors hover:border-amber/50 hover:bg-amber-soft"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-card bg-amber-soft text-amber transition-transform group-hover:scale-105">
        {icon}
      </span>
      <p className="font-display text-base font-semibold text-white">
        {title}
      </p>
      <p className="font-body text-xs text-warmgray">{caption}</p>
      <span className="mt-auto pt-1 font-body text-xs font-semibold text-amber">
        →
      </span>
    </Link>
  );
}

function EmptyState({ image, label }: { image: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-glass-border bg-glass-bg px-6 py-10 text-center">
      <div className="relative h-28 w-28 sm:h-32 sm:w-32">
        <Image
          src={image}
          alt=""
          fill
          sizes="128px"
          className="object-contain opacity-90"
        />
      </div>
      <p className="max-w-md font-body text-sm text-warmgray">{label}</p>
    </div>
  );
}

/* ---------------- Icons ---------------- */

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="1" />
      <path d="M3 10h18" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
    </svg>
  );
}

function MoneyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
      <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l2.95 6.59 7.05.77-5.3 4.94 1.5 7.2L12 18.4l-6.2 3.6 1.5-7.2L2 9.36l7.05-.77z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M8 6h13" />
      <path d="M8 12h13" />
      <path d="M8 18h13" />
      <circle cx="4" cy="6" r="1.4" />
      <circle cx="4" cy="12" r="1.4" />
      <circle cx="4" cy="18" r="1.4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1-4 5-6 8-6s7 2 8 6" />
    </svg>
  );
}
