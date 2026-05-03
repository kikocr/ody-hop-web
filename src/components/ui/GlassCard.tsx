import { type HTMLAttributes, type ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
  as?: "div" | "section" | "article";
};

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function GlassCard({
  children,
  className,
  noPadding = false,
  as: Component = "div",
  ...rest
}: GlassCardProps) {
  return (
    <Component
      className={cn(
        "bg-glass-bg backdrop-blur-glass border border-glass-border rounded-card",
        noPadding ? "" : "p-6",
        className
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
