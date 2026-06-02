"use client";

import { Canvas } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import type { ReactNode } from "react";

export interface R3FCanvasProps {
  /** When false the frameloop is paused (off-screen) → zero GPU. */
  active: boolean;
  children: ReactNode;
}

/**
 * Shared r3f <Canvas> shell with the non-negotiables baked in: frameloop paused
 * off-screen, capped dpr + AdaptiveDpr (mobile fill-rate), transparent. One
 * canvas per section (unmounted when scrolled away → WebGL context released).
 */
export function R3FCanvas({ active, children }: R3FCanvasProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
    >
      <AdaptiveDpr pixelated />
      {children}
    </Canvas>
  );
}
