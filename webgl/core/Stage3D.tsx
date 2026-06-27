"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { useWebGLSupported } from "@/lib/hooks/useWebGLSupported";
import { shouldRender3D } from "@/lib/animations/scrollAnimationMode";

export interface Stage3DProps {
  /** Static fallback - ALWAYS rendered first (shell before WebGL, SSR-safe). */
  poster: ReactNode;
  /** Returns the (dynamically-imported) r3f scene. Only called when gated on. */
  renderScene: (active: boolean) => ReactNode;
  /** Wrapper classes; provide the box (e.g. `absolute inset-0`). */
  className?: string;
  /** When true, the 3D layer receives pointer events (a clickable scene). */
  interactive?: boolean;
}

/**
 * The gated 3D mount. The poster paints on every device (and on the server);
 * the heavy r3f scene is layered over it ONLY on a high-tier device with WebGL
 * and no reduced-motion. The scene pauses while scrolled away. Reduced-motion /
 * low-tier / no-WebGL = poster only, never instantiating WebGL.
 */
export function Stage3D({
  poster,
  renderScene,
  className,
  interactive = false,
}: Stage3DProps) {
  const reducedMotion = useReducedMotion();
  const tier = useDeviceTier();
  const webglSupported = useWebGLSupported();
  const enabled = shouldRender3D({ reducedMotion, tier, webglSupported });

  return (
    <div className={className}>
      {/* Poster paints when the 3D layer is OFF (no-WebGL / reduced-motion /
          low-tier). When the 3D is on we hide the poster - otherwise its full-
          bleed cards bleed past the smaller 3D deck. */}
      {!enabled ? poster : null}
      {/* The scene mounts from the start on every capable device and stays
          mounted (active=true always) so scrolling away and back never shows a
          mount/unmount gap. */}
      {enabled ? (
        <div
          aria-hidden
          className={`absolute inset-0 ${interactive ? "" : "pointer-events-none"}`}
        >
          {renderScene(true)}
        </div>
      ) : null}
    </div>
  );
}
