"use client";

import {
  useEffect,
  useId,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import { useTranslations } from "next-intl";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { DESTINATIONS, type DestinationSlug } from "@/lib/constants";
import { SAMPLE_BADGES, type SampleBadge } from "@/lib/mock-data";
import {
  TextInput,
  Textarea,
} from "@/components/operators/apply/form-controls";
import type { DashboardListing } from "@/lib/dashboard-mock";

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "CRC", symbol: "₡" },
  { code: "ISK", symbol: "kr" },
  { code: "PEN", symbol: "S/" },
  { code: "THB", symbol: "฿" },
  { code: "SAR", symbol: "﷼" },
];

const fieldBase =
  "w-full rounded-card border bg-ocean-light/60 px-4 py-2.5 font-body text-base text-white placeholder:text-warmgray/60 transition-colors focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber border-glass-border";

function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

type Mode = "add" | "edit";

type Props = {
  initial: DashboardListing[];
  guideId: string;
  isMock: boolean;
};

export function ListingsManager({ initial, guideId, isMock }: Props) {
  const t = useTranslations("listings");

  const [supabase] = useState(() => createClient());
  const [listings, setListings] = useState<DashboardListing[]>(initial);
  const [pendingToggleIds, setPendingToggleIds] = useState<Set<string>>(
    () => new Set()
  );
  const [bannerError, setBannerError] = useState<string | null>(null);

  const [modalMode, setModalMode] = useState<Mode | null>(null);
  const [editTarget, setEditTarget] = useState<DashboardListing | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DashboardListing | null>(
    null
  );

  function openAdd() {
    setEditTarget(null);
    setModalMode("add");
  }
  function openEdit(listing: DashboardListing) {
    setEditTarget(listing);
    setModalMode("edit");
  }
  function closeModal() {
    setModalMode(null);
    setEditTarget(null);
  }

  async function handleToggle(listing: DashboardListing) {
    const next = !listing.is_active;
    setPendingToggleIds((s) => new Set(s).add(listing.id));
    setListings((prev) =>
      prev.map((l) => (l.id === listing.id ? { ...l, is_active: next } : l))
    );
    setBannerError(null);

    if (isMock) {
      // Mock mode: keep optimistic state, no DB call.
      setPendingToggleIds((s) => {
        const n = new Set(s);
        n.delete(listing.id);
        return n;
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("guide_badges")
        .update({ is_active: next })
        .eq("id", listing.id);
      if (error) throw error;
    } catch {
      // Revert on failure.
      setListings((prev) =>
        prev.map((l) =>
          l.id === listing.id ? { ...l, is_active: listing.is_active } : l
        )
      );
      setBannerError(t("toggleFailed"));
    } finally {
      setPendingToggleIds((s) => {
        const n = new Set(s);
        n.delete(listing.id);
        return n;
      });
    }
  }

  async function handleSave(input: ListingFormInput): Promise<string | null> {
    setBannerError(null);
    const isEdit = modalMode === "edit" && editTarget;

    const dest = DESTINATIONS.find((d) => d.slug === input.destination_id);
    const sample = SAMPLE_BADGES[input.destination_id]?.find(
      (b) => b.id === input.badge_id
    );

    const optimistic: DashboardListing = {
      id: isEdit ? editTarget.id : `temp-${Date.now()}`,
      guide_id: guideId,
      badge_id: input.badge_id,
      badge_name: sample?.name ?? input.badge_id,
      destination_id: input.destination_id,
      destination_brand: dest?.brandName ?? input.destination_id,
      offer_title: input.offer_title,
      offer_description: input.offer_description,
      price: input.price,
      currency: input.currency,
      promo_text: input.promo_text || null,
      is_active: isEdit ? editTarget.is_active : true,
      is_featured: isEdit ? editTarget.is_featured : false,
    };

    if (isMock) {
      setListings((prev) =>
        isEdit
          ? prev.map((l) => (l.id === editTarget.id ? optimistic : l))
          : [optimistic, ...prev]
      );
      return null;
    }

    try {
      if (isEdit) {
        const { error } = await supabase
          .from("guide_badges")
          .update({
            offer_title: input.offer_title,
            offer_description: input.offer_description,
            price: input.price,
            currency: input.currency,
            promo_text: input.promo_text || null,
          })
          .eq("id", editTarget.id);
        if (error) throw error;
        setListings((prev) =>
          prev.map((l) => (l.id === editTarget.id ? optimistic : l))
        );
      } else {
        const { data, error } = await supabase
          .from("guide_badges")
          .insert({
            guide_id: guideId,
            badge_id: input.badge_id,
            destination_id: input.destination_id,
            offer_title: input.offer_title,
            offer_description: input.offer_description,
            price: input.price,
            currency: input.currency,
            promo_text: input.promo_text || null,
            is_active: true,
          })
          .select("id")
          .single();
        if (error || !data) throw error ?? new Error("Insert failed");
        setListings((prev) => [{ ...optimistic, id: data.id }, ...prev]);
      }
      return null;
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("saveFailed");
      return msg || t("saveFailed");
    }
  }

  async function handleDelete(listing: DashboardListing): Promise<boolean> {
    setBannerError(null);
    const previous = listings;
    setListings((prev) => prev.filter((l) => l.id !== listing.id));

    if (isMock) return true;

    try {
      const { error } = await supabase
        .from("guide_badges")
        .delete()
        .eq("id", listing.id);
      if (error) throw error;
      return true;
    } catch {
      setListings(previous);
      setBannerError(t("deleteFailed"));
      return false;
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-1 font-body text-sm text-warmgray">
            {t("subtitle")}
          </p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          + {t("addNew")}
        </Button>
      </header>

      {bannerError ? (
        <div
          role="alert"
          className="rounded-card border border-alert/50 bg-alert/10 px-4 py-2.5 font-body text-sm text-alert"
        >
          {bannerError}
        </div>
      ) : null}

      {listings.length === 0 ? (
        <EmptyState onAdd={openAdd} />
      ) : (
        <ListingsTable
          listings={listings}
          pendingToggleIds={pendingToggleIds}
          onToggle={handleToggle}
          onEdit={openEdit}
          onDelete={(l) => setDeleteTarget(l)}
        />
      )}

      {modalMode ? (
        <ListingFormModal
          mode={modalMode}
          listing={editTarget}
          onClose={closeModal}
          onSave={handleSave}
          onDeleteRequest={
            modalMode === "edit" && editTarget
              ? () => {
                  setDeleteTarget(editTarget);
                  closeModal();
                }
              : undefined
          }
        />
      ) : null}

      {deleteTarget ? (
        <DeleteConfirmDialog
          listing={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            const ok = await handleDelete(deleteTarget);
            if (ok) setDeleteTarget(null);
          }}
        />
      ) : null}
    </div>
  );
}

/* ---------------- List rendering ---------------- */

function ListingsTable({
  listings,
  pendingToggleIds,
  onToggle,
  onEdit,
  onDelete,
}: {
  listings: DashboardListing[];
  pendingToggleIds: Set<string>;
  onToggle: (l: DashboardListing) => void;
  onEdit: (l: DashboardListing) => void;
  onDelete: (l: DashboardListing) => void;
}) {
  const t = useTranslations("listings");
  const numFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

  return (
    <>
      <div className="hidden overflow-hidden rounded-card border border-glass-border bg-glass-bg lg:block">
        <table className="w-full text-left">
          <thead className="bg-ocean-dark/60">
            <tr>
              <Th>{t("columnBadge")}</Th>
              <Th>{t("columnOffer")}</Th>
              <Th className="text-right">{t("columnPrice")}</Th>
              <Th className="text-center">{t("columnStatus")}</Th>
              <Th className="text-right">{t("columnActions")}</Th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l, i) => (
              <tr
                key={l.id}
                className={cn(
                  "border-t border-glass-border",
                  i % 2 === 1 && "bg-ocean-dark/30"
                )}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-sm font-semibold text-white">
                      {l.badge_name}
                    </p>
                    {l.is_featured ? <FeaturedStar /> : null}
                  </div>
                  <p className="font-body text-xs text-warmgray">
                    {l.destination_brand}
                  </p>
                </td>
                <td className="px-5 py-4">
                  <p className="font-body text-sm text-white">
                    {l.offer_title}
                  </p>
                  {l.promo_text ? (
                    <p className="mt-0.5 font-body text-xs text-amber">
                      {l.promo_text}
                    </p>
                  ) : null}
                </td>
                <td className="px-5 py-4 text-right font-display text-sm font-semibold text-amber">
                  {l.currency} {numFmt.format(l.price)}
                </td>
                <td className="px-5 py-4 text-center">
                  <StatusToggle
                    active={l.is_active}
                    pending={pendingToggleIds.has(l.id)}
                    onToggle={() => onToggle(l)}
                    activeLabel={t("statusActive")}
                    pausedLabel={t("statusPaused")}
                    ariaLabel={t("statusToggle")}
                  />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(l)}
                      className="rounded-card border border-glass-border bg-glass-bg px-3 py-1.5 font-body text-xs font-semibold text-amber transition-colors hover:bg-amber-soft"
                    >
                      {t("edit")}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(l)}
                      className="rounded-card border border-alert/40 px-3 py-1.5 font-body text-xs font-semibold text-alert transition-colors hover:bg-alert/10"
                    >
                      {t("delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 lg:hidden">
        {listings.map((l) => (
          <li key={l.id}>
            <GlassCard className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-display text-base font-semibold text-white">
                      {l.badge_name}
                    </p>
                    {l.is_featured ? <FeaturedStar /> : null}
                  </div>
                  <p className="font-body text-xs text-warmgray">
                    {l.destination_brand}
                  </p>
                </div>
                <span className="shrink-0 font-display text-sm font-semibold text-amber">
                  {l.currency} {numFmt.format(l.price)}
                </span>
              </div>
              <p className="font-body text-sm text-white">{l.offer_title}</p>
              {l.promo_text ? (
                <p className="font-body text-xs text-amber">{l.promo_text}</p>
              ) : null}
              <div className="mt-1 flex items-center justify-between gap-3">
                <StatusToggle
                  active={l.is_active}
                  pending={pendingToggleIds.has(l.id)}
                  onToggle={() => onToggle(l)}
                  activeLabel={t("statusActive")}
                  pausedLabel={t("statusPaused")}
                  ariaLabel={t("statusToggle")}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(l)}
                    className="rounded-card border border-glass-border bg-glass-bg px-3 py-1.5 font-body text-xs font-semibold text-amber"
                  >
                    {t("edit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(l)}
                    className="rounded-card border border-alert/40 px-3 py-1.5 font-body text-xs font-semibold text-alert"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </GlassCard>
          </li>
        ))}
      </ul>
    </>
  );
}

function Th({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-5 py-3 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-warmgray",
        className
      )}
    >
      {children}
    </th>
  );
}

function StatusToggle({
  active,
  pending,
  onToggle,
  activeLabel,
  pausedLabel,
  ariaLabel,
}: {
  active: boolean;
  pending: boolean;
  onToggle: () => void;
  activeLabel: string;
  pausedLabel: string;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      aria-label={ariaLabel}
      onClick={onToggle}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-2 rounded-card px-2 py-1 font-body text-xs font-semibold transition-opacity",
        pending && "opacity-60"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-card border transition-colors",
          active
            ? "border-success bg-success/30"
            : "border-glass-border bg-glass-bg"
        )}
      >
        <span
          className={cn(
            "inline-block h-3 w-3 rounded-card transition-transform",
            active ? "translate-x-5 bg-success" : "translate-x-1 bg-warmgray"
          )}
        />
      </span>
      <span className={cn(active ? "text-success" : "text-warmgray")}>
        {active ? activeLabel : pausedLabel}
      </span>
    </button>
  );
}

function FeaturedStar() {
  const t = useTranslations("listings");
  return (
    <span
      title={t("featured")}
      aria-label={t("featured")}
      className="text-amber"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 2l2.95 6.59 7.05.77-5.3 4.94 1.5 7.2L12 18.4l-6.2 3.6 1.5-7.2L2 9.36l7.05-.77z" />
      </svg>
    </span>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  const t = useTranslations("listings");
  return (
    <div className="flex flex-col items-center gap-5 rounded-card border border-glass-border bg-glass-bg px-6 py-14 text-center">
      <p className="max-w-md font-body text-base text-warmgray">
        {t("empty")}
      </p>
      <Button variant="primary" onClick={onAdd}>
        + {t("addCta")}
      </Button>
    </div>
  );
}

/* ---------------- Modal ---------------- */

type ListingFormInput = {
  destination_id: DestinationSlug;
  badge_id: string;
  offer_title: string;
  offer_description: string;
  price: number;
  currency: string;
  promo_text: string;
};

function ListingFormModal({
  mode,
  listing,
  onClose,
  onSave,
  onDeleteRequest,
}: {
  mode: Mode;
  listing: DashboardListing | null;
  onClose: () => void;
  onSave: (input: ListingFormInput) => Promise<string | null>;
  onDeleteRequest?: () => void;
}) {
  const t = useTranslations("listings");
  const titleId = useId();

  const [destinationId, setDestinationId] = useState<DestinationSlug | "">(
    listing?.destination_id ?? ""
  );
  const [badgeId, setBadgeId] = useState<string>(listing?.badge_id ?? "");
  const [badgeSearch, setBadgeSearch] = useState("");
  const [offerTitle, setOfferTitle] = useState(listing?.offer_title ?? "");
  const [offerDescription, setOfferDescription] = useState(
    listing?.offer_description ?? ""
  );
  const [price, setPrice] = useState(
    listing ? String(listing.price) : ""
  );
  const [currency, setCurrency] = useState(listing?.currency ?? "USD");
  const [promoText, setPromoText] = useState(listing?.promo_text ?? "");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const availableBadges = useMemo<SampleBadge[]>(() => {
    if (!destinationId) return [];
    const badges = SAMPLE_BADGES[destinationId] ?? [];
    if (!badgeSearch.trim()) return badges;
    const q = badgeSearch.toLowerCase();
    return badges.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q)
    );
  }, [destinationId, badgeSearch]);

  const selectedBadge = useMemo(() => {
    if (!destinationId) return null;
    return (
      SAMPLE_BADGES[destinationId]?.find((b) => b.id === badgeId) ?? null
    );
  }, [destinationId, badgeId]);

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (mode === "add") {
      if (!destinationId) next.destination_id = t("required");
      if (!badgeId) next.badge_id = t("required");
    }
    if (!offerTitle.trim()) next.offer_title = t("required");
    if (!offerDescription.trim()) next.offer_description = t("required");
    const priceNum = parseFloat(price);
    if (!price.trim() || Number.isNaN(priceNum) || priceNum <= 0) {
      next.price = t("invalidPrice");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!destinationId) return;
    setSaving(true);
    setSubmitError(null);
    const result = await onSave({
      destination_id: destinationId,
      badge_id: badgeId,
      offer_title: offerTitle.trim(),
      offer_description: offerDescription.trim(),
      price: parseFloat(price),
      currency,
      promo_text: promoText.trim(),
    });
    setSaving(false);
    if (result) {
      setSubmitError(result);
    } else {
      onClose();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex items-end justify-center bg-ocean-dark/75 backdrop-blur-sm sm:items-center"
    >
      <div
        aria-hidden
        onClick={onClose}
        className="absolute inset-0"
      />
      <GlassCard
        noPadding
        className="relative z-10 my-4 max-h-[calc(100vh-2rem)] w-full max-w-2xl overflow-hidden bg-ocean"
      >
        <header className="flex items-center justify-between border-b border-glass-border px-6 py-4">
          <h2
            id={titleId}
            className="font-display text-xl font-semibold text-white"
          >
            {mode === "add" ? t("modalAddTitle") : t("modalEditTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("cancel")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-card border border-glass-border text-white transition-colors hover:bg-glass-bg"
          >
            <CloseIcon />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex max-h-[calc(100vh-12rem)] flex-col gap-5 overflow-y-auto px-6 py-5"
        >
          {/* Destination */}
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-sm font-semibold text-white">
              {t("destinationLabel")}
              <span className="ml-0.5 text-amber">*</span>
            </label>
            <select
              value={destinationId}
              onChange={(e) => {
                setDestinationId(e.target.value as DestinationSlug);
                setBadgeId("");
                setBadgeSearch("");
              }}
              disabled={mode === "edit"}
              className={cn(
                fieldBase,
                mode === "edit" && "opacity-60 cursor-not-allowed",
                errors.destination_id && "border-alert"
              )}
            >
              <option value="" className="bg-ocean text-warmgray">
                {t("destinationPlaceholder")}
              </option>
              {DESTINATIONS.map((d) => (
                <option
                  key={d.slug}
                  value={d.slug}
                  className="bg-ocean text-white"
                >
                  {d.flag} {d.brandName} — {d.country}
                </option>
              ))}
            </select>
            {errors.destination_id ? (
              <span className="font-body text-xs text-alert">
                {errors.destination_id}
              </span>
            ) : null}
          </div>

          {/* Badge */}
          {mode === "edit" && listing ? (
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm font-semibold text-white">
                {t("badgeLabel")}
              </label>
              <div className={cn(fieldBase, "opacity-80")}>
                {listing.badge_name}
              </div>
            </div>
          ) : (
            <BadgePicker
              destinationId={destinationId}
              badgeId={badgeId}
              setBadgeId={setBadgeId}
              search={badgeSearch}
              setSearch={setBadgeSearch}
              available={availableBadges}
              selectedBadge={selectedBadge}
              error={errors.badge_id}
            />
          )}

          <TextInput
            label={t("offerTitleLabel")}
            placeholder={t("offerTitlePlaceholder")}
            value={offerTitle}
            onChange={setOfferTitle}
            required
            error={errors.offer_title}
          />

          <Textarea
            label={t("descriptionLabel")}
            placeholder={t("descriptionPlaceholder")}
            value={offerDescription}
            onChange={setOfferDescription}
            rows={4}
            error={errors.offer_description}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <TextInput
                type="number"
                inputMode="numeric"
                min={0}
                label={t("priceLabel")}
                value={price}
                onChange={(v) => setPrice(v.replace(/[^0-9.]/g, ""))}
                placeholder="100"
                required
                error={errors.price}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-body text-sm font-semibold text-white">
                {t("currencyLabel")}
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={fieldBase}
              >
                {CURRENCIES.map((c) => (
                  <option
                    key={c.code}
                    value={c.code}
                    className="bg-ocean text-white"
                  >
                    {c.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <TextInput
            label={t("promoLabel")}
            optional={t("promoOptional")}
            placeholder={t("promoPlaceholder")}
            value={promoText}
            onChange={setPromoText}
          />

          {submitError ? (
            <div
              role="alert"
              className="rounded-card border border-alert/50 bg-alert/10 px-3 py-2 font-body text-sm text-alert"
            >
              {submitError}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-glass-border pt-4">
            {onDeleteRequest ? (
              <button
                type="button"
                onClick={onDeleteRequest}
                className="rounded-card border border-alert/40 px-4 py-2 font-body text-sm font-semibold text-alert transition-colors hover:bg-alert/10"
              >
                {t("delete")}
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button variant="primary" disabled={saving}>
                {saving
                  ? t("saving")
                  : mode === "edit"
                  ? t("update")
                  : t("save")}
              </Button>
            </div>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}

function BadgePicker({
  destinationId,
  badgeId,
  setBadgeId,
  search,
  setSearch,
  available,
  selectedBadge,
  error,
}: {
  destinationId: DestinationSlug | "";
  badgeId: string;
  setBadgeId: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
  available: SampleBadge[];
  selectedBadge: SampleBadge | null;
  error?: string;
}) {
  const t = useTranslations("listings");

  if (!destinationId) {
    return (
      <div className="flex flex-col gap-1.5">
        <label className="font-body text-sm font-semibold text-white">
          {t("badgeLabel")}
          <span className="ml-0.5 text-amber">*</span>
        </label>
        <p className="rounded-card border border-glass-border bg-ocean-light/40 px-4 py-3 font-body text-xs text-warmgray">
          {t("badgePickFirst")}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-body text-sm font-semibold text-white">
        {t("badgeLabel")}
        <span className="ml-0.5 text-amber">*</span>
      </label>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t("badgeSearch")}
        className={cn(fieldBase, "py-2 text-sm")}
      />
      <ul className="max-h-44 overflow-y-auto rounded-card border border-glass-border bg-ocean-light/40">
        {available.length === 0 ? (
          <li className="px-3 py-2 font-body text-xs text-warmgray">
            {t("badgeNoResults")}
          </li>
        ) : (
          available.map((badge) => {
            const isSelected = badge.id === badgeId;
            return (
              <li key={badge.id}>
                <button
                  type="button"
                  onClick={() => setBadgeId(badge.id)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3 py-2 text-left font-body text-sm transition-colors",
                    isSelected
                      ? "bg-amber-soft text-amber"
                      : "text-white hover:bg-glass-bg"
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">
                      {badge.name}
                    </span>
                    <span className="block truncate text-xs text-warmgray">
                      {badge.description}
                    </span>
                  </span>
                  {isSelected ? (
                    <span aria-hidden className="text-amber">
                      ✓
                    </span>
                  ) : null}
                </button>
              </li>
            );
          })
        )}
      </ul>
      {selectedBadge ? (
        <p className="font-body text-xs text-amber">
          ✓ {selectedBadge.name}
        </p>
      ) : null}
      {error ? (
        <span className="font-body text-xs text-alert">{error}</span>
      ) : null}
    </div>
  );
}

/* ---------------- Delete dialog ---------------- */

function DeleteConfirmDialog({
  listing,
  onCancel,
  onConfirm,
}: {
  listing: DashboardListing;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) {
  const t = useTranslations("listings");
  const titleId = useId();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ocean-dark/80 backdrop-blur-sm"
    >
      <div aria-hidden onClick={onCancel} className="absolute inset-0" />
      <GlassCard className="relative z-10 mx-4 w-full max-w-md bg-ocean">
        <h2
          id={titleId}
          className="font-display text-xl font-semibold text-white"
        >
          {t("deleteConfirmTitle")}
        </h2>
        <p className="mt-2 font-body text-sm text-warmgray">
          {t("deleteConfirmDesc")}
        </p>
        <p className="mt-4 rounded-card border border-glass-border bg-ocean-dark/40 px-3 py-2 font-body text-sm text-white">
          <span className="font-semibold">{listing.badge_name}</span>
          <span className="mx-2 text-warmgray/60">·</span>
          {listing.offer_title}
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel} disabled={busy}>
            {t("cancel")}
          </Button>
          <button
            type="button"
            onClick={async () => {
              setBusy(true);
              await onConfirm();
              setBusy(false);
            }}
            disabled={busy}
            className="inline-flex items-center justify-center rounded-card bg-alert px-6 py-3 font-body font-semibold text-white transition-colors hover:bg-alert/90 disabled:opacity-50"
          >
            {busy ? t("deleting") : t("deleteConfirmCta")}
          </button>
        </div>
      </GlassCard>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      aria-hidden
    >
      <path d="M5 5l14 14" />
      <path d="M19 5L5 19" />
    </svg>
  );
}
