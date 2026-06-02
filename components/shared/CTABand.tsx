import Link from "next/link";
import { buttonClasses, type ButtonVariant } from "@/components/ui/Button";

export interface CTAAction {
  label: string;
  href: string;
}

export interface CTABandProps {
  title: string;
  body?: string;
  primary: CTAAction;
  secondary?: CTAAction;
}

function isInternal(href: string): boolean {
  return href.startsWith("/");
}

function Action({
  action,
  variant,
}: {
  action: CTAAction;
  variant: ButtonVariant;
}) {
  const className = buttonClasses(variant);
  return isInternal(action.href) ? (
    <Link href={action.href} className={className}>
      {action.label}
    </Link>
  ) : (
    <a href={action.href} className={className}>
      {action.label}
    </a>
  );
}

/** Call-to-action band: heading + optional body + one or two actions. */
export function CTABand({ title, body, primary, secondary }: CTABandProps) {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="flex flex-col items-center gap-6 rounded-3xl border border-stone/15 bg-cream/[0.03] px-8 py-14 text-center">
        <h2 className="max-w-2xl font-display text-3xl leading-tight text-cream sm:text-4xl">
          {title}
        </h2>
        {body ? (
          <p className="max-w-xl font-sans text-base text-stone">{body}</p>
        ) : null}
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Action action={primary} variant="primary" />
          {secondary ? <Action action={secondary} variant="secondary" /> : null}
        </div>
      </div>
    </div>
  );
}
