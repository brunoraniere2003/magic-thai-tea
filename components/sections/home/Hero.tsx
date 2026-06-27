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

// The animated layers never render on the server (browser-only APIs).
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);
const HeroDragonFire = dynamic(
  () => import("./HeroDragonFire").then((m) => m.HeroDragonFire),
  { ssr: false },
);

/**
 * Hero orchestrator. Content + poster are server-rendered (instant). On a
 * capable device we layer an animation: the reactive fluid on desktop, or — on
 * phones (spec 030) — the fire that *writes* 飛龍 as you scroll. In write mode
 * the hero is pinned, so the page holds until the characters finish.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const webglSupported = useWebGLSupported();
  const isMobile = useIsMobile();

  const animate = shouldAnimateHero({ tier, reducedMotion, webglSupported });
  const writeMode = animate && isMobile;

  // Pinned scrub only in write mode (mobile): holds the hero while 飛龍 writes.
  const { triggerRef, progressRef } = useDriveProgress<HTMLElement>({
    start: "top top",
    end: "+=80%",
    pin: writeMode,
  });

  const animation = isMobile ? (
    <HeroDragonFire progressRef={progressRef} />
  ) : (
    <HeroCanvas />
  );

  return (
    <section
      ref={triggerRef}
      className="relative flex min-h-screen flex-col overflow-hidden"
    >
      <HeroPoster />
      {animate ? animation : null}
      <HeroContent />
    </section>
  );
}
