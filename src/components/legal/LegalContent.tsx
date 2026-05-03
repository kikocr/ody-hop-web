import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";

type LegalSection = {
  id: string;
  title: string;
  intro?: string;
  body?: string;
  items?: string[];
};

type Props = {
  namespace: "privacy" | "terms";
};

export function LegalContent({ namespace }: Props) {
  const t = useTranslations(namespace);
  const sections = t.raw("sections") as LegalSection[];

  return (
    <>
      <section
        id="top"
        aria-label={`${t("title")} hero`}
        className="relative isolate flex h-[200px] items-center justify-center overflow-hidden border-b border-glass-border"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean-light via-ocean to-ocean"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(242,169,0,0.18),transparent_55%)]"
        />
        <div className="relative px-4 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl">
            {t("title")}
          </h1>
          <p className="mt-2 font-body text-sm text-warmgray sm:text-base">
            {t("lastUpdatedLabel")}: {t("lastUpdated")}
          </p>
        </div>
      </section>

      <section
        aria-label={t("title")}
        className="bg-ocean py-16 sm:py-20"
      >
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
          <GlassCard className="px-6 py-8 sm:px-10 sm:py-12">
            <p className="font-body text-base text-warmgray sm:text-lg">
              {t("intro1")}
            </p>
            <p className="mt-4 font-body text-base text-warmgray sm:text-lg">
              {t("intro2")}
            </p>

            <nav
              aria-label={t("tocTitle")}
              className="mt-10 rounded-card border border-glass-border bg-glass-bg p-5"
            >
              <h2 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-amber">
                {t("tocTitle")}
              </h2>
              <ol className="mt-4 flex flex-col gap-2">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="font-body text-sm text-white transition-colors hover:text-amber"
                    >
                      <span className="mr-2 font-display font-semibold text-amber">
                        {String(i + 1).padStart(2, "0")}.
                      </span>
                      {s.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-12 flex flex-col gap-12">
              {sections.map((s) => (
                <SectionBlock key={s.id} section={s} />
              ))}
            </div>

            <div className="mt-12 flex justify-center border-t border-glass-border pt-8">
              <a
                href="#top"
                className="inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-[0.18em] text-amber transition-colors hover:text-white"
              >
                <span aria-hidden>↑</span>
                {t("backToTop")}
              </a>
            </div>
          </GlassCard>
        </div>
      </section>
    </>
  );
}

function SectionBlock({ section }: { section: LegalSection }) {
  return (
    <section aria-labelledby={`heading-${section.id}`}>
      <h2
        id={section.id}
        className="scroll-mt-24 font-display text-2xl font-bold text-amber sm:text-3xl"
      >
        {section.title}
      </h2>
      <span
        aria-hidden
        className="mt-2 block h-[3px] w-10 rounded-card bg-amber"
      />

      {section.intro ? (
        <p className="mt-5 font-body text-base text-white sm:text-lg">
          {section.intro}
        </p>
      ) : null}

      {section.items && section.items.length > 0 ? (
        <ul className="mt-5 flex flex-col gap-3">
          {section.items.map((item, i) => (
            <li
              key={i}
              className="flex gap-3 font-body text-base text-warmgray sm:text-lg"
            >
              <span
                aria-hidden
                className="mt-2 inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-amber"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {section.body ? (
        <p className="mt-5 font-body text-base text-warmgray sm:text-lg">
          {section.body}
        </p>
      ) : null}
    </section>
  );
}
