import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "urgent";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-(--accent) text-white hover:bg-(--accent)/90 focus-visible:outline-(--accent)",
  secondary:
    "border border-(--border) bg-(--bg) text-(--ink) hover:bg-(--ink)/5 focus-visible:outline-(--accent)",
  urgent:
    "bg-(--stars) text-white hover:bg-(--stars)/90 focus-visible:outline-(--stars)",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
