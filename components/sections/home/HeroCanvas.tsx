"use client";

import { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

/**
 * The reactive fluid layer — Pavel Dobryakov's WebGL fluid (MIT), via
 * webgl-fluid-enhanced. GPU-bound; gated to high-tier devices by <Hero>
 * and paused when scrolled out of view. Decorative only → aria-hidden.
 */
export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const simulation = new WebGLFluidEnhanced(container);
    simulation.setConfig({
      simResolution: 128,
      dyeResolution: 1024,
      densityDissipation: 2.6,
      velocityDissipation: 1.8,
      pressure: 0.8,
      curl: 12,
      splatRadius: 0.2,
      splatForce: 6000,
      shading: true,
      colorful: false,
      colorPalette: ["#ff6a1a", "#e0a040", "#c9762e", "#ffb347"],
      hover: true,
      transparent: true,
      brightness: 0.5,
      bloom: true,
      bloomIntensity: 0.55,
      sunrays: false,
    });
    simulation.start();

    // Pause the simulation while the Hero is scrolled out of view.
    let running = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          simulation.togglePause();
          running = true;
        } else if (!entry.isIntersecting && running) {
          simulation.togglePause();
          running = false;
        }
      },
      { threshold: 0 },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      simulation.stop();
    };
  }, []);

  // Outer wrapper stays absolute (out of flow); the library mutates the
  // inner container's style (position/display), so we isolate it here.
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
