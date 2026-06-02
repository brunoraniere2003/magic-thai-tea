"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Background behind the Hero (and the default for reduced-motion / low-tier /
 * mobile). A placeholder atmospheric image with a subtle mouse parallax for
 * depth. Purely decorative → aria-hidden. Respects prefers-reduced-motion.
 */
export function HeroPoster() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return; // no parallax when the user asked for less motion
    }

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let raf = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      targetX = (event.clientX / window.innerWidth - 0.5) * -36;
      targetY = (event.clientY / window.innerHeight - 0.5) * -36;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.06;
      currentY += (targetY - currentY) * 0.06;
      layer.style.transform = `scale(1.12) translate3d(${currentX}px, ${currentY}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-stage">
      <div ref={layerRef} className="absolute inset-0 will-change-transform">
        <Image
          src="/images/hero-ethan-tea.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </div>
      {/* light scrim so the headline stays legible without hiding the photo */}
      <div className="absolute inset-0 bg-stage/30" />
      {/* vertical gradient: heavier at the top (eyebrow) and bottom (CTAs) */}
      <div className="absolute inset-0 bg-gradient-to-b from-stage/70 via-stage/15 to-stage/85" />
      {/* warm golden glow rising from the bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_125%,rgba(224,160,64,0.16),transparent_60%)]" />
    </div>
  );
}
