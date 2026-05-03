import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { CATEGORIES } from "@/lib/constants";
import { type CategoryBreakdown } from "@/lib/mock-data";

type Props = {
  breakdown: CategoryBreakdown;
};

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function CategoryGrid({ breakdown }: Props) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-4">
      {CATEGORIES.map((category) => {
        const count = breakdown[category.id] ?? 0;
        const isPremium = category.premium;
        return (
          <li key={category.id}>
            <GlassCard
              className={cn(
                "flex h-full flex-col items-center gap-3 text-center",
                isPremium && "border-amber/50 bg-amber-soft"
              )}
            >
              <div className="relative h-12 w-12">
                <Image
                  src={category.icon}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-contain"
                />
                {isPremium ? (
                  <span
                    aria-hidden
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber text-ocean shadow-[0_4px_10px_-4px_rgba(0,0,0,0.5)]"
                  >
                    <LockIcon />
                  </span>
                ) : null}
              </div>
              <h3 className="font-display text-sm font-semibold leading-tight text-white">
                {category.name}
              </h3>
              <span className="inline-flex items-center rounded-card border border-glass-border bg-glass-bg px-2 py-0.5 font-body text-xs font-semibold text-amber">
                {count} badges
              </span>
              {isPremium ? (
                <span className="inline-flex items-center rounded-card bg-amber px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-ocean">
                  Premium
                </span>
              ) : null}
            </GlassCard>
          </li>
        );
      })}
    </ul>
  );
}

function LockIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="5" y="11" width="14" height="9" rx="1" />
      <path d="M8 11V7a4 4 0 1 1 8 0v4" />
    </svg>
  );
}
