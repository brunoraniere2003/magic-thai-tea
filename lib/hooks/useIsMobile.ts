"use client";

import { useSyncExternalStore } from "react";

// Tailwind's `md` breakpoint - below it is the phone layout (vertical cards,
// 飛龍 fire hero). Mirrors useReducedMotion (SSR-safe via useSyncExternalStore).
const QUERY = "(max-width: 768px)";

function subscribe(callback: () => void): () => void {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => {};
  }
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return false;
  }
  return window.matchMedia(QUERY).matches;
}

/**
 * Returns true on phone-width viewports (≤768px). SSR snapshot is `false`
 * (desktop-first), and it reacts to live viewport changes.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
