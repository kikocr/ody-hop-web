import { type ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  accent?: boolean;
  eyebrow?: string;
  className?: string;
  children?: ReactNode;
};

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  accent = true,
  eyebrow,
  className,
  children,
}: SectionHeaderProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <header className={cn("flex flex-col gap-3", alignment, className)}>
      {eyebrow ? (
        <span className="font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl font-body text-lg text-warmgray">{subtitle}</p>
      ) : null}
      {accent ? (
        <span
          aria-hidden
          className={cn(
            "mt-1 block h-[3px] w-12 bg-amber rounded-card",
            align === "center" && "self-center"
          )}
        />
      ) : null}
      {children}
    </header>
  );
}
