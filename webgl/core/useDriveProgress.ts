"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useScrollAnimation } from "@/lib/animations/useScrollAnimation";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { shouldDriveOnScroll } from "@/lib/animations/scrollAnimationMode";

export interface DriveProgressOptions {
  /** ScrollTrigger start (default "top bottom"). */
  start?: string;
  /** ScrollTrigger end (default "bottom top"). */
  end?: string;
  /** Pin the trigger element while it scrubs (holds the section on screen). */
  pin?: boolean;
}

/**
 * The ONLY bridge from scroll to an r3f scene. A scrubbed ScrollTrigger (built
 * through `useScrollAnimation`, so it inherits the gate + `ctx.revert()`
 * cleanup) writes scroll progress (0→1) into a plain ref — no React state, no
 * re-render per frame. The scene reads `progressRef.current` inside `useFrame`.
 * This keeps everything on the single Lenis/GSAP ticker (no competing rAF).
 * Gated to high-tier (scrubbed motion); low/reduced get a static scene.
 */
export function useDriveProgress<T extends HTMLElement = HTMLElement>({
  start = "top bottom",
  end = "bottom top",
  pin = false,
}: DriveProgressOptions = {}): {
  triggerRef: RefObject<T | null>;
  progressRef: RefObject<number>;
} {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const progressRef = useRef(0);

  const triggerRef = useScrollAnimation<T>(
    ({ element, ScrollTrigger }) => {
      ScrollTrigger.create({
        trigger: element,
        start,
        end,
        scrub: true,
        // Pin holds the section on screen while it scrubs — used by the mobile
        // hero so the page doesn't scroll past until 飛龍 finishes writing.
        pin: pin ? element : false,
        anticipatePin: pin ? 1 : 0,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      });
    },
    { enabled: shouldDriveOnScroll({ reducedMotion, tier }) },
  );

  return { triggerRef, progressRef };
}
