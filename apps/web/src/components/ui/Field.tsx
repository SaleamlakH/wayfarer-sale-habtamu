import type { ReactNode } from "react";

export interface FieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function Field({
  label,
  htmlFor,
  hint,
  error,
  className = "",
  children,
}: FieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-(--ink)"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-(--danger)">{error}</p>
      ) : hint ? (
        <p className="text-xs text-(--ink-muted)">{hint}</p>
      ) : null}
    </div>
  );
}
