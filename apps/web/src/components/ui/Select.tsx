import type { ComponentPropsWithRef } from "react";

export type SelectProps = ComponentPropsWithRef<"select">;

export function Select({
  className = "",
  children,
  ...props
}: SelectProps) {
  return (
    <select
      className={`rounded-lg border border-(--border) bg-(--bg) px-3 py-2 text-sm text-(--ink) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}
