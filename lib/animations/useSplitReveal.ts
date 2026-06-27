"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { shouldRevealOnScroll } from "./scrollAnimationMode";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Reveals a heading line by line, each line rising from behind a mask - the
 * "kinetic type" used by award-winning sites. Uses GSAP SplitText (free in
 * 3.15). On reduced motion it does nothing (text stays as-is, visible). The
 * split is reverted on cleanup so the DOM text stays clean for a11y/SEO; the
 * split is (re)built after fonts load so the line breaks are correct.
 */
export function useSplitReveal<
  T extends HTMLElement = HTMLElement,
>(): RefObject<T | null> {
  const ref = useRef<T>(null);
  const reducedMotion = useReducedMotion();
  const enabled = shouldRevealOnScroll({ reducedMotion });

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    let ctx: gsap.Context | undefined;
    const build = () => {
      ctx = gsap.context(() => {
        const split = new SplitText(element, { type: "lines", mask: "lines" });
        gsap.set(split.lines, { yPercent: 115, opacity: 0 });
        // ScrollTrigger.create fires onEnter immediately if the section is
        // already in view at build time (refresh / scrolled reload) - so the
        // text never gets stuck hidden.
        ScrollTrigger.create({
          trigger: element,
          start: "top 85%",
          once: true,
          onEnter: () =>
            gsap.to(split.lines, {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              stagger: 0.12,
            }),
        });
        return () => split.revert();
      }, element);
    };

    const fonts = document.fonts;
    if (fonts && fonts.status !== "loaded") {
      fonts.ready.then(build).catch(build);
    } else {
      build();
    }

    return () => ctx?.revert();
  }, [enabled]);

  return ref;
}
