import { setRequestLocale, getTranslations } from "next-intl/server";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/server";
import {
  MOCK_BOOKINGS,
  MOCK_PAYOUTS,
  MOCK_PROFILE,
  type DashboardBooking,
  type FullProfile,
  type Payout,
} from "@/lib/dashboard-mock";
import { DESTINATIONS, type DestinationSlug } from "@/lib/constants";
import type { BookingStatus } from "@/lib/types";

type PageProps = { params: Promise<{ locale: string }> };

type LoadResult = {
  profile: FullProfile;
  bookings: DashboardBooking[];
  payouts: Payout[];
  isMock: boolean;
};

export default async function DashboardBillingPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("billing");
  const td = await getTranslations("dashboard");
  const { profile, bookings, payouts } = await loadBilling();

  const currency = "USD";
  const currencyFmt = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });
  const currencyFmtCents = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  });
  const dateFmt = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const completed = bookings.filter((b) => b.status === "completed");
  const totalEarnings = completed.reduce(
    (sum, b) => sum + (b.total_price - b.commission),
    0
  );

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  const thisMonthEarnings = completed
    .filter((b) => new Date(b.created_at).getTime() >= monthStart.getTime())
    .reduce((sum, b) => sum + (b.total_price - b.commission), 0);

  const pendingPayout = payouts
    .filter((p) => p.status !== "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const recentCompleted = [...completed]
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 8);

  const commissionTotals = recentCompleted.reduce(
    (acc, b) => {
      acc.amount += b.total_price;
      acc.commission += b.commission;
      acc.payout += b.total_price - b.commission;
      return acc;
    },
    { amount: 0, commission: 0, payout: 0 }
  );

  const payoutStatusLabel: Record<Payout["status"], string> = {
    paid: t("payoutPaid"),
    pending: t("payoutPending"),
    scheduled: t("payoutScheduled"),
  };
  const payoutStatusTint: Record<Payout["status"], string> = {
    paid: "border-success/40 bg-success/10 text-success",
    pending: "border-amber/40 bg-amber-soft text-amber",
    scheduled: "border-info/50 bg-info/10 text-info",
  };

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 font-body text-sm text-warmgray">{t("subtitle")}</p>
      </header>

      <GlassCard className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-warmgray">
              {t("currentPlan")}
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-white">
              {profile.is_featured ? t("planFeatured") : t("planFree")}
            </h2>
            <p className="mt-1 font-body text-sm text-warmgray">
              {profile.is_featured
                ? t("planFeaturedDesc")
                : t("planFreeDesc")}
            </p>
          </div>
          {profile.is_featured ? (
            <span className="inline-flex items-center gap-1 rounded-card border border-amber/40 bg-amber-soft px-3 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-amber">
              ★ {td("welcomeName", { name: profile.business_name })}
            </span>
          ) : (
            <UpgradeButton
              label={t("upgrade")}
              hint={t("upgradeComingSoon")}
            />
          )}
        </div>
      </GlassCard>

      <section aria-label="Earnings" className="flex flex-col gap-4">
        <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em] text-amber">
          {t("earningsTitle")}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <EarningTile
            label={t("totalEarnings")}
            value={currencyFmt.format(totalEarnings)}
          />
          <EarningTile
            label={t("thisMonth")}
            value={currencyFmt.format(thisMonthEarnings)}
          />
          <EarningTile
            label={t("pendingPayouts")}
            value={currencyFmt.format(pendingPayout)}
          />
        </ul>

        <GlassCard noPadding className="overflow-hidden">
          <div className="border-b border-glass-border bg-ocean-dark/60 px-5 py-3">
            <h3 className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-warmgray">
              {t("recentPayouts")}
            </h3>
          </div>
          {payouts.length === 0 ? (
            <p className="px-5 py-6 font-body text-sm italic text-warmgray">
              {t("noEarnings")}
            </p>
          ) : (
            <ul className="divide-y divide-glass-border">
              {payouts.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-body text-sm font-semibold text-white">
                      {currencyFmtCents.format(p.amount)}
                    </p>
                    <p className="font-body text-xs text-warmgray">
                      {dateFmt.format(new Date(p.date))} · {p.method}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-card border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider ${payoutStatusTint[p.status]}`}
                  >
                    {payoutStatusLabel[p.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </GlassCard>
      </section>

      <section
        aria-label="Commission breakdown"
        className="flex flex-col gap-3"
      >
        <header>
          <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em] text-amber">
            {t("commissionTitle")}
          </h2>
          <p className="mt-1 font-body text-xs text-warmgray">
            {t("commissionDesc")}
          </p>
        </header>

        {recentCompleted.length === 0 ? (
          <p className="rounded-card border border-glass-border bg-glass-bg px-4 py-6 text-center font-body text-sm italic text-warmgray">
            {t("noEarnings")}
          </p>
        ) : (
          <div className="overflow-hidden rounded-card border border-glass-border bg-glass-bg">
            <div className="hidden lg:block">
              <table className="w-full text-left">
                <thead className="bg-ocean-dark/60">
                  <tr>
                    <Th>{t("tableDate")}</Th>
                    <Th>{t("tableExperience")}</Th>
                    <Th className="text-right">{t("tableAmount")}</Th>
                    <Th className="text-right">{t("tableCommission")}</Th>
                    <Th className="text-right">{t("tablePayout")}</Th>
                  </tr>
                </thead>
                <tbody>
                  {recentCompleted.map((b, i) => (
                    <tr
                      key={b.id}
                      className={
                        i % 2 === 1 ? "bg-ocean-dark/30" : undefined
                      }
                    >
                      <td className="px-5 py-3 font-body text-sm text-warmgray">
                        {dateFmt.format(new Date(b.date))}
                      </td>
                      <td className="px-5 py-3">
                        <p className="font-body text-sm font-semibold text-white">
                          {b.badge_name}
                        </p>
                        <p className="font-body text-xs text-warmgray">
                          {b.tourist_name}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-right font-body text-sm text-white">
                        {currencyFmtCents.format(b.total_price)}
                      </td>
                      <td className="px-5 py-3 text-right font-body text-sm text-alert">
                        −{currencyFmtCents.format(b.commission)}
                      </td>
                      <td className="px-5 py-3 text-right font-display text-sm font-semibold text-amber">
                        {currencyFmtCents.format(
                          b.total_price - b.commission
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-glass-border bg-ocean-dark/40">
                    <td
                      colSpan={2}
                      className="px-5 py-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-warmgray"
                    >
                      {t("tableTotals")}
                    </td>
                    <td className="px-5 py-3 text-right font-body text-sm font-semibold text-white">
                      {currencyFmtCents.format(commissionTotals.amount)}
                    </td>
                    <td className="px-5 py-3 text-right font-body text-sm font-semibold text-alert">
                      −{currencyFmtCents.format(commissionTotals.commission)}
                    </td>
                    <td className="px-5 py-3 text-right font-display text-sm font-bold text-amber">
                      {currencyFmtCents.format(commissionTotals.payout)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <ul className="divide-y divide-glass-border lg:hidden">
              {recentCompleted.map((b) => (
                <li key={b.id} className="flex flex-col gap-1 px-4 py-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-body text-sm font-semibold text-white">
                      {b.badge_name}
                    </p>
                    <p className="font-display text-sm font-semibold text-amber">
                      {currencyFmtCents.format(b.total_price - b.commission)}
                    </p>
                  </div>
                  <p className="font-body text-xs text-warmgray">
                    {dateFmt.format(new Date(b.date))} · {b.tourist_name}
                  </p>
                  <p className="font-body text-xs text-warmgray">
                    {currencyFmtCents.format(b.total_price)}{" "}
                    <span className="text-alert">
                      − {currencyFmtCents.format(b.commission)}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <GlassCard className="flex flex-col gap-3">
        <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em] text-amber">
          {t("payoutMethodTitle")}
        </h2>
        <p className="font-body text-sm text-white">
          {t("payoutMethodPlaceholder")}
        </p>
        <p className="font-body text-xs text-warmgray">
          {t("payoutContact")}
        </p>
      </GlassCard>
    </div>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`px-5 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-warmgray ${
        className ?? ""
      }`}
    >
      {children}
    </th>
  );
}

function EarningTile({ label, value }: { label: string; value: string }) {
  return (
    <li>
      <GlassCard className="flex h-full flex-col gap-1.5">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-warmgray">
          {label}
        </p>
        <p className="font-display text-3xl font-bold text-amber">{value}</p>
      </GlassCard>
    </li>
  );
}

function UpgradeButton({ label, hint }: { label: string; hint: string }) {
  // V1 Featured tier isn't built yet — link to apply form (operators are
  // vetted there before any tier upgrade) and surface the "coming soon"
  // micro-copy underneath so we don't promise a flow we can't deliver.
  return (
    <div className="flex flex-col items-end gap-1">
      <Button href="/operators/apply" variant="primary">
        {label}
      </Button>
      <span className="font-body text-[10px] uppercase tracking-wider text-warmgray">
        {hint}
      </span>
    </div>
  );
}

async function loadBilling(): Promise<LoadResult> {
  const fallback: LoadResult = {
    profile: MOCK_PROFILE,
    bookings: MOCK_BOOKINGS,
    payouts: MOCK_PAYOUTS,
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
      .select(
        "id, business_name, is_featured, rating, review_count, photo_url, bio, contact_email, phone, destinations, regions, languages, specialties, certifications, website, social_links"
      )
      .eq("user_id", user.id)
      .maybeSingle();
    if (!guide) return fallback;

    const { data: bookingRows } = await supabase
      .from("bookings")
      .select(
        "id, tourist_name, badge_id, destination_id, date, party_size, status, total_price, commission, message, created_at"
      )
      .eq("guide_id", guide.id)
      .order("created_at", { ascending: false });

    const bookings: DashboardBooking[] = (bookingRows ?? []).map(
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
      }) => {
        const dest = DESTINATIONS.find((d) => d.slug === b.destination_id);
        return {
          id: b.id,
          tourist_name: b.tourist_name ?? "—",
          badge_name: b.badge_id,
          badge_id: b.badge_id,
          destination_id: (dest?.slug ?? b.destination_id) as DestinationSlug,
          destination_brand: dest?.brandName ?? b.destination_id,
          date: b.date,
          party_size: Number(b.party_size ?? 1),
          status: b.status,
          total_price: Number(b.total_price ?? 0),
          commission: Number(b.commission ?? 0),
          currency: "USD",
          message: b.message,
          created_at: b.created_at,
        };
      }
    );

    const social = (guide.social_links ?? {}) as Record<string, string>;
    const profile: FullProfile = {
      id: guide.id,
      business_name: guide.business_name ?? "",
      bio: guide.bio ?? "",
      photo_url: guide.photo_url ?? null,
      contact_email: guide.contact_email ?? "",
      phone: guide.phone ?? "",
      destinations: Array.isArray(guide.destinations)
        ? (guide.destinations as DestinationSlug[])
        : [],
      regions: (guide.regions ??
        {}) as Partial<Record<DestinationSlug, string>>,
      languages: Array.isArray(guide.languages)
        ? (guide.languages as string[])
        : [],
      specialties: Array.isArray(guide.specialties)
        ? (guide.specialties as string[])
        : [],
      certifications: guide.certifications ?? "",
      website: guide.website ?? "",
      social_instagram: social.instagram ?? "",
      social_facebook: social.facebook ?? "",
      social_tripadvisor: social.tripadvisor ?? "",
      rating: Number(guide.rating ?? 0),
      review_count: Number(guide.review_count ?? 0),
      is_featured: !!guide.is_featured,
    };

    return {
      profile,
      bookings,
      payouts: MOCK_PAYOUTS,
      isMock: false,
    };
  } catch {
    return fallback;
  }
}
