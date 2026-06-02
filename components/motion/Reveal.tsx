"use client";

import { createElement } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { shouldRevealOnScroll } from "@/lib/animations/scrollAnimationMode";
import { useScrollAnimation } from "@/lib/animations/useScrollAnimation";

export interface RevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Element to render (default `div`). Use for semantics: section, li, article… */
  as?: ElementType;
  /** Rise distance in px (default 24). */
  y?: number;
  /** Tween duration in seconds (default 0.8). */
  duration?: number;
  /** Delay before the reveal in seconds (default 0). */
  delay?: number;
  /** ScrollTrigger start (default "top 85%"). */
  start?: string;
}

/**
 * Reveals its content (fade + gentle rise) as it scrolls into view. Use BELOW
 * the fold — the initial "hidden" state happens off-screen, so there is no
 * visible flash. Without motion it renders at the final state (visible, in place).
 */
export function Reveal({
  children,
  as,
  y = 24,
  duration = 0.8,
  delay = 0,
  start = "top 85%",
  ...rest
}: RevealProps) {
  const Tag = (as ?? "div") as ElementType;
  const reducedMotion = useReducedMotion();
  const ref = useScrollAnimation<HTMLElement>(
    ({ element, gsap, ScrollTrigger }) => {
      gsap.set(element, { autoAlpha: 0, y });
      // onEnter fires immediately if the trigger is already in view at build
      // time (anchor jump / scrolled reload) — content never stays hidden.
      ScrollTrigger.create({
        trigger: element,
        start,
        once: true,
        onEnter: () =>
          gsap.to(element, {
            autoAlpha: 1,
            y: 0,
            duration,
            delay,
            ease: "power2.out",
          }),
      });
    },
    { enabled: shouldRevealOnScroll({ reducedMotion }) },
  );

  return createElement(Tag, { ref, ...rest }, children);
}
