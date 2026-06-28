"use client";

import dynamic from "next/dynamic";
import { HeroContent } from "./HeroContent";
import { HeroPoster } from "./HeroPoster";
import { shouldAnimateHero } from "./heroMode";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { useWebGLSupported } from "@/lib/hooks/useWebGLSupported";
import { useIsMobile } from "@/lib/hooks/useIsMobile";
import { useDriveProgress } from "@/webgl/core/useDriveProgress";

// The animated layer never renders on the server (browser-only APIs). The
// mobile fire (HeroDragonFire) is intentionally NOT imported here while the
// mobile-perf test (spec 053) is in flight; restore it from git history when
// re-enabling the mobile hero animation.
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

/**
 * Hero orchestrator. Content and poster are server-rendered (instant). On a
 * capable device we layer an animation: the reactive fluid on desktop, or, on
 * phones (spec 037), the fire that SWEEPS in lines toward each line of hero copy
 * as you scroll.
 *
 * In write mode the section is taller than the viewport and its inner layer is
 * `sticky`, so the hero stays LOCKED on screen while the scroll drives the
 * sweep (this sticky trick works with Lenis, unlike a ScrollTrigger pin). The
 * page only moves on past the hero once the sweep is finished.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const webglSupported = useWebGLSupported();
  const isMobile = useIsMobile();

  const animate = shouldAnimateHero({ tier, reducedMotion, webglSupported });
  // Mobile hero is STATIC for the perf test (spec 053): no fire animation, no
  // scroll lock, just the poster + content. Desktop keeps the reactive fluid.
  const animateDesktop = animate && !isMobile;

  const { triggerRef, progressRef } = useDriveProgress<HTMLElement>({
    start: "top top",
    end: "+=80%",
  });
  void progressRef; // hero fire (which read it) is disabled on mobile for now

  return (
    <section ref={triggerRef} className="relative min-h-screen">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <HeroPoster />
        {animateDesktop ? <HeroCanvas /> : null}
        <HeroContent />
      </div>
    </section>
  );
}
