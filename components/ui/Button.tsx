import type { ButtonHTMLAttributes } from "react";

// The look lives in app/globals.css (.btn-lux): a thin brass line at rest, a
// slow warm glow and one sheen on hover, a pressed key on click.
const base = "btn-lux";

const variants = {
  primary: "",
  secondary: "btn-lux-quiet",
} as const;

export type ButtonVariant = keyof typeof variants;

/** Shared pill-button styling. Apply to a/Link/button. */
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
