"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` on the client (applies the initial animation state BEFORE
 * paint → no flash), `useEffect` on the server (avoids the SSR warning). This is
 * the standard isomorphic pattern GSAP itself recommends.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
