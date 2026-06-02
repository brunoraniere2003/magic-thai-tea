"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { shouldDriveOnScroll } from "@/lib/animations/scrollAnimationMode";
import { useScrollAnimation } from "@/lib/animations/useScrollAnimation";

export interface PinProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** How long to stay pinned, in viewport heights (default 1). */
  distance?: number;
  /** ScrollTrigger start (default "top top"). */
  start?: string;
  /** Force-disable (e.g. iOS / weak-device guard from the consumer). */
  disabled?: boolean;
}

/**
 * Pins its content for `distance` viewport heights, then releases. Heavy and
 * iOS-sensitive → runs only on a capable device with no reduced-motion request;
 * otherwise it is a normal stacked section (the static fallback). The consumer
 * should size the pinned stage with `dvh`/`svh` (not `vh`) for iOS.
 */
export function Pin({
  children,
  distance = 1,
  start = "top top",
  disabled = false,
  ...rest
}: PinProps) {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const ref = useScrollAnimation<HTMLDivElement>(
    ({ element, ScrollTrigger }) => {
      ScrollTrigger.create({
        trigger: element,
        start,
        end: `+=${Math.max(0, distance) * 100}%`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });
    },
    { enabled: shouldDriveOnScroll({ reducedMotion, tier }) && !disabled },
  );

  return (
    <div ref={ref} {...rest}>
      {children}
    </div>
  );
}
