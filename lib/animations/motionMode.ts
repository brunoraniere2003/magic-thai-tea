import type { DeviceTier } from "@/lib/hooks/useDeviceTier";

export interface MotionModeInput {
  reducedMotion: boolean;
  tier: DeviceTier;
}

/**
 * Pure gating for smooth scroll / scroll-driven animation.
 * Enable ONLY on a capable device with no reduced-motion request.
 * (Mirrors the pattern of `shouldAnimateHero` in heroMode.ts.)
 */
export function shouldEnableSmoothScroll({
  reducedMotion,
  tier,
}: MotionModeInput): boolean {
  return !reducedMotion && tier === "high";
}
