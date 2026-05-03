import Image from "next/image";
import { GlassCard } from "@/components/ui/GlassCard";
import { type SampleBadge, type BadgeRarity } from "@/lib/mock-data";

const RARITY_FRAME: Record<BadgeRarity, string> = {
  common: "/assets/frames/frame-common.png",
  rare: "/assets/frames/frame-rare.png",
  epic: "/assets/frames/frame-epic.png",
  legendary: "/assets/frames/frame-legendary.png",
};

const RARITY_LABEL: Record<BadgeRarity, string> = {
  common: "Common",
  rare: "Rare",
  epic: "Epic",
  legendary: "Legendary",
};

const DIFFICULTY_LABEL: Record<SampleBadge["difficulty"], string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
  legendary: "Legendary",
};

const DIFFICULTY_TINT: Record<SampleBadge["difficulty"], string> = {
  easy: "border-success/40 text-success",
  medium: "border-amber/40 text-amber",
  hard: "border-alert/40 text-alert",
  legendary: "border-purple/50 text-purple",
};

type Props = {
  badge: SampleBadge;
  className?: string;
};

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function BadgeCard({ badge, className }: Props) {
  return (
    <GlassCard
      className={cn(
        "flex h-full flex-col gap-3 transition-colors duration-200 hover:border-amber/40",
        className
      )}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[200px]">
        <div className="absolute inset-[10%] overflow-hidden rounded-full bg-ocean-dark ring-1 ring-glass-border">
          <Image
            src={badge.imageUrl}
            alt=""
            fill
            sizes="200px"
            className="object-cover"
          />
        </div>
        <Image
          src={RARITY_FRAME[badge.rarity]}
          alt=""
          fill
          sizes="200px"
          className="pointer-events-none object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <h4 className="font-display text-base font-semibold leading-snug text-white">
          {badge.name}
        </h4>
        <p className="font-body text-xs text-warmgray">
          {badge.description}
        </p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
        <span className="inline-flex items-center rounded-card bg-amber px-2 py-0.5 font-body text-xs font-bold text-ocean">
          +{badge.points} PTS
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-card border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider",
            DIFFICULTY_TINT[badge.difficulty]
          )}
        >
          {DIFFICULTY_LABEL[badge.difficulty]}
        </span>
        <span className="inline-flex items-center rounded-card border border-glass-border px-2 py-0.5 font-body text-[10px] font-semibold uppercase tracking-wider text-warmgray">
          {RARITY_LABEL[badge.rarity]}
        </span>
      </div>
    </GlassCard>
  );
}
