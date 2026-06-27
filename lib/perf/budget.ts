import type { DeviceTier } from "@/lib/hooks/useDeviceTier";

/**
 * Shared performance budget - see docs/constitution.md §3 and blueprint §9.
 * These are hard targets; the CI perf gate fails the build when exceeded.
 */
export const PERF_BUDGET = {
  /** Largest Contentful Paint, ms. */
  lcpMs: 2500,
  /** Interaction to Next Paint, ms. */
  inpMs: 200,
  /** Cumulative Layout Shift. */
  cls: 0.1,
  /** Max WebGL draw calls on low-tier devices. */
  maxDrawCallsLow: 50,
  /** Max WebGL draw calls on high-tier devices. */
  maxDrawCallsHigh: 100,
  /** Target frame rate. */
  targetFps: 60,
} as const;

/** True when the given draw-call count fits the budget for the device tier. */
export function isWithinDrawCallBudget(
  drawCalls: number,
  tier: DeviceTier,
): boolean {
  const max =
    tier === "low" ? PERF_BUDGET.maxDrawCallsLow : PERF_BUDGET.maxDrawCallsHigh;
  return drawCalls <= max;
}
