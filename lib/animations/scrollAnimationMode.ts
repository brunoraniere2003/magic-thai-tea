import type { DeviceTier } from "@/lib/hooks/useDeviceTier";

export interface RevealModeInput {
  reducedMotion: boolean;
}

export interface DriveModeInput {
  reducedMotion: boolean;
  tier: DeviceTier;
}

/**
 * Discrete reveals (fade / rise once on enter) are cheap — they run on EVERY
 * device and are disabled ONLY by a reduced-motion request. This honors the
 * product goal of great motion on mobile too.
 */
export function shouldRevealOnScroll({
  reducedMotion,
}: RevealModeInput): boolean {
  return !reducedMotion;
}

/**
 * Continuous scroll-driven effects (parallax scrub, pin) are heavier — they run
 * ONLY on a capable device with no reduced-motion request. Otherwise the static
 * base (which is already the final state) is shown. Mirrors smooth-scroll gating.
 */
export function shouldDriveOnScroll({
  reducedMotion,
  tier,
}: DriveModeInput): boolean {
  return !reducedMotion && tier === "high";
}
