import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function Home() {
  return (
    <div className="relative flex flex-1 flex-col">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean via-ocean to-ocean-light opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(242,169,0,0.12),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(18,58,111,0.6),transparent_60%)]"
      />

      <section className="relative mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-8 px-4 py-20 text-center sm:px-6 lg:px-8">
        <span className="font-body text-xs font-semibold uppercase tracking-[0.3em] text-amber">
          Ody Hop · Coming Soon
        </span>
        <h1 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl">
          Collect the World.
          <br />
          <span className="text-amber">One Badge at a Time.</span>
        </h1>
        <p className="max-w-xl font-body text-base text-warmgray sm:text-lg">
          A gamified tourism platform where tourists explore real destinations,
          claim photo + GPS-verified badges, climb the leaderboard, and book
          vetted local tour guides — all in one place.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/download" variant="primary" size="lg">
            Download the App
          </Button>
          <Button href="/operators" variant="secondary" size="lg">
            I&apos;m a Tour Guide
          </Button>
        </div>

        <GlassCard className="mt-10 w-full max-w-2xl">
          <SectionHeader
            title="Scaffold ready."
            subtitle="Design system, layout shell, and routing are wired up. Pages roll out next."
            align="center"
          />
          <ul className="mt-6 grid grid-cols-2 gap-4 text-left font-body text-sm text-warmgray sm:grid-cols-4">
            {[
              { label: "Destinations", count: "6" },
              { label: "Badges", count: "550+" },
              { label: "Categories", count: "8" },
              { label: "Rarities", count: "4" },
            ].map((stat) => (
              <li
                key={stat.label}
                className="rounded-card border border-glass-border bg-glass-bg p-3 text-center"
              >
                <div className="font-display text-2xl font-bold text-amber">
                  {stat.count}
                </div>
                <div className="mt-1 text-xs uppercase tracking-widest">
                  {stat.label}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-warmgray">
            Visit the&nbsp;
            <Link href="/destinations" className="text-amber hover:underline">
              destinations hub
            </Link>
            &nbsp;or&nbsp;
            <Link href="/operators" className="text-amber hover:underline">
              operator landing
            </Link>
            &nbsp;(routes pending).
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
