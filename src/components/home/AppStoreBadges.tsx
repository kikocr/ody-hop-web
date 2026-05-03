import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/constants";

type Props = {
  className?: string;
  variant?: "dark" | "light";
};

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

export function AppStoreBadges({ className, variant = "dark" }: Props) {
  const base =
    "inline-flex items-center gap-3 rounded-card px-4 py-2.5 transition-colors duration-150";
  const skin =
    variant === "dark"
      ? "bg-black text-white border border-white/15 hover:border-amber/60"
      : "bg-white text-ocean border border-white/30 hover:border-amber";

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Download on the App Store"
        className={cn(base, skin)}
      >
        <AppleLogo />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wider opacity-80">
            Download on the
          </span>
          <span className="block font-display text-base font-semibold">
            App Store
          </span>
        </span>
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Get it on Google Play"
        className={cn(base, skin)}
      >
        <GooglePlayLogo />
        <span className="text-left leading-tight">
          <span className="block text-[10px] uppercase tracking-wider opacity-80">
            Get it on
          </span>
          <span className="block font-display text-base font-semibold">
            Google Play
          </span>
        </span>
      </a>
    </div>
  );
}

function AppleLogo() {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="currentColor"
      aria-hidden
    >
      <path d="M16.41 13.74c-.03-2.93 2.39-4.34 2.5-4.41-1.36-1.99-3.49-2.27-4.24-2.29-1.81-.18-3.53 1.07-4.45 1.07-.94 0-2.34-1.05-3.85-1.02-1.98.03-3.81 1.15-4.83 2.93-2.06 3.57-.53 8.84 1.48 11.74.98 1.42 2.15 3.01 3.69 2.95 1.49-.06 2.05-.96 3.85-.96 1.79 0 2.31.96 3.88.93 1.6-.03 2.61-1.45 3.59-2.87 1.13-1.65 1.59-3.25 1.62-3.33-.03-.02-3.11-1.19-3.14-4.74zM13.59 5.19c.81-.99 1.36-2.36 1.21-3.74-1.17.05-2.6.78-3.43 1.76-.74.86-1.4 2.27-1.22 3.61 1.31.1 2.63-.66 3.44-1.63z" />
    </svg>
  );
}

function GooglePlayLogo() {
  return (
    <svg
      width="22"
      height="26"
      viewBox="0 0 22 26"
      fill="currentColor"
      aria-hidden
    >
      <path d="M2.32 1.4c-.36.36-.57.91-.57 1.63v20c0 .72.21 1.27.57 1.63l.07.06L13.5 13.31v-.27L2.39 1.34l-.07.06z" />
      <path
        d="M17.21 17.05l-3.71-3.74v-.27l3.71-3.73.08.05 4.39 2.5c1.25.71 1.25 1.87 0 2.59l-4.39 2.5-.08.1z"
        opacity="0.85"
      />
      <path
        d="M17.29 17l-3.79-3.79L2.32 24.4c.41.43 1.09.49 1.86.06l13.11-7.46"
        opacity="0.7"
      />
      <path
        d="M17.29 9.43L4.18 1.97c-.77-.43-1.45-.38-1.86.06l11.18 11.18 3.79-3.78z"
        opacity="0.6"
      />
    </svg>
  );
}
