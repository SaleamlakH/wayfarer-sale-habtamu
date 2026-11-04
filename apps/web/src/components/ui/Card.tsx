import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  nested?: boolean;
}

export function Card({
  nested = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl border border-(--border) p-4 ${
        nested ? "bg-(--surface-secondary)" : "bg-(--surface-primary)"
      } ${className}`}
      {...props}
    />
  );
}
