import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useIsMobile } from "./useIsMobile";

type Listener = () => void;

function mockMatchMedia(matches: boolean) {
  const listeners = new Set<Listener>();
  const mql = {
    matches,
    addEventListener: (_: string, cb: Listener) => listeners.add(cb),
    removeEventListener: (_: string, cb: Listener) => listeners.delete(cb),
  };
  vi.stubGlobal("matchMedia", () => mql);
  return {
    set(next: boolean) {
      mql.matches = next;
      listeners.forEach((cb) => cb());
    },
  };
}

describe("useIsMobile", () => {
  beforeEach(() => vi.unstubAllGlobals());
  afterEach(() => vi.unstubAllGlobals());

  it("returns true when the viewport matches the phone query", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it("returns false on a desktop-width viewport", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
