"use client";

import { type ReactNode } from "react";

export function cn(...parts: Array<string | undefined | false | null>): string {
  return parts.filter(Boolean).join(" ");
}

const fieldBase =
  "w-full rounded-card border bg-ocean-light/60 px-4 py-2.5 font-body text-base text-white placeholder:text-warmgray/60 transition-colors focus:outline-none focus:ring-2 focus:ring-amber/60 focus:border-amber";

type FieldShellProps = {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  optional?: string;
  helper?: string;
  error?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function FieldShell({
  label,
  htmlFor,
  required,
  optional,
  helper,
  error,
  rightSlot,
  children,
  className,
}: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <div className="flex items-center justify-between">
          <label
            htmlFor={htmlFor}
            className="font-body text-sm font-semibold text-white"
          >
            {label}
            {required ? <span className="ml-0.5 text-amber">*</span> : null}
          </label>
          {optional && !required ? (
            <span className="font-body text-xs text-warmgray">{optional}</span>
          ) : null}
          {rightSlot}
        </div>
      ) : null}
      {children}
      {error ? (
        <span className="font-body text-xs text-alert" role="alert">
          {error}
        </span>
      ) : helper ? (
        <span className="font-body text-xs text-warmgray">{helper}</span>
      ) : null}
    </div>
  );
}

type TextInputProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url" | "number";
  error?: string;
  helper?: string;
  required?: boolean;
  optional?: string;
  inputMode?: "text" | "email" | "tel" | "url" | "numeric";
  maxLength?: number;
  min?: number;
  className?: string;
};

export function TextInput({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  helper,
  required,
  optional,
  inputMode,
  maxLength,
  min,
  className,
}: TextInputProps) {
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      required={required}
      optional={optional}
      helper={helper}
      error={error}
      className={className}
    >
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        min={min}
        className={cn(fieldBase, error && "border-alert focus:ring-alert/60")}
      />
    </FieldShell>
  );
}

type TextareaProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  helper?: string;
  error?: string;
  charsLeftLabel?: (n: number) => string;
};

export function Textarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  maxLength,
  helper,
  error,
  charsLeftLabel,
}: TextareaProps) {
  const charsLeft = maxLength ? maxLength - value.length : null;
  return (
    <FieldShell
      label={label}
      htmlFor={id}
      helper={helper}
      error={error}
      rightSlot={
        charsLeft != null && charsLeftLabel ? (
          <span className="font-body text-xs text-warmgray">
            {charsLeftLabel(charsLeft)}
          </span>
        ) : null
      }
    >
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          fieldBase,
          "resize-y",
          error && "border-alert focus:ring-alert/60"
        )}
      />
    </FieldShell>
  );
}

type PillGroupProps = {
  options: ReadonlyArray<{ id: string; label: string }>;
  selected: ReadonlyArray<string>;
  onToggle: (id: string) => void;
  label?: string;
  helper?: string;
  error?: string;
};

export function PillGroup({
  options,
  selected,
  onToggle,
  label,
  helper,
  error,
}: PillGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      {label ? (
        <legend className="mb-1 font-body text-sm font-semibold text-white">
          {label}
        </legend>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option.id);
          return (
            <button
              type="button"
              key={option.id}
              onClick={() => onToggle(option.id)}
              aria-pressed={isSelected}
              className={cn(
                "inline-flex items-center rounded-card border px-3 py-1.5 font-body text-sm font-medium transition-colors",
                isSelected
                  ? "border-amber bg-amber text-ocean"
                  : "border-glass-border bg-glass-bg text-warmgray hover:border-amber/40 hover:text-white"
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      {error ? (
        <span className="font-body text-xs text-alert">{error}</span>
      ) : helper ? (
        <span className="font-body text-xs text-warmgray">{helper}</span>
      ) : null}
    </fieldset>
  );
}

type CheckboxProps = {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: ReactNode;
  error?: string;
};

export function Checkbox({ id, checked, onChange, label, error }: CheckboxProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 font-body text-sm text-white"
      >
        <span
          className={cn(
            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-card border transition-colors",
            checked
              ? "border-amber bg-amber"
              : "border-glass-border bg-glass-bg",
            error && !checked && "border-alert"
          )}
          aria-hidden
        >
          {checked ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0b1f3a"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12l5 5 9-11" />
            </svg>
          ) : null}
        </span>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span>{label}</span>
      </label>
      {error ? (
        <span className="font-body text-xs text-alert">{error}</span>
      ) : null}
    </div>
  );
}
