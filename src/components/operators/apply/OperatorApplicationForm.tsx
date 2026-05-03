"use client";

import Image from "next/image";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createClient } from "@/lib/supabase/client";
import { DESTINATIONS, type DestinationSlug } from "@/lib/constants";
import { StepIndicator } from "./StepIndicator";
import {
  Checkbox,
  FieldShell,
  PillGroup,
  Textarea,
  TextInput,
  cn,
} from "./form-controls";

const TOTAL_STEPS = 5;

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

const COUNTRY_CODES = [
  { code: "+1", flag: "🇺🇸" },
  { code: "+506", flag: "🇨🇷" },
  { code: "+51", flag: "🇵🇪" },
  { code: "+52", flag: "🇲🇽" },
  { code: "+34", flag: "🇪🇸" },
  { code: "+44", flag: "🇬🇧" },
  { code: "+33", flag: "🇫🇷" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+66", flag: "🇹🇭" },
  { code: "+966", flag: "🇸🇦" },
  { code: "+354", flag: "🇮🇸" },
  { code: "+55", flag: "🇧🇷" },
  { code: "+57", flag: "🇨🇴" },
];

const MAX_ACTION_PHOTOS = 5;
const MAX_DESCRIPTION = 500;
const STORAGE_BUCKET = "operator-applications";

type FormState = {
  // Step 1
  businessName: string;
  contactName: string;
  yearsExperience: string;
  specialties: string[];
  description: string;
  // Step 2
  destinations: DestinationSlug[];
  regions: Partial<Record<DestinationSlug, string>>;
  languages: string[];
  // Step 3
  email: string;
  phoneCountry: string;
  phoneNumber: string;
  website: string;
  socialInstagram: string;
  socialFacebook: string;
  socialTripadvisor: string;
  // Step 4
  profilePhotoUrl: string | null;
  actionPhotoUrls: string[];
  // Step 5
  termsAgreed: boolean;
};

const INITIAL_STATE: FormState = {
  businessName: "",
  contactName: "",
  yearsExperience: "",
  specialties: [],
  description: "",
  destinations: [],
  regions: {},
  languages: [],
  email: "",
  phoneCountry: "+1",
  phoneNumber: "",
  website: "",
  socialInstagram: "",
  socialFacebook: "",
  socialTripadvisor: "",
  profilePhotoUrl: null,
  actionPhotoUrls: [],
  termsAgreed: false,
};

type ErrorMap = Partial<Record<string, string>>;

type Translator = ReturnType<typeof useTranslations>;

export function OperatorApplicationForm() {
  const t = useTranslations("apply");
  const tc = useTranslations("common");

  const [supabase] = useState(() => createClient());
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2)
  );

  const [step, setStep] = useState<number>(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    },
    []
  );

  const stepLabels: ReadonlyArray<string> = useMemo(
    () => [t("step1"), t("step2"), t("step3"), t("step4"), t("step5")],
    [t]
  );

  const validateStep = useCallback(
    (target: number): boolean => {
      const next: ErrorMap = {};
      if (target === 1) {
        if (!form.businessName.trim()) next.businessName = t("required");
        if (!form.contactName.trim()) next.contactName = t("required");
        if (form.specialties.length === 0) next.specialties = t("required");
      }
      if (target === 2) {
        if (form.destinations.length === 0) next.destinations = t("required");
        if (form.languages.length === 0) next.languages = t("required");
      }
      if (target === 3) {
        if (!form.email.trim()) next.email = t("required");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
          next.email = t("invalidEmail");
        if (!form.phoneNumber.trim()) next.phoneNumber = t("required");
        if (form.website.trim() && !/^https?:\/\//.test(form.website))
          next.website = t("invalidUrl");
      }
      if (target === 4) {
        if (!form.profilePhotoUrl) next.profilePhotoUrl = t("required");
      }
      if (target === 5) {
        if (!form.termsAgreed) next.termsAgreed = t("termsRequired");
      }
      setErrors(next);
      return Object.keys(next).length === 0;
    },
    [form, t]
  );

  const handleNext = () => {
    if (validateStep(step) && step < TOTAL_STEPS) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const jumpTo = (target: number) => {
    if (target >= 1 && target <= TOTAL_STEPS) {
      setStep(target);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const uploadPhoto = useCallback(
    async (file: File, prefix: string): Promise<string> => {
      const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase();
      const path = `${sessionId}/${prefix}-${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error || !data) throw error ?? new Error("Upload failed");
      const { data: urlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(data.path);
      return urlData.publicUrl;
    },
    [supabase, sessionId]
  );

  const handleSubmit = async () => {
    if (!validateStep(5)) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const phone = `${form.phoneCountry} ${form.phoneNumber}`.trim();
      const socialLinks: Record<string, string> = {};
      if (form.socialInstagram) socialLinks.instagram = form.socialInstagram;
      if (form.socialFacebook) socialLinks.facebook = form.socialFacebook;
      if (form.socialTripadvisor)
        socialLinks.tripadvisor = form.socialTripadvisor;

      const photoUrls: string[] = [];
      if (form.profilePhotoUrl) photoUrls.push(form.profilePhotoUrl);
      photoUrls.push(...form.actionPhotoUrls);

      const { error } = await supabase
        .from("operator_applications")
        .insert({
          business_name: form.businessName,
          contact_name: form.contactName,
          email: form.email,
          phone,
          destinations: form.destinations,
          specialties: form.specialties,
          years_experience: parseInt(form.yearsExperience, 10) || 0,
          website: form.website || null,
          social_links: socialLinks,
          photo_urls: photoUrls,
          status: "pending",
          description: form.description || null,
          regions: form.regions,
          languages: form.languages,
        });
      if (error) throw error;
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const message =
        err instanceof Error && err.message ? err.message : t("submitFailed");
      setSubmitError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <SuccessScreen t={t} />;
  }

  return (
    <section
      aria-label="Operator application"
      className="relative isolate overflow-hidden py-12 sm:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean-light/40 via-ocean to-ocean"
      />
      <div className="relative mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 font-body text-sm text-warmgray sm:text-base">
            {t("subtitle")}
          </p>
        </header>

        <StepIndicator
          current={step}
          total={TOTAL_STEPS}
          labels={stepLabels}
          onJump={jumpTo}
        />

        <GlassCard className="mt-8">
          {step === 1 ? (
            <Step1
              t={t}
              form={form}
              update={update}
              errors={errors}
            />
          ) : null}
          {step === 2 ? (
            <Step2 t={t} form={form} update={update} errors={errors} />
          ) : null}
          {step === 3 ? (
            <Step3 t={t} form={form} update={update} errors={errors} />
          ) : null}
          {step === 4 ? (
            <Step4
              t={t}
              form={form}
              update={update}
              errors={errors}
              uploadPhoto={uploadPhoto}
            />
          ) : null}
          {step === 5 ? (
            <Step5
              t={t}
              tc={tc}
              form={form}
              update={update}
              errors={errors}
              jumpTo={jumpTo}
              submitting={submitting}
              submitError={submitError}
              onSubmit={handleSubmit}
            />
          ) : null}

          <div className="mt-8 flex items-center justify-between border-t border-glass-border pt-6">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
            >
              ← {t("back")}
            </Button>
            {step < TOTAL_STEPS ? (
              <Button variant="primary" onClick={handleNext}>
                {t("next")} →
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? t("submitting") : t("submitCta")}
              </Button>
            )}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

/* ---------------- Steps ---------------- */

type StepProps = {
  t: Translator;
  form: FormState;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  errors: ErrorMap;
};

function Step1({ t, form, update, errors }: StepProps) {
  const businessNameId = useId();
  const contactNameId = useId();
  const yearsId = useId();
  const descriptionId = useId();

  const specialtyOptions = SPECIALTY_KEYS.map((id) => ({
    id,
    label: t(`specialty.${id}` as const),
  }));

  const toggleSpecialty = (id: string) => {
    const next = form.specialties.includes(id)
      ? form.specialties.filter((s) => s !== id)
      : [...form.specialties, id];
    update("specialties", next);
  };

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title={t("step1")} accent={false} />

      <TextInput
        id={businessNameId}
        label={t("businessNameLabel")}
        value={form.businessName}
        onChange={(v) => update("businessName", v)}
        placeholder={t("businessNamePlaceholder")}
        required
        error={errors.businessName}
      />
      <TextInput
        id={contactNameId}
        label={t("contactNameLabel")}
        value={form.contactName}
        onChange={(v) => update("contactName", v)}
        placeholder={t("contactNamePlaceholder")}
        required
        error={errors.contactName}
      />
      <TextInput
        id={yearsId}
        type="number"
        inputMode="numeric"
        min={0}
        label={t("yearsLabel")}
        value={form.yearsExperience}
        onChange={(v) => update("yearsExperience", v.replace(/[^0-9]/g, ""))}
        placeholder={t("yearsPlaceholder")}
        error={errors.yearsExperience}
      />

      <PillGroup
        label={t("specialtiesLabel")}
        helper={t("specialtiesHelper")}
        options={specialtyOptions}
        selected={form.specialties}
        onToggle={toggleSpecialty}
        error={errors.specialties}
      />

      <Textarea
        id={descriptionId}
        label={t("descriptionLabel")}
        value={form.description}
        onChange={(v) => update("description", v)}
        placeholder={t("descriptionPlaceholder")}
        helper={t("descriptionHelper")}
        maxLength={MAX_DESCRIPTION}
        charsLeftLabel={(n) => t("charsLeft", { n })}
      />
    </div>
  );
}

function Step2({ t, form, update, errors }: StepProps) {
  const toggleDestination = (slug: DestinationSlug) => {
    const isSelected = form.destinations.includes(slug);
    if (isSelected) {
      update(
        "destinations",
        form.destinations.filter((d) => d !== slug)
      );
      const nextRegions = { ...form.regions };
      delete nextRegions[slug];
      update("regions", nextRegions);
    } else {
      update("destinations", [...form.destinations, slug]);
    }
  };

  const setRegion = (slug: DestinationSlug, value: string) => {
    update("regions", { ...form.regions, [slug]: value });
  };

  const toggleLanguage = (id: string) => {
    const next = form.languages.includes(id)
      ? form.languages.filter((l) => l !== id)
      : [...form.languages, id];
    update("languages", next);
  };

  const languageOptions = LANGUAGE_KEYS.map((id) => ({
    id,
    label: t(`language.${id}` as const),
  }));

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title={t("step2")} accent={false} />

      <fieldset className="flex flex-col gap-2">
        <legend className="font-body text-sm font-semibold text-white">
          {t("destinationsLabel")}
        </legend>
        <span className="font-body text-xs text-warmgray">
          {t("destinationsHelper")}
        </span>
        <ul className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DESTINATIONS.map((dest) => {
            const isSelected = form.destinations.includes(dest.slug);
            return (
              <li key={dest.id}>
                <button
                  type="button"
                  onClick={() => toggleDestination(dest.slug)}
                  aria-pressed={isSelected}
                  className={cn(
                    "group relative flex h-[120px] w-full items-end overflow-hidden rounded-card border-2 text-left transition-all",
                    isSelected
                      ? "border-amber shadow-[0_8px_24px_-12px_rgba(242,169,0,0.6)]"
                      : "border-glass-border hover:border-amber/40"
                  )}
                >
                  <Image
                    src={dest.heroImage}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 320px"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className={cn(
                      "absolute inset-0 transition-opacity",
                      isSelected
                        ? "bg-gradient-to-t from-ocean-dark/95 to-amber/15"
                        : "bg-gradient-to-t from-ocean-dark/85 via-ocean-dark/40 to-transparent"
                    )}
                  />
                  <div className="relative flex w-full items-center justify-between gap-3 p-3">
                    <div>
                      <p className="font-body text-[10px] font-semibold uppercase tracking-widest text-warmgray">
                        <span aria-hidden className="mr-1">
                          {dest.flag}
                        </span>
                        {dest.country}
                      </p>
                      <p className="font-display text-base font-bold text-white">
                        {dest.brandName}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "flex h-7 w-7 items-center justify-center rounded-card border transition-colors",
                        isSelected
                          ? "border-amber bg-amber text-ocean"
                          : "border-glass-border bg-glass-bg text-transparent"
                      )}
                      aria-hidden
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12l5 5 9-11" />
                      </svg>
                    </span>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
        {errors.destinations ? (
          <span className="mt-1 font-body text-xs text-alert">
            {errors.destinations}
          </span>
        ) : null}
      </fieldset>

      {form.destinations.length > 0 ? (
        <FieldShell
          label={t("regionsLabel")}
          helper={t("regionsPlaceholder")}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {form.destinations.map((slug) => {
              const dest = DESTINATIONS.find((d) => d.slug === slug);
              if (!dest) return null;
              return (
                <div key={slug} className="flex flex-col gap-1">
                  <span className="font-body text-xs font-semibold uppercase tracking-wider text-amber">
                    <span aria-hidden className="mr-1">
                      {dest.flag}
                    </span>
                    {dest.country}
                  </span>
                  <input
                    type="text"
                    value={form.regions[slug] ?? ""}
                    onChange={(e) => setRegion(slug, e.target.value)}
                    placeholder={t("regionsPlaceholder")}
                    className={cn(
                      "w-full rounded-card border border-glass-border bg-ocean-light/60 px-3 py-2 font-body text-sm text-white placeholder:text-warmgray/60 focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </FieldShell>
      ) : null}

      <PillGroup
        label={t("languagesLabel")}
        options={languageOptions}
        selected={form.languages}
        onToggle={toggleLanguage}
        error={errors.languages}
      />
    </div>
  );
}

function Step3({ t, form, update, errors }: StepProps) {
  const emailId = useId();
  const phoneId = useId();
  const websiteId = useId();
  const igId = useId();
  const fbId = useId();
  const taId = useId();

  return (
    <div className="flex flex-col gap-5">
      <SectionHeader title={t("step3")} accent={false} />

      <TextInput
        id={emailId}
        type="email"
        inputMode="email"
        label={t("emailLabel")}
        value={form.email}
        onChange={(v) => update("email", v)}
        placeholder={t("emailPlaceholder")}
        required
        error={errors.email}
      />

      <FieldShell
        label={t("phoneLabel")}
        htmlFor={phoneId}
        required
        error={errors.phoneNumber}
      >
        <div className="flex gap-2">
          <select
            value={form.phoneCountry}
            onChange={(e) => update("phoneCountry", e.target.value)}
            aria-label="Country code"
            className={cn(
              "rounded-card border border-glass-border bg-ocean-light/60 px-3 py-2.5 font-body text-base text-white focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber"
            )}
          >
            {COUNTRY_CODES.map((c, i) => (
              <option
                key={`${c.code}-${i}`}
                value={c.code}
                className="bg-ocean text-white"
              >
                {c.flag} {c.code}
              </option>
            ))}
          </select>
          <input
            id={phoneId}
            type="tel"
            inputMode="tel"
            value={form.phoneNumber}
            onChange={(e) => update("phoneNumber", e.target.value)}
            placeholder={t("phonePlaceholder")}
            className={cn(
              "w-full rounded-card border bg-ocean-light/60 px-4 py-2.5 font-body text-base text-white placeholder:text-warmgray/60 focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber",
              errors.phoneNumber
                ? "border-alert focus:ring-alert/60"
                : "border-glass-border"
            )}
          />
        </div>
      </FieldShell>

      <TextInput
        id={websiteId}
        type="url"
        inputMode="url"
        label={t("websiteLabel")}
        optional={t("optional")}
        value={form.website}
        onChange={(v) => update("website", v)}
        placeholder={t("websitePlaceholder")}
        error={errors.website}
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="font-body text-sm font-semibold text-white">
          Social
        </legend>
        <span className="font-body text-xs text-warmgray">
          {t("socialsHelper")}
        </span>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <TextInput
            id={igId}
            label={t("instagramLabel")}
            value={form.socialInstagram}
            onChange={(v) => update("socialInstagram", v)}
            placeholder="@yourhandle"
            optional={t("optional")}
          />
          <TextInput
            id={fbId}
            label={t("facebookLabel")}
            value={form.socialFacebook}
            onChange={(v) => update("socialFacebook", v)}
            placeholder="facebook.com/yourpage"
            optional={t("optional")}
          />
          <TextInput
            id={taId}
            label={t("tripadvisorLabel")}
            value={form.socialTripadvisor}
            onChange={(v) => update("socialTripadvisor", v)}
            placeholder="tripadvisor.com/yourbiz"
            optional={t("optional")}
          />
        </div>
      </fieldset>
    </div>
  );
}

function Step4({
  t,
  form,
  update,
  errors,
  uploadPhoto,
}: StepProps & {
  uploadPhoto: (file: File, prefix: string) => Promise<string>;
}) {
  const [profileUploading, setProfileUploading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [actionUploading, setActionUploading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleProfileFile = async (file: File) => {
    setProfileError(null);
    setProfileUploading(true);
    try {
      const url = await uploadPhoto(file, "profile");
      update("profilePhotoUrl", url);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : t("uploadFail"));
    } finally {
      setProfileUploading(false);
    }
  };

  const handleActionFiles = async (files: FileList) => {
    setActionError(null);
    const remaining = MAX_ACTION_PHOTOS - form.actionPhotoUrls.length;
    if (remaining <= 0) return;
    const toUpload = Array.from(files).slice(0, remaining);
    setActionUploading(true);
    try {
      const urls: string[] = [];
      for (const file of toUpload) {
        const url = await uploadPhoto(file, `action-${urls.length}`);
        urls.push(url);
      }
      update("actionPhotoUrls", [...form.actionPhotoUrls, ...urls]);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : t("uploadFail"));
    } finally {
      setActionUploading(false);
    }
  };

  const removeActionPhoto = (url: string) => {
    update(
      "actionPhotoUrls",
      form.actionPhotoUrls.filter((u) => u !== url)
    );
  };

  return (
    <div className="flex flex-col gap-7">
      <SectionHeader title={t("step4")} accent={false} />

      <FieldShell
        label={t("profileLabel")}
        helper={t("profileHelper")}
        required
        error={errors.profilePhotoUrl ?? profileError ?? undefined}
      >
        <SingleDropzone
          uploading={profileUploading}
          url={form.profilePhotoUrl}
          onSelect={handleProfileFile}
          onClear={() => update("profilePhotoUrl", null)}
          dropLabel={t("uploadDrop")}
          uploadingLabel={t("uploading")}
          removeLabel={t("remove")}
        />
      </FieldShell>

      <FieldShell
        label={t("actionLabel")}
        helper={t("actionHelper")}
        error={actionError ?? undefined}
      >
        <MultiDropzone
          uploading={actionUploading}
          urls={form.actionPhotoUrls}
          maxCount={MAX_ACTION_PHOTOS}
          onSelect={handleActionFiles}
          onRemove={removeActionPhoto}
          dropLabel={t("uploadDropMulti")}
          addMoreLabel={t("addMore")}
          uploadingLabel={t("uploading")}
          removeLabel={t("remove")}
        />
      </FieldShell>
    </div>
  );
}

function Step5({
  t,
  tc,
  form,
  update,
  errors,
  jumpTo,
  submitting,
  submitError,
  onSubmit,
}: StepProps & {
  tc: Translator;
  jumpTo: (target: number) => void;
  submitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
}) {
  const specialties = form.specialties
    .map((id) => t(`specialty.${id}` as const))
    .join(", ");
  const languages = form.languages
    .map((id) => t(`language.${id}` as const))
    .join(", ");
  const destinations = form.destinations
    .map((slug) => DESTINATIONS.find((d) => d.slug === slug)?.brandName)
    .filter(Boolean)
    .join(", ");

  const photoCount =
    (form.profilePhotoUrl ? 1 : 0) + form.actionPhotoUrls.length;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={t("reviewLabel")}
        subtitle={t("reviewHelper")}
        accent={false}
      />

      <ReviewSection
        title={t("businessSection")}
        onEdit={() => jumpTo(1)}
        editLabel={t("edit")}
        rows={[
          { label: t("businessNameLabel"), value: form.businessName },
          { label: t("contactNameLabel"), value: form.contactName },
          {
            label: t("yearsLabel"),
            value: form.yearsExperience || t("noneSelected"),
          },
          {
            label: t("specialtiesLabel"),
            value: specialties || t("noneSelected"),
          },
          {
            label: t("descriptionLabel"),
            value: form.description || "—",
          },
        ]}
      />

      <ReviewSection
        title={t("destinationsSection")}
        onEdit={() => jumpTo(2)}
        editLabel={t("edit")}
        rows={[
          {
            label: t("destinationsLabel"),
            value: destinations || t("noneSelected"),
          },
          {
            label: t("languagesLabel"),
            value: languages || t("noneSelected"),
          },
        ]}
      />

      <ReviewSection
        title={t("contactSection")}
        onEdit={() => jumpTo(3)}
        editLabel={t("edit")}
        rows={[
          { label: t("emailLabel"), value: form.email },
          {
            label: t("phoneLabel"),
            value: `${form.phoneCountry} ${form.phoneNumber}`.trim(),
          },
          { label: t("websiteLabel"), value: form.website || "—" },
        ]}
      />

      <ReviewSection
        title={t("photosSection")}
        onEdit={() => jumpTo(4)}
        editLabel={t("edit")}
        rows={[
          {
            label: t("profileLabel"),
            value: form.profilePhotoUrl ? "✓" : t("required"),
          },
          {
            label: t("actionLabel"),
            value: `${form.actionPhotoUrls.length}/${MAX_ACTION_PHOTOS}`,
          },
        ]}
        count={photoCount}
      />

      <Checkbox
        id="terms-agreed"
        checked={form.termsAgreed}
        onChange={(c) => update("termsAgreed", c)}
        label={t("termsLabel")}
        error={errors.termsAgreed}
      />

      {submitError ? (
        <div className="flex items-center justify-between rounded-card border border-alert/50 bg-alert/10 px-4 py-3">
          <p className="font-body text-sm text-alert">{submitError}</p>
          <Button
            variant="secondary"
            onClick={onSubmit}
            disabled={submitting}
          >
            {t("retry")}
          </Button>
        </div>
      ) : null}

      <p className="sr-only">{tc("applyNow")}</p>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  editLabel,
  rows,
  count,
}: {
  title: string;
  onEdit: () => void;
  editLabel: string;
  rows: Array<{ label: string; value: string }>;
  count?: number;
}) {
  return (
    <div className="rounded-card border border-glass-border bg-glass-bg p-4">
      <header className="flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-amber">
          {title}
          {typeof count === "number" ? (
            <span className="ml-2 font-body text-xs font-medium text-warmgray">
              ({count})
            </span>
          ) : null}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="font-body text-xs font-semibold uppercase tracking-wider text-amber hover:underline"
        >
          {editLabel}
        </button>
      </header>
      <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col">
            <dt className="font-body text-[10px] font-semibold uppercase tracking-wider text-warmgray">
              {row.label}
            </dt>
            <dd className="font-body text-sm text-white break-words">
              {row.value || "—"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* ---------------- Dropzones ---------------- */

function SingleDropzone({
  uploading,
  url,
  onSelect,
  onClear,
  dropLabel,
  uploadingLabel,
  removeLabel,
}: {
  uploading: boolean;
  url: string | null;
  onSelect: (file: File) => void;
  onClear: () => void;
  dropLabel: string;
  uploadingLabel: string;
  removeLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) onSelect(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        "relative flex min-h-[160px] items-center justify-center overflow-hidden rounded-card border-2 border-dashed bg-ocean-light/40 p-4 transition-colors",
        dragOver ? "border-amber bg-amber-soft" : "border-glass-border"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={handleChange}
      />

      {uploading ? (
        <p className="font-body text-sm text-amber">{uploadingLabel}</p>
      ) : url ? (
        <div className="flex w-full items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt=""
            className="h-20 w-20 shrink-0 rounded-card object-cover"
          />
          <div className="flex flex-col gap-2">
            <p className="font-body text-xs text-warmgray break-all">
              {url.split("/").pop()}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="rounded-card border border-glass-border bg-glass-bg px-3 py-1 font-body text-xs font-semibold text-amber transition-colors hover:bg-amber-soft"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={onClear}
                className="rounded-card border border-alert/40 px-3 py-1 font-body text-xs font-semibold text-alert transition-colors hover:bg-alert/10"
              >
                {removeLabel}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center gap-2 font-body text-sm text-warmgray transition-colors hover:text-amber"
        >
          <UploadIcon />
          <span>{dropLabel}</span>
        </button>
      )}
    </div>
  );
}

function MultiDropzone({
  uploading,
  urls,
  maxCount,
  onSelect,
  onRemove,
  dropLabel,
  addMoreLabel,
  uploadingLabel,
  removeLabel,
}: {
  uploading: boolean;
  urls: string[];
  maxCount: number;
  onSelect: (files: FileList) => void;
  onRemove: (url: string) => void;
  dropLabel: string;
  addMoreLabel: string;
  uploadingLabel: string;
  removeLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const remaining = maxCount - urls.length;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) onSelect(files);
    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length)
      onSelect(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={handleChange}
      />

      {urls.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {urls.map((url) => (
            <li
              key={url}
              className="group relative aspect-square overflow-hidden rounded-card border border-glass-border bg-ocean-light/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => onRemove(url)}
                aria-label={removeLabel}
                className="absolute right-1 top-1 inline-flex h-7 w-7 items-center justify-center rounded-card bg-ocean-dark/80 text-alert opacity-0 transition-opacity hover:bg-alert hover:text-white group-hover:opacity-100"
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {remaining > 0 ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "flex min-h-[100px] items-center justify-center rounded-card border-2 border-dashed bg-ocean-light/40 p-4 transition-colors",
            dragOver ? "border-amber bg-amber-soft" : "border-glass-border"
          )}
        >
          {uploading ? (
            <p className="font-body text-sm text-amber">{uploadingLabel}</p>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex flex-col items-center gap-2 font-body text-sm text-warmgray transition-colors hover:text-amber"
            >
              <UploadIcon />
              <span>{urls.length === 0 ? dropLabel : addMoreLabel}</span>
              <span className="text-xs">
                {urls.length}/{maxCount}
              </span>
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}

/* ---------------- Success ---------------- */

function SuccessScreen({ t }: { t: Translator }) {
  return (
    <section
      aria-label="Application submitted"
      className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(46,204,113,0.18),transparent_55%),radial-gradient(circle_at_50%_85%,rgba(242,169,0,0.12),transparent_55%)]"
      />
      <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center gap-7 px-4 text-center sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-success bg-success/15 text-success"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-bob"
          >
            <path d="M5 12l5 5 9-11" />
          </svg>
        </div>

        <div className="relative h-[160px] w-[160px]">
          <Image
            src="/assets/empty-states/empty-achievement.png"
            alt=""
            fill
            sizes="160px"
            className="object-contain"
          />
        </div>

        <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
          {t("successTitle")}
        </h1>
        <p className="max-w-md font-body text-base text-warmgray sm:text-lg">
          {t("successDesc")}
        </p>

        <Button href="/" variant="primary" size="lg">
          {t("successCta")}
        </Button>
        <p className="font-body text-xs text-warmgray">
          {t("successContact")}
        </p>
      </div>
    </section>
  );
}

/* ---------------- Icons ---------------- */

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

function CloseIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </svg>
  );
}

