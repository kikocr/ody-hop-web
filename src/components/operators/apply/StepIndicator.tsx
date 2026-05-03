"use client";

import { useTranslations } from "next-intl";

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

type Props = {
  current: number;
  total: number;
  labels: ReadonlyArray<string>;
  onJump?: (target: number) => void;
};

export function StepIndicator({ current, total, labels, onJump }: Props) {
  const t = useTranslations("apply");

  return (
    <div>
      <ol className="hidden items-center gap-3 sm:flex">
        {labels.map((label, index) => {
          const stepNumber = index + 1;
          const state =
            stepNumber < current
              ? "done"
              : stepNumber === current
              ? "active"
              : "todo";
          const clickable = state === "done" && onJump;
          return (
            <li key={label} className="flex flex-1 items-center gap-3">
              <button
                type="button"
                onClick={clickable ? () => onJump(stepNumber) : undefined}
                disabled={!clickable}
                className={cn(
                  "flex items-center gap-3 rounded-card px-2 py-1 text-left transition-colors",
                  clickable && "cursor-pointer hover:bg-glass-bg"
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-card border font-display text-sm font-bold transition-colors",
                    state === "done" &&
                      "border-success bg-success/15 text-success",
                    state === "active" && "border-amber bg-amber text-ocean",
                    state === "todo" &&
                      "border-glass-border bg-glass-bg text-warmgray"
                  )}
                  aria-hidden
                >
                  {state === "done" ? <CheckIcon /> : stepNumber}
                </span>
                <span
                  className={cn(
                    "font-body text-xs font-semibold uppercase tracking-[0.16em]",
                    state === "active" ? "text-white" : "text-warmgray"
                  )}
                >
                  {label}
                </span>
              </button>
              {index < total - 1 ? (
                <span
                  aria-hidden
                  className={cn(
                    "h-px flex-1 transition-colors",
                    stepNumber < current ? "bg-success/60" : "bg-glass-border"
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex items-center justify-between">
          <span className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-amber">
            {t("stepOf", { current, total })}
          </span>
          <span className="font-body text-xs font-semibold text-white">
            {labels[current - 1]}
          </span>
        </div>
        <div
          className="h-1.5 overflow-hidden rounded-card bg-glass-bg"
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          <div
            className="h-full rounded-card bg-amber transition-all duration-300"
            style={{ width: `${(current / total) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 12l5 5 9-11" />
    </svg>
  );
}
