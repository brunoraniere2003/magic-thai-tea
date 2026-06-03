"use client";

import type { ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { useDeviceTier } from "@/lib/hooks/useDeviceTier";
import { useWebGLSupported } from "@/lib/hooks/useWebGLSupported";
import { shouldRender3D } from "@/lib/animations/scrollAnimationMode";
import { useInViewActive } from "./useInViewActive";

export interface Stage3DProps {
  /** Static fallback — ALWAYS rendered first (shell before WebGL, SSR-safe). */
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
  const { ref, active } = useInViewActive<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      {poster}
      {/* The scene mounts only while in view: it's then born with active=true,
          so the Canvas starts in frameloop "always" (the "never"→"always" switch
          never fires, which r3f doesn't resume from) and the WebGL context is
          released when scrolled away. */}
      {enabled && active ? (
        <div
          aria-hidden
          className={`absolute inset-0 ${interactive ? "" : "pointer-events-none"}`}
        >
          {renderScene(active)}
        </div>
      ) : null}
    </div>
  );
}
