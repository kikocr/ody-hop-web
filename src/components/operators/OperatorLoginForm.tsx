"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/routing";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { TextInput, cn } from "@/components/operators/apply/form-controls";
import { useAuth } from "@/components/providers/AuthProvider";

type Mode = "login" | "reset";

const fieldBase =
  "w-full rounded-card border bg-ocean-light/60 px-4 py-2.5 font-body text-base text-white placeholder:text-warmgray/60 transition-colors focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber";

export function OperatorLoginForm() {
  const t = useTranslations("login");
  const tc = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase } = useAuth();

  const emailId = useId();
  const passwordId = useId();
  const resetEmailId = useId();

  const [mode, setMode] = useState<Mode>("login");

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reset state
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  // Read middleware-added error/redirect on first paint. Deferred via rAF to
  // satisfy react-hooks/set-state-in-effect (the synchronous variant is
  // flagged by React 19's lint, even though it'd cause a single rerender).
  useEffect(() => {
    const middlewareError = searchParams.get("error");
    if (middlewareError === "not_operator") {
      const id = requestAnimationFrame(() => setError(t("notOperator")));
      return () => cancelAnimationFrame(id);
    }
  }, [searchParams, t]);

  const redirectTarget = searchParams.get("redirect") ?? "/operators/dashboard";

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) return;
    setSubmitting(true);
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({ email, password });
      if (signInError || !data.user) {
        setError(t("invalidCredentials"));
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("account_type")
        .eq("id", data.user.id)
        .maybeSingle();
      if (!profile || profile.account_type !== "operator") {
        await supabase.auth.signOut();
        setError(t("notOperator"));
        return;
      }
      // Strip locale prefix from redirect target so the i18n router can
      // re-prefix consistently with the user's current locale.
      const stripped = redirectTarget.replace(/^\/(en|es)(?=\/|$)/, "") || "/";
      router.replace(stripped as "/operators/dashboard");
    } catch {
      setError(t("unknownError"));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault();
    setResetError(null);
    setResetSent(false);
    if (!resetEmail.trim()) return;
    setResetSubmitting(true);
    try {
      const origin =
        typeof window !== "undefined" ? window.location.origin : "";
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(
        resetEmail,
        { redirectTo: `${origin}/operators/login` }
      );
      if (resetErr) {
        setResetError(resetErr.message || t("unknownError"));
        return;
      }
      setResetSent(true);
    } catch {
      setResetError(t("unknownError"));
    } finally {
      setResetSubmitting(false);
    }
  }

  return (
    <section
      aria-label="Operator login"
      className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ocean via-ocean to-ocean-light"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(242,169,0,0.18),transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-md px-4 sm:px-6">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 font-display text-2xl font-bold tracking-wide text-amber"
          aria-label="Ody Hop home"
        >
          <Image
            src="/assets/icon.png"
            alt=""
            width={36}
            height={36}
            priority
            className="h-9 w-9 shrink-0 rounded-lg"
          />
          <span>Ody Hop</span>
        </Link>

        <GlassCard className="flex flex-col gap-5">
          {mode === "login" ? (
            <LoginPanel
              t={t}
              tc={tc}
              emailId={emailId}
              passwordId={passwordId}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              submitting={submitting}
              error={error}
              onSubmit={handleLogin}
              onForgot={() => {
                setMode("reset");
                setError(null);
              }}
            />
          ) : (
            <ResetPanel
              t={t}
              resetEmailId={resetEmailId}
              email={resetEmail}
              setEmail={setResetEmail}
              submitting={resetSubmitting}
              error={resetError}
              sent={resetSent}
              onSubmit={handleReset}
              onBack={() => {
                setMode("login");
                setResetEmail("");
                setResetError(null);
                setResetSent(false);
              }}
            />
          )}
        </GlassCard>

        {mode === "login" ? (
          <p className="mt-6 text-center font-body text-sm text-warmgray">
            {t("noAccount")}{" "}
            <Link
              href="/operators/apply"
              className="font-semibold text-amber hover:underline"
            >
              {t("applyHere")}
            </Link>
          </p>
        ) : null}
      </div>
    </section>
  );
}

type Translator = ReturnType<typeof useTranslations>;

function LoginPanel({
  t,
  tc,
  emailId,
  passwordId,
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  submitting,
  error,
  onSubmit,
  onForgot,
}: {
  t: Translator;
  tc: Translator;
  emailId: string;
  passwordId: string;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: FormEvent) => void;
  onForgot: () => void;
}) {
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <header className="text-center">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {t("title")}
        </h1>
        <p className="mt-1 font-body text-sm text-warmgray">{t("subtitle")}</p>
      </header>

      {error ? (
        <div
          role="alert"
          className="rounded-card border border-alert/50 bg-alert/10 px-3 py-2 font-body text-sm text-alert"
        >
          {error}
        </div>
      ) : null}

      <TextInput
        id={emailId}
        type="email"
        inputMode="email"
        label={t("emailLabel")}
        placeholder={t("emailPlaceholder")}
        value={email}
        onChange={setEmail}
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor={passwordId}
            className="font-body text-sm font-semibold text-white"
          >
            {t("passwordLabel")}
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="font-body text-xs font-semibold uppercase tracking-wider text-amber hover:underline"
          >
            {showPassword ? t("hidePassword") : t("showPassword")}
          </button>
        </div>
        <input
          id={passwordId}
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
          className={fieldBase}
        />
      </div>

      <button
        type="button"
        onClick={onForgot}
        className="self-start font-body text-xs font-semibold uppercase tracking-wider text-amber hover:underline"
      >
        {t("forgotPassword")}
      </button>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={submitting || !email.trim() || !password}
      >
        {submitting ? t("loading") : t("submit")}
      </Button>

      <p className="sr-only">{tc("logIn")}</p>
    </form>
  );
}

function ResetPanel({
  t,
  resetEmailId,
  email,
  setEmail,
  submitting,
  error,
  sent,
  onSubmit,
  onBack,
}: {
  t: Translator;
  resetEmailId: string;
  email: string;
  setEmail: (v: string) => void;
  submitting: boolean;
  error: string | null;
  sent: boolean;
  onSubmit: (e: FormEvent) => void;
  onBack: () => void;
}) {
  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      <header className="text-center">
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
          {t("resetTitle")}
        </h1>
        <p className="mt-1 font-body text-sm text-warmgray">
          {t("resetDesc")}
        </p>
      </header>

      {error ? (
        <div
          role="alert"
          className="rounded-card border border-alert/50 bg-alert/10 px-3 py-2 font-body text-sm text-alert"
        >
          {error}
        </div>
      ) : null}

      {sent ? (
        <div
          role="status"
          className={cn(
            "rounded-card border border-success/50 bg-success/10 px-3 py-2 font-body text-sm text-success"
          )}
        >
          {t("resetSuccess")}
        </div>
      ) : null}

      <TextInput
        id={resetEmailId}
        type="email"
        inputMode="email"
        label={t("emailLabel")}
        placeholder={t("emailPlaceholder")}
        value={email}
        onChange={setEmail}
      />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        disabled={submitting || !email.trim()}
      >
        {submitting ? t("resetSending") : t("resetSubmit")}
      </Button>

      <button
        type="button"
        onClick={onBack}
        className="self-center font-body text-xs font-semibold uppercase tracking-wider text-amber hover:underline"
      >
        {t("backToLogin")}
      </button>
    </form>
  );
}
