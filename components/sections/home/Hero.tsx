"use client";

import dynamic from "next/dynamic";
import { HeroContent } from "./HeroContent";
import { HeroPoster } from "./HeroPoster";
import { shouldAnimateHero } from "./heroMode";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { useWebGLSupported } from "@/lib/hooks/useWebGLSupported";

// The WebGL layer never renders on the server (browser-only APIs).
const HeroCanvas = dynamic(
  () => import("./HeroCanvas").then((m) => m.HeroCanvas),
  { ssr: false },
);

/**
 * Hero orchestrator. The content + poster are server-rendered (instant);
 * the reactive fluid is layered on top only when the device can handle it.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const webglSupported = useWebGLSupported();

  const animate = shouldAnimateHero({ tier, reducedMotion, webglSupported });

  return (
    <section className="relative flex min-h-screen flex-col overflow-hidden">
      <HeroPoster />
      {animate ? <HeroCanvas /> : null}
      <HeroContent />
    </section>
  );
}
