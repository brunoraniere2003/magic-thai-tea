/**
 * The two calendars from the handoff (blockers B1 and B16, both resolved).
 *
 * Ethan sent two public Google Calendar ids without saying which was which.
 * Opening them settles it, so these are the defaults rather than a pending env:
 *   - `ce9beb1c…` is titled **TAI CHI ARMBRIDGE FAMILY CLASSES** and carries the
 *     recurring Tai Chi Training / Song Gong / Daily 10 Series classes → the
 *     public class schedule.
 *   - `8c1caa62…` is titled **RED FLYING DRAGON BUSINESS** and shows blocks as
 *     "busy" with no detail → the free/busy availability calendar.
 *
 * `NEXT_PUBLIC_*` still overrides either one. Because Next inlines those at
 * BUILD time, changing them in production needs `npm run build`, not just a
 * `pm2 restart` (see docs/deploy-vps.md).
 */

const CLASSES_ID =
  "ce9beb1c270200f96635bab3d73fca9fad569d9bcf810d181cf0cf059b7bdb23@group.calendar.google.com";
const AVAILABILITY_ID =
  "8c1caa628e064e72fa2cac3286e5418970003d5a6dce569fa39a6d765b777763@group.calendar.google.com";

/** Ethan works out of Los Angeles; the embed must say so or times shift. */
const TZ = "America/Los_Angeles";

function embed(id: string): string {
  return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(id)}&ctz=${encodeURIComponent(TZ)}`;
}

export const CALENDAR_SOURCES = {
  /** Public class schedule, full event details. */
  classes: process.env.NEXT_PUBLIC_CALENDAR_CLASSES_SRC ?? embed(CLASSES_ID),
  /** Second calendar, shared as free/busy only. */
  availability:
    process.env.NEXT_PUBLIC_CALENDAR_AVAILABILITY_SRC ?? embed(AVAILABILITY_ID),
} as const;
