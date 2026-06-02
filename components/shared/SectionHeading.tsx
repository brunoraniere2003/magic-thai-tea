"use client";

import type { ElementType, ReactNode } from "react";
import { Reveal, SplitReveal } from "@/components/motion";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  /** Heading level/element (default `h2`). */
  as?: ElementType;
  className?: string;
}

/** Section header: eyebrow (fade) + title (kinetic line reveal) + intro (fade). */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as,
  className = "",
}: SectionHeadingProps) {
  const headingTag = as ?? "h2";
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-4 ${alignment} ${className}`.trim()}>
      {eyebrow ? (
        <Reveal
          as="p"
          className="font-sans text-xs uppercase tracking-[0.3em] text-stone"
        >
          {eyebrow}
        </Reveal>
      ) : null}
      <SplitReveal
        as={headingTag}
        className="max-w-2xl font-display text-3xl leading-tight text-cream sm:text-5xl"
      >
        {title}
      </SplitReveal>
      {intro ? (
        <Reveal
          as="p"
          delay={0.1}
          className="max-w-2xl font-sans text-base leading-relaxed text-stone sm:text-lg"
        >
          {intro}
        </Reveal>
      ) : null}
    </div>
  );
}
