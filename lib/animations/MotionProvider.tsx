"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { shouldEnableSmoothScroll } from "./motionMode";

/**
 * Global motion provider: smooth scroll (Lenis) + GSAP ScrollTrigger, driven by
 * a SINGLE gsap ticker (no competing rAF). Gated off for reduced-motion /
 * low-tier devices (native scroll, zero animation). Touches scroll ONLY - never
 * the Hero's own pointer / IntersectionObserver handlers.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const enabled = shouldEnableSmoothScroll({ reducedMotion, tier });

  useEffect(() => {
    if (!enabled) return;

    // Scroll-driven scenes (the card deck, etc.) must always play from their
    // start. Don't let the browser restore a mid-page scroll on reload - that
    // would resume with the deck already spread/flipped. Pin to the top before
    // Lenis reads the initial scroll position.
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(refresh).catch(() => {});
    }

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", refresh);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy();
    };
  }, [enabled]);

  return <>{children}</>;
}
