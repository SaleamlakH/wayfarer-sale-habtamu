import type { ComponentPropsWithRef } from "react";

export type TextareaProps = ComponentPropsWithRef<"textarea">;

export function Textarea({ className = "", ...props }: TextareaProps) {
  return (
    <textarea
      className={`w-full rounded-lg border border-(--border) bg-(--bg) px-3 py-2 text-sm text-(--ink) placeholder:text-(--ink-muted) focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    />
  );
}
