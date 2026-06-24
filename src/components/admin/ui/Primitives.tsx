"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/** A glass panel/section container. */
export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-6", className)}>
      {children}
    </section>
  );
}

export function PanelTitle({ title, hint, action }: { title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="font-handwriting text-2xl text-white md:text-3xl">{title}</h2>
        {hint && <p className="mt-1 text-[13px] text-[var(--text-lo)]">{hint}</p>}
      </div>
      {action}
    </header>
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md";
};

/** Themed button. `primary` = warm bloom, `ghost` = glass, `danger` = red. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "ghost", size = "md", className, children, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold uppercase tracking-[0.16em] outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-[var(--bloom-tip)] disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "px-3 py-1.5 text-[10px]" : "px-5 py-2.5 text-[11px]",
        variant === "primary" && "bg-[var(--bloom-core)] text-[#241809] hover:brightness-110",
        variant === "ghost" && "border border-white/12 bg-white/[0.04] text-[var(--text-hi)] hover:border-[var(--bloom-core)]/50",
        variant === "danger" && "border border-red-400/30 bg-red-500/10 text-red-200 hover:bg-red-500/20",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

export function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-lo)]">
      {children}
    </label>
  );
}

const fieldBase =
  "w-full rounded-xl border bg-black/30 px-3.5 py-2.5 text-[14px] text-[var(--text-hi)] outline-none transition-colors duration-300 placeholder:text-[var(--text-lo)]/60 focus:border-[var(--bloom-core)]/50";

type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

/** Labelled text input with inline validation message. */
export function Field({ label, error, hint, id, className, ...rest }: FieldProps) {
  const inputId = id ?? rest.name;
  return (
    <div className={className}>
      <Label htmlFor={inputId}>{label}</Label>
      <input id={inputId} className={cn(fieldBase, error ? "border-red-400/50" : "border-white/10")} aria-invalid={!!error} {...rest} />
      {error ? <p className="mt-1 text-[11px] text-red-300">{error}</p> : hint ? <p className="mt-1 text-[11px] text-[var(--text-lo)]">{hint}</p> : null}
    </div>
  );
}

type AreaProps = {
  label: string;
  error?: string;
  hint?: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ label, error, hint, id, className, rows = 4, ...rest }: AreaProps) {
  const inputId = id ?? rest.name;
  return (
    <div className={className}>
      <Label htmlFor={inputId}>{label}</Label>
      <textarea
        id={inputId}
        rows={rows}
        className={cn(fieldBase, "resize-y leading-relaxed", error ? "border-red-400/50" : "border-white/10")}
        aria-invalid={!!error}
        {...rest}
      />
      {error ? <p className="mt-1 text-[11px] text-red-300">{error}</p> : hint ? <p className="mt-1 text-[11px] text-[var(--text-lo)]">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/12 py-14 text-center">
      <p className="font-handwriting text-2xl text-[var(--text-hi)]/80">{title}</p>
      {action}
    </div>
  );
}
