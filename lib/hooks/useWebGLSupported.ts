"use client";

import { useSyncExternalStore } from "react";

/** Feature-detects WebGL availability (client only). */
export function isWebGLAvailable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

const subscribe = () => () => {};

/** Static sensor: server snapshot is `false`, client detects once. */
export function useWebGLSupported(): boolean {
  return useSyncExternalStore(subscribe, isWebGLAvailable, () => false);
}
