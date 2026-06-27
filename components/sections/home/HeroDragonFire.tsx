"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";
import { FEI_MEDIANS, LONG_MEDIANS } from "@/webgl/core/dragonGlyphMedians";

interface FlamePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// How small the name is (each char fits a cell this wide), how dense the trace
// is, and how fast the flame flows along the stroke.
const CELL_FRACTION = 0.26; // of viewport width
const CELL_MAX = 120; // px ceiling, so it stays small on big phones
const STEP_PX = 5; // splat spacing along a stroke (denser = smoother line)
const FLOW = 22; // tangential flame speed
const RISE = 10; // gentle upward bias (fire rises)

/**
 * Map one character's stroke medians into ordered flame points in CSS pixels,
 * centred on (cx, cy) inside a square `cell`. Data y increases UPWARD, so we
 * flip it. Points are interpolated ALONG each stroke (not across strokes: the
 * pen lifts between strokes) and carry a velocity along the stroke tangent.
 */
function buildCharPoints(
  strokes: number[][][],
  cx: number,
  cy: number,
  cell: number,
): FlamePoint[] {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const stroke of strokes) {
    for (const [x, y] of stroke) {
      const fy = -y; // flip to screen space
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (fy < minY) minY = fy;
      if (fy > maxY) maxY = fy;
    }
  }
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  const scale = Math.min(cell / w, cell / h);
  const ox = cx - (minX + w / 2) * scale;
  const oy = cy - (minY + h / 2) * scale;
  const map = (x: number, y: number) => ({ x: ox + x * scale, y: oy + -y * scale });

  const pts: FlamePoint[] = [];
  for (const stroke of strokes) {
    const m = stroke.map(([x, y]) => map(x, y));
    for (let i = 0; i < m.length - 1; i++) {
      const a = m[i];
      const b = m[i + 1];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const len = Math.hypot(dx, dy) || 1;
      const steps = Math.max(1, Math.round(len / STEP_PX));
      const ux = dx / len;
      const uy = dy / len;
      for (let k = 0; k < steps; k++) {
        const t = k / steps;
        pts.push({
          x: a.x + dx * t,
          y: a.y + dy * t,
          vx: ux * FLOW,
          vy: -uy * FLOW - RISE,
        });
      }
    }
    const last = m[m.length - 1];
    if (last) pts.push({ x: last.x, y: last.y, vx: 0, vy: -RISE });
  }
  return pts;
}

/**
 * Build the full ordered trace: 飛 stacked on top of 龍, both small and centred.
 * The fire follows this list in order, so it "writes" the name along the lines.
 */
function computePoints(W: number, H: number): FlamePoint[] {
  const cell = Math.min(W * CELL_FRACTION, CELL_MAX);
  const gap = cell * 0.14;
  const centerY = H * 0.46;
  const cx = W / 2;
  return [
    ...buildCharPoints(FEI_MEDIANS, cx, centerY - (cell + gap) / 2, cell),
    ...buildCharPoints(LONG_MEDIANS, cx, centerY + (cell + gap) / 2, cell),
  ];
}

/**
 * Mobile hero (spec 030/032): the fire **writes** 飛龍 by tracing the stroke
 * CENTERLINES in writing order (not a top-to-bottom raster) as the visitor
 * scrolls, driven by `progressRef` from the locked hero. Small and centred.
 * Pauses off-screen. Decorative → aria-hidden. (Desktop keeps the touch-reactive
 * HeroCanvas; reduced-motion / no-webgl shows the static poster.)
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
      densityDissipation: 1.3, // let the drawn strokes linger while writing
      velocityDissipation: 2.2,
      pressure: 0.8,
      curl: 6,
      splatRadius: 0.0045, // thin flame line (much smaller)
      splatForce: 1800,
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

    let points = computePoints(container.clientWidth, container.clientHeight);
    const recompute = () => {
      points = computePoints(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", recompute);

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
