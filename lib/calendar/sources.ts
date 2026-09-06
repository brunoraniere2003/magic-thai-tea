/**
 * The two calendars from the handoff (blocker B1).
 *
 * `NEXT_PUBLIC_*` is read as a full literal so Next inlines it at build time.
 * Both are optional: until Ethan sends the links, each calendar section simply
 * does not render.
 */
export const CALENDAR_SOURCES = {
  /** Public class schedule, full event details. */
  classes: process.env.NEXT_PUBLIC_CALENDAR_CLASSES_SRC,
  /** Second calendar, shared as free/busy only. */
  availability: process.env.NEXT_PUBLIC_CALENDAR_AVAILABILITY_SRC,
} as const;
