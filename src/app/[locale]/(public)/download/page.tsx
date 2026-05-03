import Image from "next/image";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { AppStoreBadges } from "@/components/home/AppStoreBadges";

type PageProps = { params: Promise<{ locale: string }> };

export default async function DownloadPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DownloadContent />;
}

function DownloadContent() {
  const t = useTranslations("download");

  return (
    <section
      aria-label="Download Ody Hop"
      className="relative isolate flex min-h-[calc(100vh-5rem)] w-full items-center overflow-hidden py-16 sm:py-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean via-ocean to-ocean-light"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_30%,rgba(242,169,0,0.18),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(18,58,111,0.6),transparent_55%)]"
      />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10 lg:px-8">
        <div className="flex flex-col gap-7 text-center lg:col-span-7 lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <div className="relative aspect-square w-[180px] sm:w-[220px] lg:w-[260px]">
              <div
                aria-hidden
                className="absolute inset-x-6 bottom-2 h-4 rounded-[50%] bg-amber/20 blur-2xl"
              />
              <div className="relative h-full w-full animate-float">
                <Image
                  src="/assets/branding/ody-explorer.png"
                  alt="Ody, the otter explorer"
                  fill
                  priority
                  sizes="(max-width: 640px) 180px, (max-width: 1024px) 220px, 260px"
                  className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.55)]"
                />
              </div>
            </div>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="max-w-xl font-body text-base text-warmgray sm:text-lg">
            {t("subtitle")}
          </p>

          <div>
            <AppStoreBadges className="justify-center lg:justify-start" />
          </div>

          <div className="mt-2 flex items-start gap-5 justify-center lg:justify-start">
            <QrPlaceholder />
            <div className="max-w-[180px] text-left">
              <p className="font-display text-base font-semibold text-white">
                {t("scanQr")}
              </p>
              <p className="mt-1 font-body text-xs text-warmgray">
                {t("qrCaption")}
              </p>
            </div>
          </div>

          <p className="font-body text-xs text-warmgray">{t("freeNote")}</p>
        </div>

        <div className="flex justify-center lg:col-span-5 lg:justify-end">
          <PhoneMockup label={t("previewLabel")} />
        </div>
      </div>
    </section>
  );
}

function PhoneMockup({ label }: { label: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className="relative w-[260px] sm:w-[300px]"
    >
      <div
        aria-hidden
        className="absolute -inset-6 -z-10 rounded-[3rem] bg-amber/10 blur-3xl"
      />
      <div className="relative aspect-[9/19] overflow-hidden rounded-[2.4rem] border-[10px] border-[#111827] bg-ocean shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)]">
        <div
          aria-hidden
          className="absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-[#111827]"
        />
        <Image
          src="/assets/splash.png"
          alt=""
          fill
          sizes="(max-width: 640px) 260px, 300px"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-2 flex justify-center"
        >
          <span className="h-1 w-24 rounded-full bg-white/70" />
        </div>
      </div>
    </div>
  );
}

function QrPlaceholder() {
  // 21x21 grid mimicking a QR code visually. Three finder patterns in the
  // top-left, top-right, and bottom-left corners; scattered modules elsewhere.
  // Decorative only — not a real QR.
  const dataModules = [
    [9, 4], [10, 5], [11, 6], [12, 4], [13, 5], [14, 7],
    [9, 9], [10, 10], [11, 11], [12, 12], [13, 13],
    [4, 14], [5, 15], [6, 16], [7, 14], [8, 15],
    [10, 16], [11, 17], [13, 16], [14, 17], [15, 15],
    [16, 9], [17, 10], [18, 11], [16, 12], [17, 13],
    [9, 18], [10, 19], [12, 18], [13, 19], [14, 18],
    [4, 9], [5, 10], [6, 11], [4, 12], [5, 13],
    [16, 4], [17, 5], [18, 6], [16, 7], [17, 8],
  ];

  return (
    <div className="rounded-card border border-glass-border bg-white p-2 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]">
      <svg
        viewBox="0 0 21 21"
        width="100"
        height="100"
        shapeRendering="crispEdges"
        aria-hidden
        className="block"
      >
        <FinderPattern x={0} y={0} />
        <FinderPattern x={14} y={0} />
        <FinderPattern x={0} y={14} />
        {dataModules.map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="1" height="1" fill="#0b1f3a" />
        ))}
        {/* alignment-style block */}
        <rect x={13} y={13} width="3" height="3" fill="#0b1f3a" />
        <rect x={14} y={14} width="1" height="1" fill="#ffffff" />
      </svg>
    </div>
  );
}

function FinderPattern({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width="7" height="7" fill="#0b1f3a" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#ffffff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#0b1f3a" />
    </g>
  );
}
