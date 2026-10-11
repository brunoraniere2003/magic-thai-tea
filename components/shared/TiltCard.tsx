"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

export interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Maximum tilt in degrees at the card's corners. */
  max?: number;
}

/**
 * Card that leans toward the cursor (spec 033 / R12).
 *
 * Writes a transform straight to the node on pointer move: no state, no
 * re-render, one GPU property (§5). Skipped entirely on touch, on mouse-less
 * input and under prefers-reduced-motion, where the card stays flat.
 */
export function TiltCard({ children, className = "", max = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const node = ref.current;
    if (!node || reduced || event.pointerType !== "mouse") return;

    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    node.style.transform = `perspective(900px) rotateY(${px * max * 2}deg) rotateX(${-py * max * 2}deg) translateZ(0)`;
  }

  function handleLeave() {
    const node = ref.current;
    if (node) node.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`.trim()}
    >
      {children}
    </div>
  );
}
