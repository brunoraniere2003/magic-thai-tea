"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import WebGLFluidEnhanced from "webgl-fluid-enhanced";

const TOP = "飛";
const BOTTOM = "龍";
const GLYPH_FONT = '700 168px "Hiragino Mincho ProN", "Noto Serif SC", serif';

interface Point {
  x: number;
  y: number;
}

/**
 * Sample the two stacked glyphs into an ordered list of points (top→bottom),
 * mapped to a small box centred in the container. The fluid splats these in
 * order as the scroll advances, so the fire "writes" 飛龍.
 */
function computePoints(W: number, H: number): Point[] {
  const offW = 180;
  const offH = 360;
  const canvas = document.createElement("canvas");
  canvas.width = offW;
  canvas.height = offH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = GLYPH_FONT;
  ctx.fillText(TOP, offW / 2, offH * 0.27);
  ctx.fillText(BOTTOM, offW / 2, offH * 0.73);

  const data = ctx.getImageData(0, 0, offW, offH).data;

  // Small box: ~46% of the width, two chars stacked (≈ 2× tall). Centred.
  const boxW = Math.min(W * 0.46, 230);
  const boxH = boxW * 1.95;
  const cx = W / 2;
  const cy = H / 2;

  const pts: Point[] = [];
  const step = 5;
  for (let oy = 0; oy < offH; oy += step) {
    for (let ox = 0; ox < offW; ox += step) {
      if (data[(oy * offW + ox) * 4 + 3] > 80) {
        pts.push({
          x: cx + (ox / offW - 0.5) * boxW,
          y: cy + (oy / offH - 0.5) * boxH,
        });
      }
    }
  }
  return pts;
}

/**
 * Mobile hero (spec 030): the fire **writes** the characters 飛龍 (stacked
 * vertically, small) as the visitor scrolls - as if a finger drew them - driven
 * by `progressRef` from the pinned hero ScrollTrigger. No touch needed. Pauses
 * off-screen. Decorative → aria-hidden. (Desktop keeps the touch-reactive
 * HeroCanvas; reduced-motion/no-webgl shows the static poster.)
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
      densityDissipation: 2.2,
      velocityDissipation: 2.0,
      pressure: 0.8,
      curl: 8,
      splatRadius: 0.012,
      splatForce: 2200,
      shading: true,
      colorful: false,
      colorPalette: ["#ff6a1a", "#e0a040", "#c9762e", "#ffb347"],
      hover: false,
      transparent: true,
      brightness: 0.4,
      bloom: true,
      bloomIntensity: 0.5,
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
        while (lastIdx < target && n < 12) {
          const pt = points[lastIdx];
          sim.splatAtLocation(pt.x * dpr(), pt.y, 0, -30);
          lastIdx++;
          n++;
        }
        // Hold: once fully written, keep a gentle glow alive on the strokes.
        if (lastIdx >= total) {
          const base = Math.floor(performance.now() / 90);
          for (let k = 0; k < 3; k++) {
            const pt = points[(base + k * 41) % total];
            sim.splatAtLocation(pt.x * dpr(), pt.y, 0, -12);
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
