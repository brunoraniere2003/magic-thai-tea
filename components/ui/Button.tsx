import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center rounded-full px-7 py-3 font-sans text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants = {
  primary: "bg-cream text-stage hover:bg-white",
  secondary:
    "border border-stone/40 text-cream hover:border-cream/70 hover:bg-cream/5",
} as const;

export type ButtonVariant = keyof typeof variants;

/** Shared pill-button styling (mirrors the Hero CTAs). Apply to a/Link/button. */
export function buttonClasses(
  variant: ButtonVariant = "primary",
  className = "",
): string {
  return `${base} ${variants[variant]} ${className}`.trim();
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

/** Native action button. For navigation, apply `buttonClasses` to a/Link instead. */
export function Button({ variant = "primary", className, ...rest }: ButtonProps) {
  return <button className={buttonClasses(variant, className)} {...rest} />;
}
