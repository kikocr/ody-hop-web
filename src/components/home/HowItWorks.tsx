import { useTranslations } from "next-intl";
import { type ReactNode } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function HowItWorks() {
  const t = useTranslations("home");

  const steps: Array<{ title: string; desc: string; icon: ReactNode }> = [
    {
      title: t("step1Title"),
      desc: t("step1Desc"),
      icon: <GlobeIcon />,
    },
    {
      title: t("step2Title"),
      desc: t("step2Desc"),
      icon: <BadgeIcon />,
    },
    {
      title: t("step3Title"),
      desc: t("step3Desc"),
      icon: <PodiumIcon />,
    },
    {
      title: t("step4Title"),
      desc: t("step4Desc"),
      icon: <GiftIcon />,
    },
  ];

  return (
    <section
      id="how-it-works"
      aria-label="How Ody Hop works"
      className="relative bg-[#0e2444] py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title={t("howItWorks")}
          subtitle={t("destinationsSubtitle")}
          align="center"
        />

        <div className="relative mt-16">
          <div
            aria-hidden
            className="pointer-events-none absolute left-[10%] right-[10%] top-7 hidden lg:block"
          >
            <svg
              width="100%"
              height="2"
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              <line
                x1="0"
                y1="1"
                x2="100%"
                y2="1"
                stroke="rgba(242,169,0,0.4)"
                strokeWidth="2"
                strokeDasharray="8 8"
              />
            </svg>
          </div>

          <ol className="relative grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <li
                key={step.title}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-card bg-amber font-display text-xl font-bold text-ocean shadow-[0_8px_24px_-12px_rgba(242,169,0,0.7)]">
                  {index + 1}
                </div>
                <div className="mt-5 inline-flex h-16 w-16 items-center justify-center rounded-card border border-glass-border bg-glass-bg text-amber backdrop-blur-glass">
                  {step.icon}
                </div>
                <h3 className="mt-5 font-display text-xl font-semibold text-white">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-xs font-body text-sm text-warmgray">
                  {step.desc}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function GlobeIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18" />
      <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
  );
}

function BadgeIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="9" r="6" />
      <path d="M9 14l-1.6 7L12 18l4.6 3L15 14" />
      <path d="M12 6v3l2 1" />
    </svg>
  );
}

function PodiumIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="9" y="7" width="6" height="14" rx="0.5" />
      <rect x="3" y="12" width="6" height="9" rx="0.5" />
      <rect x="15" y="10" width="6" height="11" rx="0.5" />
      <path d="M12 4l1.4 2.8 3 .4-2.2 2.2.5 3-2.7-1.4-2.7 1.4.5-3-2.2-2.2 3-.4z" />
    </svg>
  );
}

function GiftIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="9" width="18" height="11" rx="0.5" />
      <path d="M3 13h18" />
      <path d="M12 9v11" />
      <path d="M8 9c-1.5 0-3-1-3-2.5S6 4 8 5.5 12 9 12 9" />
      <path d="M16 9c1.5 0 3-1 3-2.5S18 4 16 5.5 12 9 12 9" />
    </svg>
  );
}
