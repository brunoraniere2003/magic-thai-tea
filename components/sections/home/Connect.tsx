import type { ReactNode } from "react";
import { Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { HOME } from "@/content/home";

/**
 * "Find me elsewhere" (spec 033 / R8): three gold line-art cards, one per
 * channel. Hover and focus lift the card and warm its edge; only transform and
 * opacity move (§5), so reduced motion loses nothing but the lift.
 */
export function Connect() {
  const { connect } = HOME;

  return (
    <section
      id="connect"
      className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={connect.eyebrow}
        title={connect.title}
        align="center"
        className="mx-auto mb-12"
      />

      <Stagger
        as="ul"
        className="grid gap-4 sm:grid-cols-3 sm:gap-5"
        start="top 90%"
      >
        {connect.links.map((link) => {
          const external = link.href.startsWith("http");
          return (
            <li key={link.label}>
              <a
                href={link.href}
                {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="group flex h-full flex-col gap-4 rounded-2xl border border-stone/20 bg-stage/40 p-6 transition-[transform,border-color] duration-300 hover:-translate-y-1 hover:border-gold/50 focus-visible:-translate-y-1 focus-visible:border-gold/50 focus-visible:outline-none motion-reduce:transform-none"
              >
                <span className="text-gold">
                  {ICONS[link.label] ?? ICONS.Email}
                </span>
                <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-stone/70">
                  {link.label}
                </span>
                <span className="font-display text-lg leading-snug text-cream transition-colors group-hover:text-white">
                  {link.value}
                </span>
                {link.note ? (
                  <span className="mt-auto font-sans text-sm leading-relaxed text-stone">
                    {link.note}
                  </span>
                ) : null}
              </a>
            </li>
          );
        })}
      </Stagger>
    </section>
  );
}

const iconProps = {
  width: 32,
  height: 32,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Drawn in the same thin gold line-art language as the card faces. */
const ICONS: Record<string, ReactNode> = {
  Email: (
    <svg {...iconProps}>
      <rect x="3" y="7" width="26" height="18" rx="3" />
      <path d="M4 9l12 9 12-9" />
    </svg>
  ),
  Instagram: (
    <svg {...iconProps}>
      <rect x="4" y="4" width="24" height="24" rx="7" />
      <circle cx="16" cy="16" r="6" />
      <circle cx="23" cy="9" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  Podcast: (
    <svg {...iconProps}>
      <rect x="12" y="3" width="8" height="15" rx="4" />
      <path d="M7 15a9 9 0 0 0 18 0" />
      <path d="M16 24v5" />
      <path d="M11 29h10" />
    </svg>
  ),
};
