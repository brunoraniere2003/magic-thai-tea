/**
 * Briefly pause page scrolling, then resume. Used by the mobile flip cards so a
 * card can finish its flip animation while the page stays put at the exact
 * scroll position where the card sits centred.
 *
 * Stops both Lenis (the site's smooth-scroll driver, when running) and native
 * wheel/touch input. Restores both unconditionally on unlock.
 */

interface LenisLike {
  stop(): void;
  start(): void;
}

function getLenis(): LenisLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { lenis?: LenisLike };
  return w.lenis ?? null;
}

const prevent = (event: Event) => {
  event.preventDefault();
};

let activeLocks = 0;

export function lockScroll(): void {
  activeLocks++;
  if (activeLocks > 1) return;
  getLenis()?.stop();
  // Native fallbacks (Lenis is gated off for reduced-motion / low tier).
  window.addEventListener("wheel", prevent, { passive: false });
  window.addEventListener("touchmove", prevent, { passive: false });
}

export function unlockScroll(): void {
  if (activeLocks === 0) return;
  activeLocks--;
  if (activeLocks > 0) return;
  getLenis()?.start();
  window.removeEventListener("wheel", prevent);
  window.removeEventListener("touchmove", prevent);
}
