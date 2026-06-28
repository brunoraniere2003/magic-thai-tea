"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

interface FlamePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Fallback lane y-fractions if the hero copy can't be measured.
const LANES_FALLBACK = [0.31, 0.4, 0.49, 0.58, 0.66, 0.72];
const SIDE_MARGIN = 0.08; // start/end this far from the edges (fraction of width)
const STEP_PX = 7; // splat spacing along a lane
const FLOW = 34; // horizontal flame speed (the sweep)
const CURVE = 0.045; // lane bow as a fraction of height (slightly curved)

/**
 * One sweep line per line of hero copy, placed at the MEASURED vertical centre
 * of each `[data-fire-line]` element (eyebrow / title / subtitle / both
 * buttons), so the flame really runs toward each text and button. Each lane is a
 * straight, gently-curved horizontal line ordered in its sweep direction
 * (alternating left→right / right→left). The flame follows this list as the
 * locked hero scrolls, sweeping lane by lane.
 */
function computePoints(container: HTMLElement): FlamePoint[] {
  const W = container.clientWidth;
  const H = container.clientHeight;
  const cTop = container.getBoundingClientRect().top;

  const section = container.closest("section");
  const measured = section
    ? Array.from(section.querySelectorAll<HTMLElement>("[data-fire-line]"))
        .map((el) => {
          const r = el.getBoundingClientRect();
          return (r.top + r.bottom) / 2 - cTop; // vertical centre, container-relative
        })
        .filter((y) => y > 0 && y < H)
        .sort((a, b) => a - b)
    : [];
  const laneYs = measured.length ? measured : LANES_FALLBACK.map((f) => H * f);

  const pts: FlamePoint[] = [];
  const margin = W * SIDE_MARGIN;
  laneYs.forEach((y0, k) => {
    const ltr = k % 2 === 0; // alternate direction per lane
    const xStart = ltr ? margin : W - margin;
    const xEnd = ltr ? W - margin : margin;
    const dir = ltr ? 1 : -1;
    const span = Math.abs(xEnd - xStart) || 1;
    const n = Math.max(2, Math.round(span / STEP_PX));
    const bow = (ltr ? -1 : 1) * H * CURVE; // gentle arc, alternating up/down
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      pts.push({
        x: xStart + (xEnd - xStart) * t,
        y: y0 + bow * Math.sin(Math.PI * t),
        vx: dir * FLOW,
        vy: -6, // slight lift
      });
    }
  });
  return pts;
}

/**
 * Mobile hero (spec 037): the fire SWEEPS across the hero in straight, gently
 * curved horizontal lines, one per line of copy (eyebrow / title / subtitle /
 * buttons), alternating left↔right, driven by `progressRef` from the locked
 * hero (it stays pinned until the sweep finishes). Pauses off-screen.
 * Decorative → aria-hidden. (Desktop keeps the touch-reactive HeroCanvas;
 * reduced-motion / no-webgl shows the static poster.)
 */
export function HeroDragonFire({
  progressRef,
}: {
  progressRef: RefObject<number>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const sim = new WebGLFluidEnhanced(container);
    sim.setConfig({
      simResolution: 128,
      dyeResolution: 1024,
      densityDissipation: 1.9, // each sweep glows then fades as the next runs
      velocityDissipation: 2.2,
      pressure: 0.8,
      curl: 7,
      splatRadius: 0.009, // a flame line you can read as a sweep
      splatForce: 2000,
      shading: true,
      colorful: false,
      colorPalette: ["#ff6a1a", "#e0a040", "#c9762e", "#ffb347"],
      hover: false,
      transparent: true,
      brightness: 0.4,
      bloom: true,
      bloomIntensity: 0.45,
      sunrays: false,
    });
    sim.start();

    let points = computePoints(container);
    const recompute = () => {
      points = computePoints(container);
    };
    window.addEventListener("resize", recompute);
    // Re-measure once the web fonts / layout settle so lanes sit on the copy.
    const t1 = window.setTimeout(recompute, 400);
    const t2 = window.setTimeout(recompute, 1200);

    const dpr = () => window.devicePixelRatio || 1;
    const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
    let lastIdx = 0;
    let raf = 0;
    let running = true;

    const tick = () => {
      if (!running) return;
      const total = points.length;
      if (total > 0) {
        const target = Math.floor(clamp01(progressRef.current) * total);
        if (target < lastIdx) lastIdx = target; // scrubbed back
        let n = 0;
        while (lastIdx < target && n < 28) {
          const p = points[lastIdx];
          sim.splatAtLocation(p.x * dpr(), p.y, p.vx, p.vy);
          lastIdx++;
          n++;
        }
        // Hold: once fully written, keep a gentle glow alive along the strokes.
        if (lastIdx >= total) {
          const base = Math.floor(performance.now() / 110);
          for (let k = 0; k < 3; k++) {
            const p = points[(base + k * 37) % total];
            sim.splatAtLocation(p.x * dpr(), p.y, 0, -8);
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    observer.observe(container);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", recompute);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      sim.stop();
    };
  }, [progressRef]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
