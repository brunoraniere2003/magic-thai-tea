"use client";

import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { shouldDriveOnScroll } from "@/lib/animations/scrollAnimationMode";
import { useScrollAnimation } from "@/lib/animations/useScrollAnimation";

export interface ParallaxProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Element to render (default `div`). */
  as?: ElementType;
  /** Vertical drift in % of own height across the viewport pass; negative = up (default -12). */
  speed?: number;
  /** Force-disable (e.g. when the consumer already gates by another signal). */
  disabled?: boolean;
}

/**
 * Subtle depth drift (transform only) as the element passes through the
 * viewport. Continuous and scroll-driven → runs only on a capable device with
 * no reduced-motion request; otherwise the static base is shown.
 */
export function Parallax({
  children,
  as,
  speed = -12,
  disabled = false,
  ...rest
}: ParallaxProps) {
  const Tag = (as ?? "div") as ElementType;
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const ref = useScrollAnimation<HTMLElement>(
    ({ element, gsap }) => {
      gsap.to(element, {
        yPercent: speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { enabled: shouldDriveOnScroll({ reducedMotion, tier }) && !disabled },
  );

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
