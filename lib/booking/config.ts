/**
 * Booking configuration (Cal.com). Placeholder until accounts exist — wiring is
 * just filling `calLinks`, no component changes (see docs/blueprint.md §12).
 */
export type BookingWorld = "magic" | "tea" | "tai-chi";

export interface BookingConfig {
  /** Cal.com "user/event" per world (e.g. "ethan/magic-performance"). Empty = not wired yet. */
  calLinks: Record<BookingWorld, string>;
  /** Where actions point until Cal.com is connected. */
  fallbackHref: string;
}

export const BOOKING: BookingConfig = {
  calLinks: { magic: "", tea: "", "tai-chi": "" },
  fallbackHref: "#contact",
};

/** True once a real Cal.com link is configured for the world. */
export function isBookingConfigured(
  world: BookingWorld,
  config: BookingConfig = BOOKING,
): boolean {
  return config.calLinks[world].trim().length > 0;
}

/** The Cal.com URL when configured, otherwise the safe fallback (contact). */
export function getBookingHref(
  world: BookingWorld,
  config: BookingConfig = BOOKING,
): string {
  if (!isBookingConfigured(world, config)) return config.fallbackHref;
  return `https://cal.com/${config.calLinks[world].trim()}`;
}
