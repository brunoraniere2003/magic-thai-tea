import type { DeviceTier } from "@/lib/hooks/useDeviceTier";

export interface HeroModeInput {
  tier: DeviceTier;
  reducedMotion: boolean;
  webglSupported: boolean;
}

/**
 * Pure gating decision for the Hero's reactive fluid.
 * Animate ONLY on a capable device, with WebGL, and no reduced-motion request.
 * Otherwise the static poster is shown (the safe default).
 */
export function shouldAnimateHero({
  tier,
  reducedMotion,
  webglSupported,
}: HeroModeInput): boolean {
  return tier === "high" && !reducedMotion && webglSupported;
}
