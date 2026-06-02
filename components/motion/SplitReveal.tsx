"use client";

import { createElement } from "react";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { useSplitReveal } from "@/lib/animations/useSplitReveal";

export interface SplitRevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Element to render (default `h2`). Use for the heading level. */
  as?: ElementType;
}

/**
 * A heading that reveals line by line (kinetic type). Static under reduced
 * motion. Children should be text (optionally with inline coloured spans).
 */
export function SplitReveal({ children, as, ...rest }: SplitRevealProps) {
  const Tag = (as ?? "h2") as ElementType;
  const ref = useSplitReveal<HTMLElement>();
  return createElement(Tag, { ref, ...rest }, children);
}
