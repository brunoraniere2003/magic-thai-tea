"use client";

import dynamic from "next/dynamic";
import { HeroContent } from "./HeroContent";
import { HeroPoster } from "./HeroPoster";
import { shouldAnimateHero } from "./heroMode";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { useWebGLSupported } from "@/lib/hooks/useWebGLSupported";
import { useIsMobile } from "@/lib/hooks/useIsMobile";

// The animated layers never render on the server (browser-only APIs).
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);
const HeroDragonCanvas = dynamic(
  () => import("./HeroDragonCanvas").then((m) => m.HeroDragonCanvas),
  { ssr: false },
);

/**
 * Hero orchestrator. The content + poster are server-rendered (instant). On a
 * capable device we layer an animation on top: the reactive fluid on desktop,
 * or the 飛龍 fire glyphs on phones (spec 029).
 */
export function Hero() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const webglSupported = useWebGLSupported();
  const isMobile = useIsMobile();

  const animate = shouldAnimateHero({ tier, reducedMotion, webglSupported });
  const animation = isMobile ? <HeroDragonCanvas /> : <HeroCanvas />;

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <HeroPoster />
      {animate ? animation : null}
      <HeroContent />
    </section>
  );
}
