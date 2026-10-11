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
      {/* The poster is the accessible layer, so it stays in the DOM either way.
          With the 3D OFF (no-WebGL / reduced-motion / low-tier) it paints as the
          visible stage. With the 3D ON it is taken out of the picture visually -
          otherwise its full-bleed cards bleed past the smaller 3D deck - but
          kept for assistive tech, because the r3f canvas beside it is
          aria-hidden and exposes nothing. Without this the whole section reads
          as an empty heading to a screen reader and is skipped by Tab. */}
      {enabled ? (
        /* focus-within brings it back on screen the moment a keyboard reaches
           one of its cards, so the poster is never an invisible tab stop. */
        <div className="sr-only focus-within:not-sr-only focus-within:absolute focus-within:inset-0 focus-within:z-20 focus-within:h-full focus-within:overflow-y-auto focus-within:bg-stage">
          {poster}
        </div>
      ) : (
        poster
      )}
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
