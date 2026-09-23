/**
 * Event date formatting (spec 033 / R11 — blocker B5).
 * Dates arrive as plain ISO days (YYYY-MM-DD) and are rendered in the site's
 * US voice. Parsed as UTC so the printed day never shifts with the viewer's
 * timezone.
 */

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

const FORMAT = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "long",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO day, or returns the raw value when it is not a valid date. */
export function formatEventDate(iso: string): string {
  if (!ISO_DAY.test(iso)) return iso;

  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return iso;

  return FORMAT.format(date);
}
