import { GlassCard } from "@/components/ui/GlassCard";

export function HeroDashboardPreview() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-amber/10 blur-3xl"
      />
      <GlassCard className="relative w-full max-w-md">
        <header className="flex items-center justify-between">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-amber">
              Operator Dashboard
            </p>
            <p className="mt-1 font-display text-base font-bold text-white">
              Pura Vida Tours
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-card border border-success/40 bg-success/10 px-2 py-1 font-body text-[11px] font-semibold text-success">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />
            Active
          </span>
        </header>

        <ul className="mt-5 grid grid-cols-2 gap-3">
          <Stat label="Bookings" value="42" trend="+12%" />
          <Stat label="Revenue" value="$3.8K" trend="+18%" />
          <Stat label="Rating" value="4.9" trend="★ 128" />
          <Stat label="Views" value="1.2K" trend="+24%" />
        </ul>

        <div className="mt-5 rounded-card border border-glass-border bg-ocean-dark/60 p-3">
          <div className="flex items-center justify-between">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-warmgray">
              Bookings · 7d
            </p>
            <span className="font-body text-xs text-amber">+18%</span>
          </div>
          <Sparkline />
        </div>

        <ul className="mt-5 flex flex-col gap-2">
          <BookingRow tourist="M. Quispe" badge="Arenal Volcano Hike" status="confirmed" />
          <BookingRow tourist="J. Smith" badge="Manuel Antonio" status="pending" />
        </ul>
      </GlassCard>
    </div>
  );
}

function Stat({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <li className="rounded-card border border-glass-border bg-ocean-dark/40 p-3">
      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-warmgray">
        {label}
      </p>
      <p className="mt-1 font-display text-2xl font-bold text-white">
        {value}
      </p>
      <p className="font-body text-[11px] font-semibold text-amber">{trend}</p>
    </li>
  );
}

function Sparkline() {
  return (
    <svg
      viewBox="0 0 200 50"
      width="100%"
      height="44"
      className="mt-2"
      aria-hidden
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="sparkfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(242,169,0,0.4)" />
          <stop offset="100%" stopColor="rgba(242,169,0,0)" />
        </linearGradient>
      </defs>
      <path
        d="M0,38 L20,30 L40,32 L60,22 L80,28 L100,18 L120,22 L140,12 L160,18 L180,8 L200,14 L200,50 L0,50 Z"
        fill="url(#sparkfill)"
      />
      <path
        d="M0,38 L20,30 L40,32 L60,22 L80,28 L100,18 L120,22 L140,12 L160,18 L180,8 L200,14"
        fill="none"
        stroke="#F2A900"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BookingRow({
  tourist,
  badge,
  status,
}: {
  tourist: string;
  badge: string;
  status: "confirmed" | "pending";
}) {
  const statusClass =
    status === "confirmed"
      ? "border-success/40 bg-success/10 text-success"
      : "border-amber/40 bg-amber-soft text-amber";
  const statusLabel = status === "confirmed" ? "Confirmed" : "Pending";

  return (
    <li className="flex items-center justify-between rounded-card border border-glass-border bg-ocean-dark/40 px-3 py-2">
      <div className="min-w-0">
        <p className="truncate font-body text-sm font-semibold text-white">
          {tourist}
        </p>
        <p className="truncate font-body text-xs text-warmgray">{badge}</p>
      </div>
      <span
        className={`inline-flex shrink-0 items-center rounded-card border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider ${statusClass}`}
      >
        {statusLabel}
      </span>
    </li>
  );
}
