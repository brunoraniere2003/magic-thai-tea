"use client";

import { useEffect, useRef } from "react";

// Warm fire palette (matches the desktop fluid).
const EMBER = "#ff6a1a";
const GOLD = "#e0a040";
const GOLD_HI = "#ffb347";
const TEXT = "飛龍"; // "flying dragon"

const glyphFont = (size: number) =>
  `700 ${size}px "Hiragino Mincho ProN", "Noto Serif SC", "Songti SC", serif`;

/**
 * Mobile hero (spec 029): the characters 飛龍 drawn in gold and filled with a
 * small, self-animating flame — a much smaller fire than the desktop fluid, and
 * it needs no touch. The gold glyphs are always painted as the legible base; the
 * flame is masked to their strokes on top. Pauses while scrolled off-screen.
 * Decorative → aria-hidden.
 */
export function HeroDragonCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Offscreen flame buffer, masked to the glyphs each frame.
    const flame = document.createElement("canvas");
    const fctx = flame.getContext("2d");
    if (!fctx) return;

    let width = 0;
    let height = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const dw = Math.max(1, Math.floor(width * dpr));
      const dh = Math.max(1, Math.floor(height * dpr));
      canvas.width = dw;
      canvas.height = dh;
      flame.width = dw;
      flame.height = dh;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const fontSize = () => Math.min(width * 0.36, height * 0.3, 220);

    function paintFlame(t: number) {
      const cx = width / 2;
      const cy = height / 2;

      // Vertical gradient: deep low → ember → gold → bright top.
      const grad = fctx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, "#7a1f08");
      grad.addColorStop(0.4, EMBER);
      grad.addColorStop(0.7, GOLD);
      grad.addColorStop(1, GOLD_HI);
      fctx.globalCompositeOperation = "source-over";
      fctx.fillStyle = grad;
      fctx.fillRect(0, 0, width, height);

      // Drifting light blobs → a living flicker.
      fctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 5; i++) {
        const phase = t * 0.0009 + i * 1.7;
        const bx = cx + Math.sin(phase) * width * 0.18;
        const by = cy + Math.cos(phase * 0.8) * height * 0.12;
        const r = (0.18 + 0.06 * Math.sin(phase * 1.3)) * Math.min(width, height);
        const rg = fctx.createRadialGradient(bx, by, 0, bx, by, r);
        rg.addColorStop(0, "rgba(255,179,71,0.5)");
        rg.addColorStop(1, "rgba(255,179,71,0)");
        fctx.fillStyle = rg;
        fctx.beginPath();
        fctx.arc(bx, by, r, 0, Math.PI * 2);
        fctx.fill();
      }

      // Clip the flame to the glyph shape.
      fctx.globalCompositeOperation = "destination-in";
      fctx.fillStyle = "#000";
      fctx.font = glyphFont(fontSize());
      fctx.textAlign = "center";
      fctx.textBaseline = "middle";
      fctx.fillText(TEXT, cx, cy);
      fctx.globalCompositeOperation = "source-over";
    }

    let raf = 0;
    let running = true;
    let start = performance.now();

    function draw(now: number) {
      if (!running) return;
      const t = now - start;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);
      ctx.font = glyphFont(fontSize());
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Gold base glyph (always legible) + soft glow.
      ctx.save();
      ctx.shadowColor = "rgba(224,160,64,0.55)";
      ctx.shadowBlur = 24;
      ctx.fillStyle = "rgba(224,160,64,0.85)";
      ctx.fillText(TEXT, cx, cy);
      ctx.restore();

      // Fiery texture masked inside the glyphs.
      paintFlame(t);
      ctx.globalAlpha = 0.92;
      ctx.drawImage(flame, 0, 0, width, height);
      ctx.globalAlpha = 1;

      // Crisp gold outline.
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(255,179,71,0.6)";
      ctx.strokeText(TEXT, cx, cy);

      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);

    // Pause while scrolled away.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          start = performance.now();
          raf = requestAnimationFrame(draw);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    observer.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
