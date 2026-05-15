import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { type ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AppStoreBadges } from "@/components/home/AppStoreBadges";
import { CountUp } from "@/components/home/CountUp";
import { PitchScrollEnabler } from "@/components/pitch/PitchScrollEnabler";
import { DESTINATIONS, OTTER_TIERS } from "@/lib/constants";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await params;
  return {
    title: "Investor Pitch | Ody Hop",
    description:
      "Confidential investor pitch for Ody Hop — a gamified tourism platform turning destinations into collectible, social, bookable experiences.",
    robots: { index: false, follow: false, nocache: true },
    alternates: { canonical: "/pitch" },
  };
}

export default async function PitchPage({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en") notFound();
  setRequestLocale("en");

  return (
    <>
      <PitchScrollEnabler />
      <div className="bg-ocean text-white">
        <SectionTitle />
        <SectionProblem />
        <SectionSolution />
        <SectionProduct />
        <SectionBusinessModel />
        <SectionMarket />
        <SectionMoat />
        <SectionTraction />
        <SectionGtm />
        <SectionTeam />
        <SectionAsk />
        <SectionClosing />
      </div>
    </>
  );
}

/* ============================================================ */
/* Shared layout primitives                                      */
/* ============================================================ */

function SectionShell({
  number,
  label,
  children,
  bg = "ocean",
  className,
}: {
  number: string;
  label: string;
  children: ReactNode;
  bg?: "ocean" | "ocean-dark" | "ocean-light";
  className?: string;
}) {
  const bgClass =
    bg === "ocean-dark"
      ? "bg-ocean-dark"
      : bg === "ocean-light"
        ? "bg-[#0e2444]"
        : "bg-ocean";

  return (
    <section
      aria-label={label}
      className={cn(
        "pitch-section relative isolate overflow-hidden border-b border-glass-border",
        "flex min-h-screen w-full flex-col justify-center py-20 sm:py-24",
        bgClass,
        className
      )}
    >
      <div
        aria-hidden
        className="pitch-bg pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(242,169,0,0.10),transparent_55%),radial-gradient(circle_at_85%_80%,rgba(18,58,111,0.45),transparent_55%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionNumber number={number} label={label} />
        {children}
      </div>
    </section>
  );
}

function SectionNumber({ number, label }: { number: string; label: string }) {
  return (
    <div className="mb-10 flex items-baseline gap-3">
      <span className="font-display text-xs font-bold tracking-[0.32em] text-amber">
        {number}
      </span>
      <span className="font-body text-[10px] font-semibold uppercase tracking-[0.32em] text-warmgray">
        / {label}
      </span>
    </div>
  );
}

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

/* ============================================================ */
/* 01 — Title                                                    */
/* ============================================================ */

function SectionTitle() {
  return (
    <section
      aria-label="Title"
      className="pitch-section relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden border-b border-glass-border bg-ocean px-4 py-24 text-center"
    >
      <div
        aria-hidden
        className="pitch-bg pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(242,169,0,0.20),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(108,74,182,0.18),transparent_60%)]"
      />
      <div
        aria-hidden
        className="pitch-bg pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-amber/15 blur-[140px]"
      />
      <div
        aria-hidden
        className="pitch-bg pointer-events-none absolute -right-40 bottom-1/4 h-72 w-72 rounded-full bg-purple/15 blur-[120px]"
      />

      <div className="relative flex flex-col items-center gap-6">
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icon.png"
            alt="Ody Hop logo"
            width={72}
            height={72}
            priority
            className="h-16 w-16 rounded-lg sm:h-20 sm:w-20"
          />
          <span className="font-display text-4xl font-bold tracking-tight text-amber sm:text-5xl">
            Ody Hop
          </span>
        </div>

        <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
          Travel like you know someone here.
        </h1>

        <p className="mt-4 max-w-2xl font-body text-base text-warmgray sm:text-xl">
          A gamified tourism platform that turns every destination into a
          collectible, social, bookable experience.
        </p>

        <span className="mt-12 inline-flex items-center gap-2 rounded-card border border-amber/30 bg-amber-soft px-4 py-1.5 font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-amber">
          Investor Pitch · 2026
        </span>

        <p className="mt-3 font-body text-[10px] uppercase tracking-[0.32em] text-warmgray/70">
          Confidential — Not for distribution
        </p>
      </div>
    </section>
  );
}

/* ============================================================ */
/* 02 — Problem                                                  */
/* ============================================================ */

function SectionProblem() {
  const pains = [
    {
      title: "Reviews are written by strangers",
      desc: "Tourists trust TripAdvisor scores from people they'll never meet, ranking places they barely visited.",
    },
    {
      title: "Guidebooks went stale a decade ago",
      desc: "Print and Google Maps pins don't tell you what's actually worth doing today.",
    },
    {
      title: "Local guides can't reach tourists at the moment of intent",
      desc: "The best operators on the ground have no way to be found by the traveler standing at their door.",
    },
  ];

  return (
    <SectionShell number="01" label="The Problem" bg="ocean-light">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            Tourism is a{" "}
            <span className="text-amber">$10 trillion</span> industry running
            on 20-year-old infrastructure.
          </h2>
          <p className="mt-6 max-w-2xl font-body text-base text-warmgray sm:text-lg">
            Travelers want to feel like locals. They have no system that gets
            them there.
          </p>

          <ul className="mt-10 flex flex-col gap-3">
            {pains.map((pain) => (
              <li key={pain.title}>
                <GlassCard className="pitch-glass flex items-start gap-4">
                  <span
                    aria-hidden
                    className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-alert/40 bg-alert/10 text-alert"
                  >
                    <XIcon />
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-white">
                      {pain.title}
                    </p>
                    <p className="mt-1 font-body text-sm text-warmgray">
                      {pain.desc}
                    </p>
                  </div>
                </GlassCard>
              </li>
            ))}
          </ul>

          <GlassCard className="pitch-glass mt-8 border-amber/30 bg-amber-soft">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
              The signal
            </p>
            <p className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
              <span className="text-amber">72%</span> of Millennial and Gen Z
              travelers prefer authentic local experiences over packaged
              tourism.
            </p>
            <p className="mt-2 font-body text-xs text-warmgray">
              Source: Booking.com Travel Predictions, 2024
            </p>
          </GlassCard>
        </div>

        <div className="flex justify-center lg:col-span-5">
          <div className="relative aspect-square w-[260px] sm:w-[320px] lg:w-[400px]">
            <div
              aria-hidden
              className="pitch-bg absolute inset-x-8 bottom-4 h-5 rounded-[50%] bg-amber/25 blur-2xl"
            />
            <Image
              src="/assets/branding/ody-explorer.png"
              alt="Ody the otter, just getting started"
              fill
              sizes="(max-width: 640px) 260px, (max-width: 1024px) 320px, 400px"
              className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* ============================================================ */
/* 03 — Solution                                                 */
/* ============================================================ */

function SectionSolution() {
  const loop = [
    { num: "1", label: "Pick a country" },
    { num: "2", label: "Go there" },
    { num: "3", label: "Collect badges" },
    { num: "4", label: "Climb the leaderboard" },
    { num: "5", label: "Win real prizes" },
    { num: "6", label: "Book local guides" },
  ];

  const tierLabels: Record<string, string> = {
    newcomer: "Newcomer",
    regular: "Regular",
    insider: "Insider",
    local: "Local",
    legend: "Local Legend",
  };

  return (
    <SectionShell number="02" label="The Solution">
      <div className="flex flex-col gap-12">
        <div>
          <h2 className="max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            Ody Hop is the{" "}
            <span className="text-amber">collectible layer</span> on top of
            travel.
          </h2>
          <p className="mt-6 max-w-3xl font-body text-base text-warmgray sm:text-lg">
            A mobile app where tourists collect GPS-verified badges by visiting
            real places, eating real food, and doing what locals do — then book
            local guides directly inside each badge.
          </p>
        </div>

        <GlassCard className="pitch-glass flex flex-col gap-5">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            The core loop
          </p>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {loop.map((step) => (
              <li
                key={step.num}
                className="flex flex-col items-center gap-3 rounded-card border border-glass-border bg-ocean-dark/40 px-3 py-4 text-center"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-card bg-amber font-display text-sm font-bold text-ocean">
                  {step.num}
                </span>
                <span className="font-display text-sm font-semibold leading-tight text-white">
                  {step.label}
                </span>
              </li>
            ))}
          </ol>
        </GlassCard>

        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            Avatar evolution
          </p>
          <p className="mt-2 max-w-3xl font-body text-sm text-warmgray sm:text-base">
            As travelers collect, their Ody otter levels up. How this place
            sees you, one badge at a time.
          </p>
          <ol className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {OTTER_TIERS.map((tier) => (
              <li
                key={tier.id}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="relative aspect-square w-[110px] sm:w-[130px]">
                  <Image
                    src={tier.image}
                    alt={`Ody as ${tierLabels[tier.id]}`}
                    fill
                    sizes="(max-width: 640px) 110px, 130px"
                    className="object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <span className="font-display text-sm font-semibold text-white">
                  {tierLabels[tier.id]}
                </span>
                <span className="font-body text-[10px] uppercase tracking-wider text-amber">
                  {tier.maxBadges === null
                    ? `${tier.minBadges}+ badges`
                    : `${tier.minBadges}–${tier.maxBadges} badges`}
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-center font-body text-xs uppercase tracking-[0.22em] text-warmgray">
            Top tier per country · Tico · Saga · Inca · Sanuk · Yalla ·
            Sourdough
          </p>
        </div>

        <p className="text-center font-display text-2xl font-bold leading-tight text-amber sm:text-4xl">
          Skip the tourist version. Get the real one.
        </p>
      </div>
    </SectionShell>
  );
}

/* ============================================================ */
/* 04 — Product                                                  */
/* ============================================================ */

function SectionProduct() {
  const features = [
    "Live operator dashboard (listings, bookings, reviews, analytics, billing)",
    "Live leaderboards · weekly, monthly, all-time",
    "Voice translator powered by xAI Grok",
    "Quest system · multi-badge themed challenges",
    "GPS + photo verification on every claim",
    "Operator marketplace inside every badge card",
  ];

  const stack = [
    "React Native (Expo)",
    "Next.js 16",
    "Supabase (Postgres + Auth + Storage)",
    "Stripe",
    "xAI Grok",
    "Vercel",
  ];

  return (
    <SectionShell number="03" label="Product · What's Built" bg="ocean-dark">
      <div className="flex flex-col gap-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
              Live in <span className="text-amber">6 countries</span>.
              <br />
              <span className="text-amber">550+ badges</span> already curated.
            </h2>
            <p className="mt-6 max-w-2xl font-body text-base text-warmgray sm:text-lg">
              iOS app in TestFlight. Website live at odyhop.com. Operator
              pipeline open.
            </p>
          </div>
          <div className="lg:col-span-5">
            <AppStoreBadges />
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {DESTINATIONS.map((d) => (
            <li
              key={d.slug}
              className="pitch-glass relative overflow-hidden rounded-card border border-glass-border"
            >
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={d.heroImage}
                  alt={`${d.brandName} hero photo`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="pitch-bg absolute inset-0 bg-gradient-to-t from-ocean-dark via-ocean-dark/40 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="font-body text-[10px] uppercase tracking-wider text-amber">
                    <span aria-hidden className="mr-1">
                      {d.flag}
                    </span>
                    {d.country}
                  </p>
                  <p className="mt-1 font-display text-sm font-bold leading-tight text-white">
                    {d.brandName}
                  </p>
                  <p className="mt-1 font-body text-[11px] font-semibold text-amber">
                    {d.badgeCount} badges
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <GlassCard className="pitch-glass flex flex-col gap-4">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
              Shipped features
            </p>
            <ul className="flex flex-col gap-2">
              {features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 font-body text-sm text-white"
                >
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          <GlassCard className="pitch-glass flex flex-col gap-4">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
              Tech stack
            </p>
            <ul className="flex flex-wrap gap-2">
              {stack.map((s) => (
                <li
                  key={s}
                  className="inline-flex items-center rounded-card border border-glass-border bg-ocean-dark/40 px-3 py-1.5 font-body text-xs font-semibold text-warmgray"
                >
                  {s}
                </li>
              ))}
            </ul>
            <p className="mt-2 font-body text-xs text-warmgray">
              8 badge categories per country: Nature, Wildlife, Beaches,
              Adventure, Food, Culture, Insider Quests, Secret Badges.
            </p>
          </GlassCard>
        </div>
      </div>
    </SectionShell>
  );
}

/* ============================================================ */
/* 05 — Business Model — 6 Revenue Streams                        */
/* ============================================================ */

function SectionBusinessModel() {
  const streams: Array<{
    n: string;
    title: string;
    pricing: string;
    body: string;
    primary?: boolean;
    future?: boolean;
  }> = [
    {
      n: "01",
      title: "Guide Marketplace",
      pricing: "15–20% commission per booking",
      body: '"Go with Carlos" appears at the exact moment a traveler is standing at the location. Highest-intent placement in tourism — guides are listed inside the badge being collected.',
      primary: true,
    },
    {
      n: "02",
      title: 'Premium · "Go Deeper"',
      pricing: "$4.99/trip · $9.99/year",
      body: "Secret badges, offline maps, voice translator, trip analytics. Low price, high margin, recurring revenue from the most engaged travelers.",
    },
    {
      n: "03",
      title: "Sponsored Badges",
      pricing: "$50–$500/month",
      body: "Hotels, restaurants, and attractions pay to BE a badge destination. A Marriott resort becomes a collectible. Price scales with traffic and exclusivity.",
    },
    {
      n: "04",
      title: "Promoted Listings",
      pricing: "$25–$150/month",
      body: 'Contextual "near this badge" placements for non-badge businesses. Geo-targeted, high intent, non-intrusive — the local cafe shows up when a traveler is two blocks away.',
    },
    {
      n: "05",
      title: "Ody Merch",
      pricing: "60–70% margin",
      body: "Collectible enamel pins of badges travelers have collected. Plush Ody toys per tier. Lanyards, patches, stickers. Print-on-demand keeps inventory at zero. Digital postcards as a side bet.",
      future: true,
    },
    {
      n: "06",
      title: "Dress Ody · Sponsor Avatar Gear",
      pricing: "$5K–$50K per brand per quarter",
      body: "Brands sponsor wearable items for the Ody avatar — REI backpack, Patagonia vest, Ray-Ban sunglasses, Marriott bathrobe. Travelers unlock branded gear by visiting sponsor locations. Every shared badge becomes organic brand exposure.",
      future: true,
    },
  ];

  return (
    <SectionShell number="04" label="Business Model">
      <div className="flex flex-col gap-10">
        <div>
          <h2 className="max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            <span className="text-amber">Six</span> ways to make money.
            <br />
            One platform, compounding revenue.
          </h2>
          <p className="mt-6 max-w-3xl font-body text-base text-warmgray sm:text-lg">
            Marketplace commissions plus subscription plus sponsored placement
            plus merch plus brand integrations. Each stream gets bigger as the
            badge network grows.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {streams.map((stream) => (
            <li key={stream.n}>
              <GlassCard
                className={cn(
                  "pitch-glass flex h-full flex-col gap-3 transition-colors duration-200",
                  stream.primary && "border-amber/60 bg-amber-soft"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold tracking-[0.32em] text-amber">
                    {stream.n}
                  </span>
                  {stream.primary ? (
                    <span className="inline-flex items-center rounded-card bg-amber px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-ocean">
                      Primary
                    </span>
                  ) : stream.future ? (
                    <span className="inline-flex items-center rounded-card border border-purple/50 bg-purple/15 px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-purple">
                      Future
                    </span>
                  ) : null}
                </div>
                <h3 className="font-display text-lg font-bold text-white">
                  {stream.title}
                </h3>
                <p className="font-display text-sm font-semibold text-amber">
                  {stream.pricing}
                </p>
                <p className="font-body text-sm text-warmgray">{stream.body}</p>
              </GlassCard>
            </li>
          ))}
        </ul>

        <GlassCard className="pitch-glass">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            Why the model compounds
          </p>
          <p className="mt-3 font-body text-sm text-white sm:text-base">
            Every new badge creates four new revenue surfaces: it can be
            sponsored, host a promoted listing, get booked through, and unlock
            premium content. Add a country, add 100 badges, multiply every
            stream by 100.
          </p>
        </GlassCard>
      </div>
    </SectionShell>
  );
}

/* ============================================================ */
/* 06 — Market Opportunity                                       */
/* ============================================================ */

function SectionMarket() {
  const researched = [
    "Costa Rica",
    "Iceland",
    "Peru",
    "Thailand",
    "Saudi Arabia",
    "Alaska",
    "Italy",
    "Norway",
    "Guatemala",
    "Morocco",
    "New Zealand",
    "Australia",
    "Bali",
    "Argentina",
    "Chile",
    "Brazil",
    "Hawaii",
    "Colorado",
    "California",
    "Japan",
    "Greece",
    "Finland",
  ];

  return (
    <SectionShell number="05" label="Market Opportunity" bg="ocean-light">
      <div className="flex flex-col gap-12">
        <div>
          <h2 className="max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            A <span className="text-amber">$10.4 trillion</span> market.
            <br />
            Growing faster than the broader economy.
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <MarketStat
            value="$10.4T"
            label="Global tourism market (2024)"
            sub="Growing 7% YoY"
          />
          <MarketStat
            value="15%"
            label="Adventure / experiential tourism CAGR"
            sub="Fastest-growing segment"
          />
          <MarketStat
            value="$30.7B"
            label="Gamification market by 2025"
            sub="Travel is the largest underserved vertical"
          />
        </ul>

        <GlassCard className="pitch-glass">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            Target traveler
          </p>
          <p className="mt-2 font-display text-xl font-semibold text-white sm:text-2xl">
            18–35 year olds who pick experiences over resorts.
          </p>
          <p className="mt-3 max-w-3xl font-body text-sm text-warmgray sm:text-base">
            Millennials and Gen Z spend more on travel than any previous
            cohort, plan trips around food and local culture, and share every
            stop on Instagram and TikTok. They are the natural customer for a
            collectible, social, social-proof-driven travel app.
          </p>
        </GlassCard>

        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            Expansion path
          </p>
          <p className="mt-2 max-w-3xl font-body text-sm text-warmgray sm:text-base">
            22 destinations already researched — slang dictionaries, GPS
            coordinates, cultural notes, badge lists. Each new country is a
            data file, not a rebuild.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {researched.map((country, i) => (
              <li
                key={country}
                className={cn(
                  "inline-flex items-center rounded-card border px-3 py-1.5 font-body text-xs font-semibold",
                  i < 6
                    ? "border-amber/40 bg-amber-soft text-amber"
                    : "border-glass-border bg-glass-bg text-warmgray"
                )}
              >
                {i < 6 ? "● Live · " : "○ "}
                {country}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SectionShell>
  );
}

function MarketStat({
  value,
  label,
  sub,
}: {
  value: string;
  label: string;
  sub: string;
}) {
  return (
    <li>
      <GlassCard className="pitch-glass flex h-full flex-col gap-2">
        <p className="font-display text-4xl font-bold text-amber sm:text-5xl">
          {value}
        </p>
        <p className="font-display text-sm font-semibold text-white">
          {label}
        </p>
        <p className="font-body text-xs text-warmgray">{sub}</p>
      </GlassCard>
    </li>
  );
}

/* ============================================================ */
/* 07 — Competitive Advantage                                    */
/* ============================================================ */

function SectionMoat() {
  const moats = [
    {
      n: "01",
      title: "Operator network on day one",
      body: "Costa Rica is seeded with 20+ verified guides ready at launch — built personally by a co-founder living there. Cold-start supply is solved before we run a single user ad.",
    },
    {
      n: "02",
      title: "One codebase, every country",
      body: "Multi-destination architecture. Adding a destination is a data file, not a rebuild. The same app handles Costa Rica today, Italy and Morocco tomorrow.",
    },
    {
      n: "03",
      title: "Marketplace inside the moment",
      body: "Guides surface when the traveler is physically standing at the location. No competitor places a booking option at the exact moment of intent.",
    },
  ];

  const comps: Array<{
    name: string;
    gamification: string;
    marketplace: string;
    multi: string;
    gps: string;
  }> = [
    {
      name: "Ody Hop",
      gamification: "✓",
      marketplace: "✓",
      multi: "✓",
      gps: "✓",
    },
    { name: "Wanderlog", gamification: "—", marketplace: "—", multi: "✓", gps: "—" },
    { name: "Geocaching", gamification: "✓", marketplace: "—", multi: "✓", gps: "✓" },
    {
      name: "Lanna Passport",
      gamification: "✓",
      marketplace: "—",
      multi: "—",
      gps: "✓",
    },
    {
      name: "GetYourGuide / Viator",
      gamification: "—",
      marketplace: "✓",
      multi: "✓",
      gps: "—",
    },
  ];

  return (
    <SectionShell number="06" label="Competitive Advantage">
      <div className="flex flex-col gap-12">
        <h2 className="max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
          Why we win.
        </h2>

        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {moats.map((moat) => (
            <li key={moat.n}>
              <GlassCard className="pitch-glass flex h-full flex-col gap-3">
                <span className="font-display text-xs font-bold tracking-[0.32em] text-amber">
                  {moat.n}
                </span>
                <h3 className="font-display text-lg font-bold leading-tight text-white">
                  {moat.title}
                </h3>
                <p className="font-body text-sm text-warmgray">{moat.body}</p>
              </GlassCard>
            </li>
          ))}
        </ul>

        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            Landscape
          </p>
          <p className="mt-2 max-w-3xl font-body text-sm text-warmgray sm:text-base">
            No competitor combines gamification + marketplace + multi-country +
            GPS verification. The closest comp is single-country, no
            marketplace.
          </p>

          <div className="mt-6 overflow-x-auto rounded-card border border-glass-border">
            <table className="min-w-full text-left">
              <thead className="bg-ocean-dark/60">
                <tr>
                  <Th>Player</Th>
                  <Th className="text-center">Gamification</Th>
                  <Th className="text-center">Marketplace</Th>
                  <Th className="text-center">Multi-country</Th>
                  <Th className="text-center">GPS verified</Th>
                </tr>
              </thead>
              <tbody>
                {comps.map((c, i) => (
                  <tr
                    key={c.name}
                    className={cn(
                      i === 0
                        ? "border-t border-amber/40 bg-amber-soft/40"
                        : "border-t border-glass-border",
                      i > 0 && i % 2 === 1 ? "bg-ocean-dark/30" : ""
                    )}
                  >
                    <td
                      className={cn(
                        "px-5 py-3 font-display text-sm font-semibold",
                        i === 0 ? "text-amber" : "text-white"
                      )}
                    >
                      {c.name}
                    </td>
                    <CompCell value={c.gamification} />
                    <CompCell value={c.marketplace} />
                    <CompCell value={c.multi} />
                    <CompCell value={c.gps} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

function Th({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-5 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-warmgray",
        className
      )}
    >
      {children}
    </th>
  );
}

function CompCell({ value }: { value: string }) {
  const isYes = value === "✓";
  return (
    <td
      className={cn(
        "px-5 py-3 text-center font-display text-base font-bold",
        isYes ? "text-success" : "text-warmgray"
      )}
    >
      {value}
    </td>
  );
}

/* ============================================================ */
/* 08 — Traction & Milestones                                    */
/* ============================================================ */

function SectionTraction() {
  const milestones = [
    "iOS app live in TestFlight, tested daily in Costa Rica",
    "Website live at odyhop.com — operator pipeline open",
    "550+ badges curated across 6 destinations",
    "22 destinations researched and ready to populate",
    "Operator application form live with photo verification",
    "Corporate structure: Delaware C-Corp + Operations LLC + Destination LLCs",
  ];

  return (
    <SectionShell number="07" label="Traction & Milestones" bg="ocean-dark">
      <div className="flex flex-col gap-12">
        <h2 className="max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
          Built, shipped, growing.
        </h2>

        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <TractionStat end={550} suffix="+" label="Badges curated" />
          <TractionStat end={6} label="Destinations live" />
          <TractionStat end={22} label="Destinations researched" />
          <TractionStat end={8} label="Categories per country" />
        </ul>

        <GlassCard className="pitch-glass">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            What&apos;s already shipped
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {milestones.map((m) => (
              <li
                key={m}
                className="flex items-start gap-2 font-body text-sm text-white"
              >
                <CheckIcon />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </SectionShell>
  );
}

function TractionStat({
  end,
  suffix,
  label,
}: {
  end: number;
  suffix?: string;
  label: string;
}) {
  return (
    <li className="flex flex-col items-center text-center">
      <span className="font-display text-5xl font-bold tracking-tight text-amber sm:text-6xl">
        <CountUp end={end} suffix={suffix} />
      </span>
      <span className="mt-2 max-w-[160px] font-body text-xs font-semibold uppercase tracking-[0.18em] text-warmgray">
        {label}
      </span>
    </li>
  );
}

/* ============================================================ */
/* 09 — Go-to-Market                                             */
/* ============================================================ */

function SectionGtm() {
  const phases = [
    {
      label: "Phase 1 · Now",
      title: "Costa Rica pilot",
      body: "Co-founder's operator network seeds the supply side. 20+ guides onboarded. Tourist users sourced through TestFlight + warm channels in-country.",
    },
    {
      label: "Phase 2 · Month 3–6",
      title: "Public launch",
      body: "iOS and Play Store launch. Influencer partnerships with travel creators. Tourist acquisition via Instagram and TikTok geo-targeting in Costa Rica airports and hotels.",
    },
    {
      label: "Phase 3 · Month 6–12",
      title: "Iceland + Peru",
      body: "Apply the proven Costa Rica playbook to the next two countries already populated. Replicate the operator seeding model with vetted partner intros.",
    },
    {
      label: "Phase 4 · Year 2",
      title: "Scale to 12 countries · Agent Platform · Merch",
      body: "Double the country count. Launch B2B Agent Platform (white-label for travel agencies). Open the merch store. Open Dress Ody sponsor program.",
    },
  ];

  return (
    <SectionShell number="08" label="Go-to-Market">
      <div className="flex flex-col gap-12">
        <h2 className="max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
          A staged rollout. Costa Rica first.
        </h2>

        <ol className="relative flex flex-col gap-4">
          <div
            aria-hidden
            className="pitch-bg absolute left-6 top-2 hidden h-[calc(100%-1rem)] w-px bg-gradient-to-b from-amber/60 via-amber/30 to-amber/0 sm:block"
          />
          {phases.map((phase, i) => (
            <li
              key={phase.label}
              className="relative flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-6"
            >
              <span
                aria-hidden
                className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-amber font-display text-lg font-bold text-ocean shadow-[0_8px_24px_-12px_rgba(242,169,0,0.7)]"
              >
                {i + 1}
              </span>
              <GlassCard className="pitch-glass flex flex-1 flex-col gap-2">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
                  {phase.label}
                </p>
                <h3 className="font-display text-lg font-bold text-white sm:text-xl">
                  {phase.title}
                </h3>
                <p className="font-body text-sm text-warmgray sm:text-base">
                  {phase.body}
                </p>
              </GlassCard>
            </li>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}

/* ============================================================ */
/* 10 — Team                                                     */
/* ============================================================ */

function SectionTeam() {
  return (
    <SectionShell number="09" label="The Team" bg="ocean-light">
      <div className="flex flex-col gap-12">
        <div>
          <h2 className="max-w-4xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
            Built by a brother team.
            <br />
            One builds the product. The other builds the network.
          </h2>
        </div>

        <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <li>
            <FounderCard
              initials="F1"
              name="Founder One"
              role="Co-founder & CEO · Product, Technology, AI"
              bio="Leads product, engineering, and AI integration. Built the Ody Hop mobile app, operator dashboard, and AI translator stack end to end. Two decades shipping software products."
            />
          </li>
          <li>
            <FounderCard
              initials="F2"
              name="Founder Two"
              role="Co-founder & Operations · Costa Rica, Operator Network"
              bio="Based in Costa Rica. Owns the on-the-ground operator pipeline — 20+ guides already verified for launch. Decade of running tour operations across Latin America."
            />
          </li>
        </ul>

        <GlassCard className="pitch-glass">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            Why a brother team matters
          </p>
          <p className="mt-2 font-body text-sm text-white sm:text-base">
            Tourism is a two-sided market. Most marketplaces lose because they
            can&apos;t seed supply. We have the operator side covered before launch
            — and the product side runs at the speed of a single decision
            maker. No founder politics, no committee, no cold-start gap.
          </p>
        </GlassCard>
      </div>
    </SectionShell>
  );
}

function FounderCard({
  initials,
  name,
  role,
  bio,
}: {
  initials: string;
  name: string;
  role: string;
  bio: string;
}) {
  return (
    <GlassCard className="pitch-glass flex h-full flex-col gap-4">
      <div className="flex items-center gap-4">
        <span
          aria-hidden
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber/30 bg-amber-soft font-display text-lg font-bold text-amber"
        >
          {initials}
        </span>
        <div>
          <p className="font-display text-lg font-bold text-white">{name}</p>
          <p className="mt-0.5 font-body text-xs font-semibold uppercase tracking-[0.18em] text-amber">
            {role}
          </p>
        </div>
      </div>
      <p className="font-body text-sm text-warmgray">{bio}</p>
    </GlassCard>
  );
}

/* ============================================================ */
/* 11 — The Ask                                                  */
/* ============================================================ */

function SectionAsk() {
  return (
    <SectionShell number="10" label="The Ask">
      <div className="flex flex-col items-center gap-10 text-center">
        <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl">
          We&apos;re raising to launch Costa Rica
          <br />
          and scale the playbook.
        </h2>

        <GlassCard className="pitch-glass mx-auto max-w-2xl">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-amber">
            Open to conversation
          </p>
          <p className="mt-3 font-body text-base text-white sm:text-lg">
            Investment details shared in person. Term sheets, structure,
            milestones, and use of funds — discussed directly with serious
            partners.
          </p>
          <a
            href="mailto:invest@odyhop.com"
            className="mt-6 inline-flex items-center gap-2 rounded-card bg-amber px-5 py-3 font-display text-base font-bold text-ocean shadow-[0_12px_30px_-12px_rgba(242,169,0,0.7)] transition-transform hover:-translate-y-0.5"
          >
            <MailIcon />
            invest@odyhop.com
          </a>
          <p className="mt-4 font-body text-xs text-warmgray">
            Reply within 24 hours · Calls scheduled within the week
          </p>
        </GlassCard>
      </div>
    </SectionShell>
  );
}

/* ============================================================ */
/* 12 — Closing                                                  */
/* ============================================================ */

function SectionClosing() {
  return (
    <section
      aria-label="Closing"
      className="pitch-section relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-ocean px-4 py-24 text-center"
    >
      <div
        aria-hidden
        className="pitch-bg pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(242,169,0,0.20),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(108,74,182,0.18),transparent_60%)]"
      />

      <div className="relative flex flex-col items-center gap-8">
        <div className="relative aspect-square w-[260px] sm:w-[340px] lg:w-[420px]">
          <div
            aria-hidden
            className="pitch-bg absolute inset-x-8 bottom-3 h-5 rounded-[50%] bg-amber/25 blur-2xl"
          />
          <Image
            src="/assets/branding/ody-legendary.png"
            alt="Ody, Local Legend"
            fill
            sizes="(max-width: 640px) 260px, (max-width: 1024px) 340px, 420px"
            className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
          />
        </div>

        <h2 className="max-w-4xl font-display text-3xl font-bold leading-[1.05] text-white sm:text-6xl">
          Travel like you know someone here.
        </h2>

        <a
          href="https://odyhop.com"
          className="font-display text-xl font-bold tracking-tight text-amber hover:underline sm:text-2xl"
        >
          odyhop.com
        </a>

        <p className="mt-10 font-body text-[10px] uppercase tracking-[0.32em] text-warmgray/70">
          Confidential — Not for distribution · © 2026 Ody Hop
        </p>
      </div>
    </section>
  );
}

/* ============================================================ */
/* Icons                                                         */
/* ============================================================ */

function CheckIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F2A900"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="mt-0.5 shrink-0"
    >
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 6l12 12" />
      <path d="M18 6L6 18" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3 7l9 7 9-7" />
    </svg>
  );
}
