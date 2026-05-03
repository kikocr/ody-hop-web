"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/client";
import { DESTINATIONS, type DestinationSlug } from "@/lib/constants";
import type { DashboardBooking } from "@/lib/dashboard-mock";
import type { BookingStatus } from "@/lib/types";

const TABS: ReadonlyArray<BookingStatus> = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

const STATUS_TINT: Record<BookingStatus, string> = {
  pending: "border-amber/40 bg-amber-soft text-amber",
  confirmed: "border-info/50 bg-info/10 text-info",
  completed: "border-success/40 bg-success/10 text-success",
  cancelled: "border-alert/40 bg-alert/10 text-alert",
};

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

type Filters = {
  dateFrom: string;
  dateTo: string;
  destination: "" | DestinationSlug;
};

type Props = {
  initial: DashboardBooking[];
  isMock: boolean;
};

export function BookingsManager({ initial, isMock }: Props) {
  const t = useTranslations("bookings");
  const td = useTranslations("dashboard");
  const locale = useLocale();

  const [supabase] = useState(() => createClient());
  const [bookings, setBookings] = useState<DashboardBooking[]>(initial);
  const [tab, setTab] = useState<BookingStatus>("pending");
  const [filters, setFilters] = useState<Filters>({
    dateFrom: "",
    dateTo: "",
    destination: "",
  });
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineMessage, setDeclineMessage] = useState("");
  const [bannerError, setBannerError] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map: Record<BookingStatus, number> = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const b of bookings) map[b.status]++;
    return map;
  }, [bookings]);

  const visibleDestinations = useMemo(() => {
    const present = new Set(bookings.map((b) => b.destination_id));
    return DESTINATIONS.filter((d) =>
      present.has(d.slug as DestinationSlug)
    );
  }, [bookings]);

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (b.status !== tab) return false;
      if (filters.destination && b.destination_id !== filters.destination)
        return false;
      if (filters.dateFrom && b.date < filters.dateFrom) return false;
      if (filters.dateTo && b.date > filters.dateTo) return false;
      return true;
    });
  }, [bookings, tab, filters]);

  const currencyFormat = (value: number, currency: string) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);

  const dateFormat = (iso: string) =>
    new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));

  const shortDate = (iso: string) =>
    new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
    }).format(new Date(iso));

  async function changeStatus(
    booking: DashboardBooking,
    nextStatus: BookingStatus,
    message?: string
  ) {
    const previous = booking;
    setPendingIds((s) => new Set(s).add(booking.id));
    setBookings((prev) =>
      prev.map((b) =>
        b.id === booking.id
          ? { ...b, status: nextStatus, message: message ?? b.message }
          : b
      )
    );
    setBannerError(null);

    if (isMock) {
      setPendingIds((s) => {
        const n = new Set(s);
        n.delete(booking.id);
        return n;
      });
      setDecliningId(null);
      setDeclineMessage("");
      return;
    }

    try {
      const updates: Record<string, unknown> = { status: nextStatus };
      if (message !== undefined) updates.message = message || null;
      const { error } = await supabase
        .from("bookings")
        .update(updates)
        .eq("id", booking.id);
      if (error) throw error;
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? previous : b))
      );
      setBannerError(t("actionFailed"));
    } finally {
      setPendingIds((s) => {
        const n = new Set(s);
        n.delete(booking.id);
        return n;
      });
      setDecliningId(null);
      setDeclineMessage("");
    }
  }

  function handleDeclineRequest(id: string) {
    setDecliningId(id);
    setDeclineMessage("");
  }
  function handleDeclineCancel() {
    setDecliningId(null);
    setDeclineMessage("");
  }
  async function handleDeclineConfirm(booking: DashboardBooking) {
    await changeStatus(booking, "cancelled", declineMessage.trim());
  }

  function handleExport() {
    const csv = toCsv(filtered);
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`${t("csvFilename")}-${today}.csv`, csv);
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 font-body text-sm text-warmgray">{t("subtitle")}</p>
      </header>

      {bannerError ? (
        <div
          role="alert"
          className="rounded-card border border-alert/50 bg-alert/10 px-4 py-2.5 font-body text-sm text-alert"
        >
          {bannerError}
        </div>
      ) : null}

      <Tabs
        active={tab}
        onChange={setTab}
        counts={counts}
        labels={{
          pending: t("tabPending"),
          confirmed: t("tabConfirmed"),
          completed: t("tabCompleted"),
          cancelled: t("tabCancelled"),
        }}
      />

      <FiltersBar
        filters={filters}
        onChange={setFilters}
        destinations={visibleDestinations}
        onExport={handleExport}
        labels={{
          dateFrom: t("filterDateFrom"),
          dateTo: t("filterDateTo"),
          destination: t("filterDestination"),
          allDestinations: t("filterAllDestinations"),
          exportCsv: t("exportCsv"),
        }}
        canExport={filtered.length > 0}
      />

      {filtered.length === 0 ? (
        <EmptyState message={emptyMessageFor(t, tab)} />
      ) : (
        <ul className="flex flex-col gap-3">
          {filtered.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              statusLabel={td(`bookingStatus.${booking.status}`)}
              dateLabel={dateFormat(booking.date)}
              shortDateLabel={shortDate(booking.created_at)}
              currencyFormat={currencyFormat}
              guestsLabel={t("guests", { n: booking.party_size })}
              totalLine={t("totalLine", {
                total: currencyFormat(booking.total_price, booking.currency),
                commission: currencyFormat(booking.commission, booking.currency),
                payout: currencyFormat(
                  booking.total_price - booking.commission,
                  booking.currency
                ),
              })}
              messageLabel={t("messageLabel")}
              bookedOnLabel={t("bookedOn", {
                date: shortDate(booking.created_at),
              })}
              isPending={pendingIds.has(booking.id)}
              isDeclining={decliningId === booking.id}
              declineMessage={declineMessage}
              setDeclineMessage={setDeclineMessage}
              onConfirm={() => changeStatus(booking, "confirmed")}
              onDeclineRequest={() => handleDeclineRequest(booking.id)}
              onDeclineCancel={handleDeclineCancel}
              onDeclineConfirm={() => handleDeclineConfirm(booking)}
              onComplete={() => changeStatus(booking, "completed")}
              actionLabels={{
                confirm: t("actionConfirm"),
                decline: t("actionDecline"),
                complete: t("actionMarkComplete"),
                confirmDecline: t("actionConfirmDecline"),
                cancel: t("actionCancel"),
                declinePlaceholder: t("declineReasonPlaceholder"),
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function emptyMessageFor(
  t: ReturnType<typeof useTranslations>,
  status: BookingStatus
): string {
  switch (status) {
    case "pending":
      return t("emptyPending");
    case "confirmed":
      return t("emptyConfirmed");
    case "completed":
      return t("emptyCompleted");
    case "cancelled":
      return t("emptyCancelled");
  }
}

/* ---------------- Tabs ---------------- */

function Tabs({
  active,
  onChange,
  counts,
  labels,
}: {
  active: BookingStatus;
  onChange: (s: BookingStatus) => void;
  counts: Record<BookingStatus, number>;
  labels: Record<BookingStatus, string>;
}) {
  return (
    <div
      role="tablist"
      aria-label="Booking status"
      className="flex flex-wrap gap-2"
    >
      {TABS.map((status) => {
        const isActive = status === active;
        return (
          <button
            key={status}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(status)}
            className={cn(
              "inline-flex items-center gap-2 rounded-card border px-4 py-2 font-body text-sm font-semibold transition-colors",
              isActive
                ? "border-amber bg-amber text-ocean"
                : "border-glass-border bg-glass-bg text-warmgray hover:border-amber/40 hover:text-white"
            )}
          >
            <span>{labels[status]}</span>
            <span
              className={cn(
                "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-card px-1 font-body text-[11px] font-bold",
                isActive
                  ? "bg-ocean text-amber"
                  : "bg-ocean-dark/50 text-warmgray"
              )}
            >
              {counts[status]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Filters ---------------- */

function FiltersBar({
  filters,
  onChange,
  destinations,
  onExport,
  canExport,
  labels,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  destinations: typeof DESTINATIONS[number][];
  onExport: () => void;
  canExport: boolean;
  labels: {
    dateFrom: string;
    dateTo: string;
    destination: string;
    allDestinations: string;
    exportCsv: string;
  };
}) {
  const inputBase =
    "rounded-card border border-glass-border bg-ocean-light/60 px-3 py-2 font-body text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber [color-scheme:dark]";

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="flex flex-col gap-1">
        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-warmgray">
          {labels.dateFrom}
        </span>
        <input
          type="date"
          value={filters.dateFrom}
          onChange={(e) =>
            onChange({ ...filters, dateFrom: e.target.value })
          }
          className={inputBase}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-warmgray">
          {labels.dateTo}
        </span>
        <input
          type="date"
          value={filters.dateTo}
          onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
          className={inputBase}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-warmgray">
          {labels.destination}
        </span>
        <select
          value={filters.destination}
          onChange={(e) =>
            onChange({
              ...filters,
              destination: e.target.value as Filters["destination"],
            })
          }
          className={cn(inputBase, "min-w-[180px]")}
        >
          <option value="" className="bg-ocean text-white">
            {labels.allDestinations}
          </option>
          {destinations.map((d) => (
            <option
              key={d.slug}
              value={d.slug}
              className="bg-ocean text-white"
            >
              {d.flag} {d.brandName}
            </option>
          ))}
        </select>
      </label>
      <div className="ml-auto self-end">
        <Button
          variant="secondary"
          onClick={onExport}
          disabled={!canExport}
        >
          ↓ {labels.exportCsv}
        </Button>
      </div>
    </div>
  );
}

/* ---------------- Booking card ---------------- */

type BookingCardProps = {
  booking: DashboardBooking;
  statusLabel: string;
  dateLabel: string;
  shortDateLabel: string;
  currencyFormat: (value: number, currency: string) => string;
  guestsLabel: string;
  totalLine: string;
  messageLabel: string;
  bookedOnLabel: string;
  isPending: boolean;
  isDeclining: boolean;
  declineMessage: string;
  setDeclineMessage: (v: string) => void;
  onConfirm: () => void;
  onDeclineRequest: () => void;
  onDeclineCancel: () => void;
  onDeclineConfirm: () => void;
  onComplete: () => void;
  actionLabels: {
    confirm: string;
    decline: string;
    complete: string;
    confirmDecline: string;
    cancel: string;
    declinePlaceholder: string;
  };
};

function BookingCard({
  booking,
  statusLabel,
  dateLabel,
  guestsLabel,
  totalLine,
  messageLabel,
  bookedOnLabel,
  isPending,
  isDeclining,
  declineMessage,
  setDeclineMessage,
  onConfirm,
  onDeclineRequest,
  onDeclineCancel,
  onDeclineConfirm,
  onComplete,
  actionLabels,
}: BookingCardProps) {
  return (
    <li>
      <GlassCard className="flex flex-col gap-4">
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-base font-semibold text-white sm:text-lg">
              {booking.tourist_name}
            </p>
            <p className="mt-0.5 font-body text-xs text-warmgray">
              {bookedOnLabel}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span
              className={cn(
                "inline-flex items-center rounded-card border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider",
                STATUS_TINT[booking.status]
              )}
            >
              {statusLabel}
            </span>
            <span className="font-body text-xs text-warmgray">
              {dateLabel}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-2 border-y border-glass-border py-3 sm:grid-cols-2">
          <div>
            <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-warmgray">
              {booking.destination_brand}
            </p>
            <p className="font-display text-base font-semibold text-white">
              {booking.badge_name}
            </p>
            <p className="mt-1 font-body text-xs text-warmgray">
              {guestsLabel}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="font-display text-lg font-bold text-amber">
              {totalLine.split("·")[0]?.trim()}
            </p>
            <p className="mt-1 font-body text-xs text-warmgray">
              {totalLine}
            </p>
          </div>
        </div>

        {booking.message ? (
          <div className="rounded-card border border-glass-border bg-ocean-dark/40 px-3 py-2.5">
            <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-warmgray">
              {messageLabel}
            </p>
            <p className="mt-1 font-body text-sm text-white">
              &ldquo;{booking.message}&rdquo;
            </p>
          </div>
        ) : null}

        {(booking.status === "pending" || booking.status === "confirmed") &&
        !isDeclining ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {booking.status === "pending" ? (
              <>
                <button
                  type="button"
                  onClick={onDeclineRequest}
                  disabled={isPending}
                  className="rounded-card border border-alert/40 px-4 py-2 font-body text-sm font-semibold text-alert transition-colors hover:bg-alert/10 disabled:opacity-50"
                >
                  {actionLabels.decline}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isPending}
                  className="rounded-card bg-success px-4 py-2 font-body text-sm font-semibold text-ocean-dark transition-colors hover:bg-success/90 disabled:opacity-50"
                >
                  {actionLabels.confirm}
                </button>
              </>
            ) : null}
            {booking.status === "confirmed" ? (
              <Button
                variant="primary"
                onClick={onComplete}
                disabled={isPending}
              >
                {actionLabels.complete}
              </Button>
            ) : null}
          </div>
        ) : null}

        {isDeclining ? (
          <div className="flex flex-col gap-3 rounded-card border border-alert/40 bg-alert/10 p-3">
            <textarea
              value={declineMessage}
              onChange={(e) => setDeclineMessage(e.target.value)}
              placeholder={actionLabels.declinePlaceholder}
              rows={2}
              className="w-full resize-y rounded-card border border-glass-border bg-ocean-dark/60 px-3 py-2 font-body text-sm text-white placeholder:text-warmgray/60 focus:outline-none focus:ring-2 focus:ring-alert/60 focus:border-alert"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={onDeclineCancel}
                disabled={isPending}
              >
                {actionLabels.cancel}
              </Button>
              <button
                type="button"
                onClick={onDeclineConfirm}
                disabled={isPending}
                className="rounded-card bg-alert px-4 py-2 font-body text-sm font-semibold text-white transition-colors hover:bg-alert/90 disabled:opacity-50"
              >
                {actionLabels.confirmDecline}
              </button>
            </div>
          </div>
        ) : null}
      </GlassCard>
    </li>
  );
}

/* ---------------- Empty ---------------- */

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-card border border-glass-border bg-glass-bg px-6 py-14 text-center">
      <div
        aria-hidden
        className="relative h-28 w-28"
        style={{
          backgroundImage: "url(/assets/empty-states/empty-no-badges.png)",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          opacity: 0.9,
        }}
      />
      <p className="max-w-md font-body text-sm text-warmgray">{message}</p>
    </div>
  );
}

/* ---------------- CSV ---------------- */

function csvCell(value: unknown): string {
  const s =
    value === null || value === undefined ? "" : String(value).replace(/"/g, '""');
  return `"${s}"`;
}

function toCsv(bookings: DashboardBooking[]): string {
  const header = [
    "Date",
    "Tourist",
    "Experience",
    "Destination",
    "Party Size",
    "Amount",
    "Commission",
    "Payout",
    "Status",
  ]
    .map(csvCell)
    .join(",");
  const rows = bookings.map((b) =>
    [
      b.date,
      b.tourist_name,
      b.badge_name,
      b.destination_brand,
      b.party_size,
      b.total_price.toFixed(2),
      b.commission.toFixed(2),
      (b.total_price - b.commission).toFixed(2),
      b.status,
    ]
      .map(csvCell)
      .join(",")
  );
  return [header, ...rows].join("\r\n");
}

function downloadCsv(filename: string, content: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

