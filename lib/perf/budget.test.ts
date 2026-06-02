import { describe, it, expect } from "vitest";
import { PERF_BUDGET, isWithinDrawCallBudget } from "@/lib/perf/budget";

describe("performance budget", () => {
  it("exposes the Core Web Vitals targets", () => {
    expect(PERF_BUDGET.lcpMs).toBe(2500);
    expect(PERF_BUDGET.inpMs).toBe(200);
    expect(PERF_BUDGET.cls).toBe(0.1);
  });

  it("caps draw calls at 50 for low-tier devices", () => {
    expect(isWithinDrawCallBudget(50, "low")).toBe(true);
    expect(isWithinDrawCallBudget(51, "low")).toBe(false);
  });

  it("allows up to 100 draw calls for high-tier devices", () => {
    expect(isWithinDrawCallBudget(100, "high")).toBe(true);
    expect(isWithinDrawCallBudget(101, "high")).toBe(false);
  });
});
