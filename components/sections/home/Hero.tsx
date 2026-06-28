"use client";

import dynamic from "next/dynamic";
import { HeroContent } from "./HeroContent";
import { HeroPoster } from "./HeroPoster";
import { shouldAnimateHero } from "./heroMode";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { useWebGLSupported } from "@/lib/hooks/useWebGLSupported";

// Browser-only canvas (touch + pointer reactive fluid). Same animation on both
// mobile and desktop now; HeroCanvas already binds pointer events that fire for
// finger drags too.
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

/**
 * Hero orchestrator. Poster + content are server-rendered (instant LCP). On a
 * capable device the reactive WebGL fluid is layered on top — finger drag on
 * mobile, mouse / pointer on desktop. On phones the section is 210vh tall with
 * a CSS sticky inner layer, so the hero stays LOCKED on screen for 110vh of
 * scroll before the page moves on. Desktop is a single viewport tall (no lock).
 */
export function Hero() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const webglSupported = useWebGLSupported();
  const animate = shouldAnimateHero({ tier, reducedMotion, webglSupported });

  return (
    <section className="relative h-[210vh] md:h-screen">
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <HeroPoster />
        {animate ? <HeroCanvas /> : null}
        <HeroContent />
      </div>
    </section>
  );
}
