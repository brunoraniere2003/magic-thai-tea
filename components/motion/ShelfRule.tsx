"use client";

import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { shouldRevealOnScroll } from "@/lib/animations/scrollAnimationMode";
import { useScrollAnimation } from "@/lib/animations/useScrollAnimation";

export interface ShelfRuleProps {
  className?: string;
}

/**
 * The hairline of a shelf, drawn left to right as it comes into view — the one
 * signature gesture of the shop (§5). Scales on the X axis only, so nothing
 * lays out twice; without motion it is simply already drawn.
 */
export function ShelfRule({ className = "" }: ShelfRuleProps) {
  const reducedMotion = useReducedMotion();
  const ref = useScrollAnimation<HTMLSpanElement>(
    ({ element, gsap, ScrollTrigger }) => {
      gsap.set(element, { scaleX: 0 });
      ScrollTrigger.create({
        trigger: element,
        start: "top 92%",
        once: true,
        onEnter: () =>
          gsap.to(element, { scaleX: 1, duration: 0.55, ease: "power2.out" }),
      });
    },
    { enabled: shouldRevealOnScroll({ reducedMotion }) },
  );

  return (
    <span
      ref={ref}
      aria-hidden
      className={`origin-left ${className}`.trim()}
    />
  );
}
