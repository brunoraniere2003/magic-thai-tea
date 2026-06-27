"use client";

import { useEffect, useRef } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

/**
 * The reactive fluid layer - Pavel Dobryakov's WebGL fluid (MIT), via
 * webgl-fluid-enhanced. GPU-bound; gated to capable devices by <Hero> and
 * paused when scrolled out of view. Decorative only → aria-hidden.
 *
 * Driven from window pointer events, which cover mouse AND touch (so it
 * reacts to a finger drag on mobile too). The library normalises X by
 * canvas.width (device px) but Y by canvas.clientHeight (CSS px), so X is
 * scaled by devicePixelRatio and Y is not.
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
      splatRadius: 0.08,
      splatForce: 4500,
      shading: true,
      colorful: false,
      colorPalette: ["#ff6a1a", "#e0a040", "#c9762e", "#ffb347"],
      hover: false,
      transparent: true,
      brightness: 0.4,
      bloom: true,
      bloomIntensity: 0.4,
      sunrays: false,
    });
    simulation.start();
    simulation.multipleSplats(2);

    const splatAt = (x: number, y: number, dx: number, dy: number) => {
      const dpr = window.devicePixelRatio || 1;
      simulation.splatAtLocation(x * dpr, y, dx, dy);
    };

    let lastX = 0;
    let lastY = 0;
    let seeded = false;

    // Map the pointer to the canvas's own box so the splat lands under the
    // finger/cursor even after the page has scrolled. Returns null when the
    // pointer is outside the Hero (so other sections never trigger splats).
    const toCanvas = (
      event: PointerEvent,
    ): { x: number; y: number } | null => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
      return { x, y };
    };

    const onPointerMove = (event: PointerEvent) => {
      const point = toCanvas(event);
      if (!point) {
        seeded = false; // pointer left the Hero - restart tracking on return
        return;
      }
      if (seeded) {
        const dx = point.x - lastX;
        const dy = point.y - lastY;
        if (Math.abs(dx) + Math.abs(dy) > 2) {
          splatAt(point.x, point.y, dx * 5, dy * 5);
        }
      }
      lastX = point.x;
      lastY = point.y;
      seeded = true;
    };

    // On press/touch-start: reset tracking (so a new touch elsewhere doesn't
    // fire one huge cross-screen splat) and a gentle puff where it lands.
    const onPointerDown = (event: PointerEvent) => {
      const point = toCanvas(event);
      if (!point) return;
      lastX = point.x;
      lastY = point.y;
      seeded = true;
      splatAt(point.x, point.y, 0, -60);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });

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
      window.removeEventListener("pointerdown", onPointerDown);
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
