/**
 * Shared smooth in-page scrolling, used by the header, the hero CTAs and the
 * cards' Book button so every "jump" on the page glides instead of snapping.
 * (Browsers fall back to an instant jump under prefers-reduced-motion.)
 */

/** Smoothly scroll to an in-page anchor (href like "#contact"). */
export function scrollToAnchor(href: string): void {
  if (!href.startsWith("#")) return;
  document
    .getElementById(href.slice(1))
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Smoothly scroll back to the very top of the page. */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
