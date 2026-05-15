import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";

const NAV_ITEMS = [
  { label: "Dashboard", active: true },
  { label: "Listings", active: false },
  { label: "Bookings", active: false },
  { label: "Reviews", active: false },
  { label: "Profile", active: false },
  { label: "Billing", active: false },
];

const STATS = [
  { label: "People Booked", value: "284", trend: "+12% MoM" },
  { label: "Revenue", value: "$24.6K", trend: "+18% MoM" },
  { label: "Rating", value: "4.9", trend: "211 reviews" },
  { label: "People Reached", value: "8.2K", trend: "+24% MoM" },
];

const ROWS = [
  {
    name: "María Quispe",
    badge: "Inca Trail Trek",
    date: "Mar 14",
    party: 4,
    total: "$420",
    status: "Confirmed",
  },
  {
    name: "James Carter",
    badge: "Arenal Volcano Hike",
    date: "Mar 16",
    party: 2,
    total: "$160",
    status: "Pending",
  },
  {
    name: "Sofía López",
    badge: "Pacuare Rafting",
    date: "Mar 18",
    party: 6,
    total: "$540",
    status: "Confirmed",
  },
  {
    name: "Erik Olafsson",
    badge: "Glacier Hike",
    date: "Mar 20",
    party: 3,
    total: "$330",
    status: "Completed",
  },
];

const STATUS_TINT: Record<string, string> = {
  Confirmed: "border-success/40 bg-success/10 text-success",
  Pending: "border-amber/40 bg-amber-soft text-amber",
  Completed: "border-glass-border bg-ocean-dark/60 text-warmgray",
};

export function DashboardMockup() {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-amber/10 blur-3xl"
      />
      <GlassCard noPadding className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-glass-border bg-ocean-dark/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 font-display text-sm font-bold text-amber">
              <Image
                src="/assets/icon.png"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5 shrink-0 rounded-lg"
              />
              Ody Hop
            </span>
            <span className="hidden font-body text-xs text-warmgray sm:inline">
              · Local Partners
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="hidden h-2 w-2 rounded-full bg-success sm:block"
            />
            <span className="hidden font-body text-xs text-warmgray sm:inline">
              Pura Vida Tours
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-soft font-display text-xs font-bold text-amber">
              CM
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr]">
          <aside className="hidden border-r border-glass-border bg-ocean-dark/40 p-3 lg:block">
            <ul className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <span
                    className={[
                      "block rounded-card px-3 py-2 font-body text-sm font-medium",
                      item.active
                        ? "bg-amber-soft text-amber"
                        : "text-warmgray",
                    ].join(" ")}
                  >
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="flex flex-col gap-5 p-5">
            <div>
              <h3 className="font-display text-lg font-bold text-white">
                Welcome back, Carlos
              </h3>
              <p className="font-body text-xs text-warmgray">
                Here&apos;s what&apos;s happening this week.
              </p>
            </div>

            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {STATS.map((stat) => (
                <li
                  key={stat.label}
                  className="rounded-card border border-glass-border bg-ocean-dark/40 p-3"
                >
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-warmgray">
                    {stat.label}
                  </p>
                  <p className="mt-1 font-display text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="font-body text-[11px] font-semibold text-amber">
                    {stat.trend}
                  </p>
                </li>
              ))}
            </ul>

            <div className="rounded-card border border-glass-border bg-ocean-dark/40 p-4">
              <div className="flex items-center justify-between">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-warmgray">
                  Bookings · last 30 days
                </p>
                <span className="font-body text-xs font-semibold text-amber">
                  +18% vs prev
                </span>
              </div>
              <BookingsChart />
            </div>

            <div className="overflow-hidden rounded-card border border-glass-border bg-ocean-dark/40">
              <div className="border-b border-glass-border bg-ocean-dark/60 px-4 py-2.5">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-warmgray">
                  Recent bookings
                </p>
              </div>
              <ul className="divide-y divide-glass-border">
                {ROWS.map((row) => (
                  <li
                    key={row.name + row.date}
                    className="flex items-center justify-between gap-4 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-body text-sm font-semibold text-white">
                        {row.name}
                      </p>
                      <p className="truncate font-body text-xs text-warmgray">
                        {row.badge} · {row.date} · {row.party} pax
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden font-body text-sm font-semibold text-amber sm:inline">
                        {row.total}
                      </span>
                      <span
                        className={[
                          "inline-flex items-center rounded-card border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider",
                          STATUS_TINT[row.status],
                        ].join(" ")}
                      >
                        {row.status}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}

function BookingsChart() {
  return (
    <svg
      viewBox="0 0 320 80"
      width="100%"
      height="80"
      className="mt-3"
      aria-hidden
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="dashfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(242,169,0,0.45)" />
          <stop offset="100%" stopColor="rgba(242,169,0,0)" />
        </linearGradient>
      </defs>
      <path
        d="M0,62 L20,55 L40,58 L60,46 L80,52 L100,38 L120,42 L140,30 L160,36 L180,22 L200,28 L220,18 L240,24 L260,12 L280,18 L300,8 L320,14 L320,80 L0,80 Z"
        fill="url(#dashfill)"
      />
      <path
        d="M0,62 L20,55 L40,58 L60,46 L80,52 L100,38 L120,42 L140,30 L160,36 L180,22 L200,28 L220,18 L240,24 L260,12 L280,18 L300,8 L320,14"
        fill="none"
        stroke="#F2A900"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
