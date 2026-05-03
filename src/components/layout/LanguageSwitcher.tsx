"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { locales, type Locale } from "@/i18n/config";

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

type Props = {
  className?: string;
};

export function LanguageSwitcher({ className }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as Locale;

  function handleChange(next: Locale) {
    if (next === currentLocale) return;
    router.replace(pathname, { locale: next });
  }

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center gap-1 rounded-card border border-glass-border bg-glass-bg px-1 py-1 text-xs font-semibold",
        className
      )}
    >
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => handleChange(loc)}
          aria-pressed={currentLocale === loc}
          aria-label={loc === "en" ? "English" : "Español"}
          className={cn(
            "rounded-card px-2 py-1 uppercase transition-colors",
            currentLocale === loc
              ? "bg-amber text-ocean"
              : "text-warmgray hover:text-white"
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
