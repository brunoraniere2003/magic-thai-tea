"use client";

import { useSyncExternalStore } from "react";

export type DeviceTier = "high" | "low";

export interface DeviceSignals {
  hardwareConcurrency?: number;
  deviceMemory?: number;
  effectiveType?: string;
  saveData?: boolean;
  reducedMotion?: boolean;
}

const SLOW_NETWORKS = new Set(["slow-2g", "2g", "3g"]);
const MIN_CORES = 4;
const MIN_MEMORY_GB = 4;

/**
 * Pure, deterministic tier classification.
 * Safe default is "high" - only downgrade on a clear negative signal.
 */
export function classifyDeviceTier(signals: DeviceSignals): DeviceTier {
  const {
    hardwareConcurrency,
    deviceMemory,
    effectiveType,
    saveData,
    reducedMotion,
  } = signals;

  if (reducedMotion) return "low";
  if (saveData) return "low";
  if (effectiveType && SLOW_NETWORKS.has(effectiveType)) return "low";
  if (
    typeof hardwareConcurrency === "number" &&
    hardwareConcurrency < MIN_CORES
  ) {
    return "low";
  }
  if (typeof deviceMemory === "number" && deviceMemory < MIN_MEMORY_GB) {
    return "low";
  }

  return "high";
}

interface NavigatorConnection {
  effectiveType?: string;
  saveData?: boolean;
}

/** Reads the available device signals from the browser (client only). */
export function readDeviceSignals(): DeviceSignals {
  if (typeof navigator === "undefined") return {};

  const connection = (
    navigator as Navigator & { connection?: NavigatorConnection }
  ).connection;

  const reducedMotion =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  return {
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory,
    effectiveType: connection?.effectiveType,
    saveData: connection?.saveData,
    reducedMotion,
  };
}

function subscribeReducedMotion(callback: () => void): () => void {
  if (
    typeof window === "undefined" ||
    typeof window.matchMedia !== "function"
  ) {
    return () => {};
  }
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

/**
 * Client hook. Server snapshot is "high"; on the client it classifies from
 * real device signals and re-evaluates if the motion preference changes.
 */
export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(
    subscribeReducedMotion,
    (): DeviceTier => classifyDeviceTier(readDeviceSignals()),
    (): DeviceTier => "high",
  );
}
