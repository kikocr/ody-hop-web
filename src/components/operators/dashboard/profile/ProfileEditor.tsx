"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { createClient } from "@/lib/supabase/client";
import { DESTINATIONS, type DestinationSlug } from "@/lib/constants";
import {
  PillGroup,
  TextInput,
  Textarea,
} from "@/components/operators/apply/form-controls";
import type { FullProfile } from "@/lib/dashboard-mock";

const SPECIALTY_KEYS = [
  "hiking",
  "diving",
  "cultural",
  "wildlife",
  "photography",
  "food",
  "adventure",
  "surfing",
  "fishing",
  "other",
] as const;

const LANGUAGE_KEYS = [
  "english",
  "spanish",
  "french",
  "portuguese",
  "thai",
  "arabic",
  "icelandic",
  "other",
] as const;

const STORAGE_BUCKET = "guides";
const MAX_BIO = 1000;

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "OP";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

type Props = {
  initial: FullProfile;
  isMock: boolean;
};

export function ProfileEditor({ initial, isMock }: Props) {
  const t = useTranslations("profile");
  const tApply = useTranslations("apply");
  const [supabase] = useState(() => createClient());
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [businessName, setBusinessName] = useState(initial.business_name);
  const [bio, setBio] = useState(initial.bio);
  const [photoUrl, setPhotoUrl] = useState<string | null>(initial.photo_url);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [contactEmail, setContactEmail] = useState(initial.contact_email);
  const [phone, setPhone] = useState(initial.phone);
  const [destinations, setDestinations] = useState<DestinationSlug[]>([
    ...initial.destinations,
  ]);
  const [regions, setRegions] = useState<
    Partial<Record<DestinationSlug, string>>
  >({ ...initial.regions });
  const [languages, setLanguages] = useState<string[]>([...initial.languages]);
  const [specialties, setSpecialties] = useState<string[]>([
    ...initial.specialties,
  ]);
  const [certifications, setCertifications] = useState(initial.certifications);
  const [website, setWebsite] = useState(initial.website);
  const [instagram, setInstagram] = useState(initial.social_instagram);
  const [facebook, setFacebook] = useState(initial.social_facebook);
  const [tripadvisor, setTripadvisor] = useState(initial.social_tripadvisor);

  const [saving, setSaving] = useState(false);
  const [banner, setBanner] = useState<
    | { kind: "success"; message: string }
    | { kind: "error"; message: string }
    | null
  >(null);
  const [dragOver, setDragOver] = useState(false);

  const specialtyOptions = useMemo(
    () =>
      SPECIALTY_KEYS.map((id) => ({
        id,
        label: tApply(`specialty.${id}` as const),
      })),
    [tApply]
  );

  const languageOptions = useMemo(
    () =>
      LANGUAGE_KEYS.map((id) => ({
        id,
        label: tApply(`language.${id}` as const),
      })),
    [tApply]
  );

  const initials = useMemo(() => deriveInitials(businessName), [businessName]);

  function toggleDestination(slug: DestinationSlug) {
    setDestinations((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
    setRegions((prev) => {
      if (prev[slug] !== undefined && destinations.includes(slug)) {
        const next = { ...prev };
        delete next[slug];
        return next;
      }
      return prev;
    });
  }

  function setRegion(slug: DestinationSlug, value: string) {
    setRegions((prev) => ({ ...prev, [slug]: value }));
  }

  async function uploadPhoto(file: File) {
    setPhotoError(null);
    setPhotoUploading(true);
    try {
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const path = `${initial.id}/profile-${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error || !data) throw error ?? new Error("Upload failed");
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);
      setPhotoUrl(urlData.publicUrl);
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("uploadFail");
      setPhotoError(msg || t("uploadFail"));
    } finally {
      setPhotoUploading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadPhoto(file);
    e.target.value = "";
  }
  function handleFileDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void uploadPhoto(file);
  }

  async function handleSave() {
    setSaving(true);
    setBanner(null);
    const payload = {
      business_name: businessName,
      bio,
      photo_url: photoUrl,
      contact_email: contactEmail,
      phone,
      destinations,
      languages,
      specialties,
      certifications,
      website: website || null,
      social_links: {
        instagram,
        facebook,
        tripadvisor,
      },
      regions,
    };

    if (isMock) {
      await new Promise((res) => setTimeout(res, 250));
      setBanner({ kind: "success", message: t("saveSuccess") });
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("guides")
        .update(payload)
        .eq("id", initial.id);
      if (error) throw error;
      setBanner({ kind: "success", message: t("saveSuccess") });
    } catch {
      setBanner({ kind: "error", message: t("saveFailed") });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 font-body text-sm text-warmgray">
            {t("subtitle")}
          </p>
        </div>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? t("saving") : t("save")}
        </Button>
      </header>

      {banner ? (
        <div
          role={banner.kind === "error" ? "alert" : "status"}
          className={cn(
            "rounded-card border px-4 py-2.5 font-body text-sm",
            banner.kind === "success"
              ? "border-success/50 bg-success/10 text-success"
              : "border-alert/50 bg-alert/10 text-alert"
          )}
        >
          {banner.message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-5 lg:col-span-2">
          <GlassCard className="flex flex-col gap-5">
            <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em] text-amber">
              {t("photoLabel")}
            </h2>
            <PhotoDropzone
              photoUrl={photoUrl}
              uploading={photoUploading}
              error={photoError}
              dragOver={dragOver}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleFileDrop}
              onPick={() => fileInputRef.current?.click()}
              onRemove={() => setPhotoUrl(null)}
              labels={{
                drop: t("uploadDrop"),
                uploading: t("uploading"),
                replace: t("replace"),
                remove: t("remove"),
                helper: t("photoHelper"),
              }}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </GlassCard>

          <GlassCard className="flex flex-col gap-4">
            <TextInput
              label={t("businessNameLabel")}
              value={businessName}
              onChange={setBusinessName}
              placeholder={t("businessNamePlaceholder")}
            />
            <Textarea
              label={t("bioLabel")}
              value={bio}
              onChange={setBio}
              placeholder={t("bioPlaceholder")}
              helper={t("bioHelper")}
              rows={5}
              maxLength={MAX_BIO}
            />
          </GlassCard>

          <GlassCard className="flex flex-col gap-4">
            <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em] text-amber">
              {t("emailLabel")} · {t("phoneLabel")}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput
                type="email"
                inputMode="email"
                label={t("emailLabel")}
                value={contactEmail}
                onChange={setContactEmail}
                placeholder={t("emailPlaceholder")}
              />
              <TextInput
                type="tel"
                inputMode="tel"
                label={t("phoneLabel")}
                value={phone}
                onChange={setPhone}
                placeholder={t("phonePlaceholder")}
              />
            </div>
            <TextInput
              type="url"
              inputMode="url"
              label={t("websiteLabel")}
              optional={t("optional")}
              value={website}
              onChange={setWebsite}
              placeholder={t("websitePlaceholder")}
            />
          </GlassCard>

          <GlassCard className="flex flex-col gap-4">
            <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em] text-amber">
              {t("destinationsLabel")}
            </h2>
            <p className="font-body text-xs text-warmgray">
              {t("destinationsHelper")}
            </p>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DESTINATIONS.map((d) => {
                const isSelected = destinations.includes(d.slug);
                return (
                  <li key={d.slug}>
                    <button
                      type="button"
                      onClick={() => toggleDestination(d.slug)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex w-full items-center justify-between gap-2 rounded-card border px-3 py-2 text-left font-body text-sm transition-colors",
                        isSelected
                          ? "border-amber bg-amber-soft text-amber"
                          : "border-glass-border bg-glass-bg text-warmgray hover:border-amber/40 hover:text-white"
                      )}
                    >
                      <span className="min-w-0 truncate">
                        <span aria-hidden className="mr-1.5">
                          {d.flag}
                        </span>
                        {d.brandName}
                      </span>
                      {isSelected ? (
                        <span aria-hidden className="text-amber">
                          ✓
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>

            {destinations.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {destinations.map((slug) => {
                  const dest = DESTINATIONS.find((d) => d.slug === slug);
                  if (!dest) return null;
                  return (
                    <label key={slug} className="flex flex-col gap-1">
                      <span className="font-body text-xs font-semibold uppercase tracking-wider text-amber">
                        <span aria-hidden className="mr-1">
                          {dest.flag}
                        </span>
                        {dest.country}
                      </span>
                      <input
                        type="text"
                        value={regions[slug] ?? ""}
                        onChange={(e) => setRegion(slug, e.target.value)}
                        placeholder={t("regionsPlaceholder")}
                        className="w-full rounded-card border border-glass-border bg-ocean-light/60 px-3 py-2 font-body text-sm text-white placeholder:text-warmgray/60 focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
                      />
                    </label>
                  );
                })}
              </div>
            ) : null}
          </GlassCard>

          <GlassCard className="flex flex-col gap-5">
            <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em] text-amber">
              {t("specialtiesLabel")}
            </h2>
            <PillGroup
              options={specialtyOptions}
              selected={specialties}
              onToggle={(id) =>
                setSpecialties((prev) =>
                  prev.includes(id)
                    ? prev.filter((s) => s !== id)
                    : [...prev, id]
                )
              }
            />

            <div className="border-t border-glass-border pt-5">
              <h3 className="font-body text-sm font-semibold text-white">
                {t("languagesLabel")}
              </h3>
              <div className="mt-2">
                <PillGroup
                  options={languageOptions}
                  selected={languages}
                  onToggle={(id) =>
                    setLanguages((prev) =>
                      prev.includes(id)
                        ? prev.filter((s) => s !== id)
                        : [...prev, id]
                    )
                  }
                />
              </div>
            </div>

            <div className="border-t border-glass-border pt-5">
              <Textarea
                label={t("certificationsLabel")}
                value={certifications}
                onChange={setCertifications}
                placeholder={t("certificationsPlaceholder")}
                rows={3}
              />
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col gap-4">
            <h2 className="font-display text-base font-semibold uppercase tracking-[0.18em] text-amber">
              {t("socialsLabel")}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <TextInput
                label={t("instagramLabel")}
                value={instagram}
                onChange={setInstagram}
                placeholder="@yourhandle"
                optional={t("optional")}
              />
              <TextInput
                label={t("facebookLabel")}
                value={facebook}
                onChange={setFacebook}
                placeholder="facebook.com/yourpage"
                optional={t("optional")}
              />
              <TextInput
                label={t("tripadvisorLabel")}
                value={tripadvisor}
                onChange={setTripadvisor}
                placeholder="tripadvisor.com/yourbiz"
                optional={t("optional")}
              />
            </div>
          </GlassCard>

          <div className="flex justify-end">
            <Button variant="primary" onClick={handleSave} disabled={saving}>
              {saving ? t("saving") : t("save")}
            </Button>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.18em] text-warmgray">
              {t("previewTitle")}
            </p>
            <p className="mb-4 font-body text-xs italic text-warmgray">
              {t("previewHint")}
            </p>
            <GuideCardPreview
              businessName={businessName || initial.business_name}
              bio={bio}
              photoUrl={photoUrl}
              initials={initials}
              rating={initial.rating}
              reviewCount={initial.review_count}
              isFeatured={initial.is_featured}
              specialties={specialties}
              specialtyLabel={(id) => tApply(`specialty.${id}` as const)}
              languages={languages}
              languageLabel={(id) => tApply(`language.${id}` as const)}
              localPickLabel={t("localPick")}
              bookCta={t("previewBookCta")}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Photo dropzone ---------------- */

function PhotoDropzone({
  photoUrl,
  uploading,
  error,
  dragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  onPick,
  onRemove,
  labels,
}: {
  photoUrl: string | null;
  uploading: boolean;
  error: string | null;
  dragOver: boolean;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onPick: () => void;
  onRemove: () => void;
  labels: {
    drop: string;
    uploading: string;
    replace: string;
    remove: string;
    helper: string;
  };
}) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-body text-xs text-warmgray">{labels.helper}</p>
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "flex min-h-[160px] items-center justify-center overflow-hidden rounded-card border-2 border-dashed bg-ocean-light/40 p-4 transition-colors",
          dragOver ? "border-amber bg-amber-soft" : "border-glass-border"
        )}
      >
        {uploading ? (
          <p className="font-body text-sm text-amber">{labels.uploading}</p>
        ) : photoUrl ? (
          <div className="flex items-center gap-4">
            <span className="relative h-20 w-20 overflow-hidden rounded-card border border-glass-border bg-ocean-dark">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </span>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={onPick}
                className="rounded-card border border-glass-border bg-glass-bg px-3 py-1 font-body text-xs font-semibold text-amber transition-colors hover:bg-amber-soft"
              >
                {labels.replace}
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="rounded-card border border-alert/40 px-3 py-1 font-body text-xs font-semibold text-alert transition-colors hover:bg-alert/10"
              >
                {labels.remove}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={onPick}
            className="flex flex-col items-center gap-2 font-body text-sm text-warmgray transition-colors hover:text-amber"
          >
            <UploadIcon />
            <span>{labels.drop}</span>
          </button>
        )}
      </div>
      {error ? (
        <p className="font-body text-xs text-alert">{error}</p>
      ) : null}
    </div>
  );
}

/* ---------------- Live preview ---------------- */

function GuideCardPreview({
  businessName,
  bio,
  photoUrl,
  initials,
  rating,
  reviewCount,
  isFeatured,
  specialties,
  specialtyLabel,
  languages,
  languageLabel,
  localPickLabel,
  bookCta,
}: {
  businessName: string;
  bio: string;
  photoUrl: string | null;
  initials: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  specialties: string[];
  specialtyLabel: (id: string) => string;
  languages: string[];
  languageLabel: (id: string) => string;
  localPickLabel: string;
  bookCta: string;
}) {
  const truncatedBio =
    bio.length > 180 ? bio.slice(0, 180).trimEnd() + "…" : bio;

  return (
    <GlassCard className="flex flex-col gap-4">
      <div className="flex items-start gap-4">
        {photoUrl ? (
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-amber/30 bg-ocean-dark">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </span>
        ) : (
          <span
            aria-hidden
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-amber/30 bg-amber-soft font-display text-lg font-bold text-amber"
          >
            {initials}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-semibold text-white">
            {businessName || "—"}
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <PreviewStars rating={Math.round(rating)} />
            <span className="font-body text-xs font-semibold text-warmgray">
              {rating.toFixed(1)}
            </span>
            <span className="font-body text-xs text-warmgray">
              ({reviewCount})
            </span>
          </div>
          {isFeatured ? (
            <span className="mt-1.5 inline-flex items-center gap-1 rounded-card bg-amber px-2 py-0.5 font-body text-[10px] font-bold uppercase tracking-wider text-ocean">
              ★ {localPickLabel}
            </span>
          ) : null}
        </div>
      </div>

      {truncatedBio ? (
        <p className="font-body text-sm text-warmgray">{truncatedBio}</p>
      ) : null}

      {specialties.length > 0 ? (
        <ul className="flex flex-wrap gap-1.5">
          {specialties.slice(0, 4).map((id) => (
            <li
              key={id}
              className="inline-flex items-center rounded-card border border-glass-border bg-glass-bg px-2 py-0.5 font-body text-xs text-warmgray"
            >
              {specialtyLabel(id)}
            </li>
          ))}
        </ul>
      ) : null}

      {languages.length > 0 ? (
        <p className="font-body text-xs text-warmgray">
          <span aria-hidden className="mr-1">🌐</span>
          {languages.map(languageLabel).join(" · ")}
        </p>
      ) : null}

      <button
        type="button"
        disabled
        className="mt-2 inline-flex w-full items-center justify-center rounded-card bg-amber px-4 py-2.5 font-body text-sm font-bold text-ocean opacity-90"
      >
        {bookCta}
      </button>
    </GlassCard>
  );
}

function PreviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i < rating ? "var(--color-amber)" : "none"}
          stroke="var(--color-amber)"
          strokeWidth="1.6"
        >
          <path d="M12 2.5l2.95 6.59 7.05.77-5.3 4.94 1.5 7.2L12 18.4l-6.2 3.6 1.5-7.2L2 9.86l7.05-.77z" />
        </svg>
      ))}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 5v12" />
      <path d="M6 11l6-6 6 6" />
      <path d="M5 19h14" />
    </svg>
  );
}

