"use client";

import { useState, useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * Tracks whether the element is in the viewport. Scenes use `active` to switch
 * the r3f frameloop on/off → zero GPU work while scrolled away (and frees the
 * WebGL context discipline that iOS needs).
 */
export function useInViewActive<T extends HTMLElement = HTMLDivElement>(): {
  ref: RefObject<T | null>;
  active: boolean;
} {
  const ref = useRef<T>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      // Mount the scene a bit before it scrolls in, so WebGL is ready (no flash).
      { threshold: 0, rootMargin: "300px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, active };
}
