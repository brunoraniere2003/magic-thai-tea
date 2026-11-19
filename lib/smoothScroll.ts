/**
 * Shared smooth in-page scrolling, used by the header, the hero CTAs and the
 * cards' Book button so every "jump" on the page glides instead of snapping.
 * (Browsers fall back to an instant jump under prefers-reduced-motion.)
 */

/** Smoothly scroll to an in-page anchor (href like "#contact"). */
export function scrollToAnchor(href: string): void {
  if (!href.startsWith("#")) return;
  const target = document.getElementById(href.slice(1));
  // On a page without that section (e.g. /gongfu-tea-san-francisco), go home to it.
  if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.location.assign(`/${href}`);
}

/** Smoothly scroll back to the very top of the page, or go home from another page. */
export function scrollToTop(): void {
  if (window.location.pathname !== "/") window.location.assign("/");
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
