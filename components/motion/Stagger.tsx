"use client";

import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { shouldRevealOnScroll } from "@/lib/animations/scrollAnimationMode";
import { useScrollAnimation } from "@/lib/animations/useScrollAnimation";

export interface StaggerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Element to render (default `div`). Use `ul`/`ol` for semantic lists. */
  as?: ElementType;
  /** Rise distance in px (default 24). */
  y?: number;
  /** Per-child tween duration in seconds (default 0.7). */
  duration?: number;
  /** Gap between each child in seconds (default 0.12). */
  stagger?: number;
  /** ScrollTrigger start (default "top 85%"). */
  start?: string;
}

/**
 * Reveals its DIRECT children in sequence (cascade) as the container scrolls
 * into view. Without motion every child renders at the final state.
 */
export function Stagger({
  children,
  as,
  y = 24,
  duration = 0.7,
  stagger = 0.12,
  start = "top 85%",
  ...rest
}: StaggerProps) {
  const Tag = (as ?? "div") as ElementType;
  const reducedMotion = useReducedMotion();
  const ref = useScrollAnimation<HTMLElement>(
    ({ element, gsap }) => {
      const targets = element.children;
      if (targets.length === 0) return;
      gsap.from(targets, {
        autoAlpha: 0,
        y,
        duration,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start,
          toggleActions: "play none none reverse",
        },
      });
    },
    { enabled: shouldRevealOnScroll({ reducedMotion }) },
  );

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
