"use client";

import { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

/**
 * The reactive fluid layer — Pavel Dobryakov's WebGL fluid (MIT), via
 * webgl-fluid-enhanced. GPU-bound; gated to high-tier devices by <Hero>
 * and paused when scrolled out of view. Decorative only → aria-hidden.
 *
 * We drive the splats ourselves from window pointer events. The library
 * normalises X by canvas.width (device px) but Y by canvas.clientHeight
 * (CSS px), so X must be scaled by devicePixelRatio and Y must not.
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
      densityDissipation: 3.4,
      velocityDissipation: 2.2,
      pressure: 0.8,
      curl: 9,
      splatRadius: 0.08, // small, delicate trail
      splatForce: 4500,
      shading: true,
      colorful: false,
      colorPalette: ["#ff6a1a", "#e0a040", "#c9762e", "#ffb347"],
      hover: false, // we drive the splats ourselves (below)
      transparent: true,
      brightness: 0.4,
      bloom: true,
      bloomIntensity: 0.4,
      sunrays: false,
    });
    simulation.start();
    // A couple of small splats so there's a hint of life before moving.
    simulation.multipleSplats(2);

    let lastX = 0;
    let lastY = 0;
    let seeded = false;
    const onPointerMove = (event: PointerEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      if (seeded) {
        const dx = x - lastX;
        const dy = y - lastY;
        if (Math.abs(dx) + Math.abs(dy) > 2) {
          const dpr = window.devicePixelRatio || 1;
          // X scaled by dpr (canvas.width is device px); Y left as CSS px.
          simulation.splatAtLocation(x * dpr, y, dx * 5, dy * 5);
        }
      }
      lastX = x;
      lastY = y;
      seeded = true;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // Pause while scrolled out of view.
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
      window.removeEventListener("pointermove", onPointerMove);
      observer.disconnect();
      simulation.stop();
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
