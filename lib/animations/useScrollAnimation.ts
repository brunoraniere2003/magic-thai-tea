"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

export interface ScrollAnimationContext {
  element: HTMLElement;
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
}

export type ScrollAnimationBuild = (ctx: ScrollAnimationContext) => void;

/**
 * Lifecycle hook for one scroll-driven animation, agnostic of policy.
 *
 * The caller passes `enabled` (computed from the right gate) and a `build`
 * callback that wires the tween/trigger. We run `build` inside a
 * `gsap.context()` scoped to the element, and on cleanup `ctx.revert()` kills
 * every trigger AND reverts the inline styles back to the base (= final) state.
 * Nothing runs on the server, or when `enabled` is false.
 */
export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  build: ScrollAnimationBuild,
  { enabled }: { enabled: boolean },
): RefObject<T | null> {
  const ref = useRef<T>(null);
  const buildRef = useRef(build);

  // Keep the latest build without re-running the animation effect every render.
  useIsomorphicLayoutEffect(() => {
    buildRef.current = build;
  }, [build]);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      buildRef.current({ element, gsap, ScrollTrigger });
    }, element);

    return () => ctx.revert();
  }, [enabled]);

  return ref;
}
