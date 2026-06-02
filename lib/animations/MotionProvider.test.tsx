import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/react";

const h = vi.hoisted(() => {
  const lenisInstance = { on: vi.fn(), raf: vi.fn(), destroy: vi.fn() };
  return {
    state: { reducedMotion: false, tier: "high" as "high" | "low" },
    lenisInstance,
    LenisMock: vi.fn(function () {
      return lenisInstance;
    }),
    ticker: { add: vi.fn(), remove: vi.fn(), lagSmoothing: vi.fn() },
    registerPlugin: vi.fn(),
    ScrollTrigger: { update: vi.fn(), refresh: vi.fn(), getAll: vi.fn(() => []) },
  };
});

vi.mock("lenis", () => ({ default: h.LenisMock }));
vi.mock("gsap", () => ({
  default: { registerPlugin: h.registerPlugin, ticker: h.ticker },
}));
vi.mock("gsap/ScrollTrigger", () => ({ ScrollTrigger: h.ScrollTrigger }));
vi.mock("@/lib/hooks/useReducedMotion", () => ({
  useReducedMotion: () => h.state.reducedMotion,
}));
vi.mock("@/lib/hooks/useDeviceTier", () => ({
  useDeviceTier: () => h.state.tier,
}));

import { MotionProvider } from "./MotionProvider";

describe("MotionProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    h.state.reducedMotion = false;
    h.state.tier = "high";
  });

  it("starts Lenis and the gsap ticker when enabled", () => {
    render(
      <MotionProvider>
        <div>child</div>
      </MotionProvider>,
    );
    expect(h.LenisMock).toHaveBeenCalledTimes(1);
    expect(h.ticker.add).toHaveBeenCalled();
  });

  it("does NOT start Lenis when reduced motion is preferred", () => {
    h.state.reducedMotion = true;
    render(
      <MotionProvider>
        <div>child</div>
      </MotionProvider>,
    );
    expect(h.LenisMock).not.toHaveBeenCalled();
  });

  it("does NOT start Lenis on a low-tier device", () => {
    h.state.tier = "low";
    render(
      <MotionProvider>
        <div>child</div>
      </MotionProvider>,
    );
    expect(h.LenisMock).not.toHaveBeenCalled();
  });

  it("cleans up (destroy + ticker.remove) on unmount", () => {
    const { unmount } = render(
      <MotionProvider>
        <div>child</div>
      </MotionProvider>,
    );
    unmount();
    expect(h.lenisInstance.destroy).toHaveBeenCalled();
    expect(h.ticker.remove).toHaveBeenCalled();
  });

  it("renders its children", () => {
    const { getByText } = render(
      <MotionProvider>
        <div>visible-child</div>
      </MotionProvider>,
    );
    expect(getByText("visible-child")).toBeInTheDocument();
  });
});
