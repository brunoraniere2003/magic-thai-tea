"use client";

import Link from "next/link";
import { Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { HOME, type WorldKey } from "@/content/home";

const accents: Record<WorldKey, { eyebrow: string; hover: string }> = {
  magic: {
    eyebrow: "text-gold",
    hover:
      "hover:border-gold/40 hover:shadow-[0_24px_70px_-28px_rgba(224,160,64,0.5)]",
  },
  tea: {
    eyebrow: "text-amber",
    hover:
      "hover:border-amber/40 hover:shadow-[0_24px_70px_-28px_rgba(201,154,78,0.5)]",
  },
  taichi: {
    eyebrow: "text-jade",
    hover:
      "hover:border-jade/40 hover:shadow-[0_24px_70px_-28px_rgba(175,196,180,0.5)]",
  },
};

/**
 * The three-worlds triptych — the centerpiece. The worlds reveal one after
 * another (dramatic stagger) as the row enters view; on a wide screen each card
 * lifts and lights up in its world's color on hover. Static under reduced motion.
 */
export function Worlds() {
  return (
    <section
      id="worlds"
      className="mx-auto max-w-7xl scroll-mt-24 px-6 py-24 sm:py-32"
    >
      <SectionHeading
        eyebrow={HOME.worldsHeading.eyebrow}
        title={HOME.worldsHeading.title}
        align="center"
        className="mx-auto mb-14 max-w-2xl"
      />
      <Stagger
        as="ul"
        stagger={0.18}
        y={36}
        duration={0.9}
        className="grid gap-6 lg:grid-cols-3"
      >
        {HOME.worlds.map((world) => (
          <li key={world.key}>
            <Link
              href={world.href}
              className={`group flex h-full flex-col gap-4 rounded-3xl border border-stone/15 bg-cream/[0.02] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:bg-cream/[0.04] ${accents[world.key].hover}`}
            >
              <span
                className={`font-sans text-xs uppercase tracking-[0.3em] ${accents[world.key].eyebrow}`}
              >
                {world.eyebrow}
              </span>
              <h3 className="font-display text-3xl text-cream">{world.title}</h3>
              <p className="font-display text-lg text-stone">{world.essence}</p>
              <p className="font-sans text-sm leading-relaxed text-stone">
                {world.description}
              </p>
              <span className="mt-auto inline-flex items-center gap-2 font-sans text-sm text-cream">
                Explore
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          </li>
        ))}
      </Stagger>
    </section>
  );
}
