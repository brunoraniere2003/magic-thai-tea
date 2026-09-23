/**
 * Google Calendar embed plumbing (spec 033 / R9, R10 — blocker B1).
 *
 * Ethan will send either a full embed URL (copied from Google's "Embed code")
 * or just the calendar id. Both are accepted so nobody has to hand-edit an
 * iframe snippet: the section stays a data change.
 */

const EMBED_BASE = "https://calendar.google.com/calendar/embed";

/**
 * Normalizes a configured calendar into an embeddable URL.
 * Returns `undefined` when nothing is configured yet, which is how the
 * calendar sections stay invisible until the links arrive.
 */
export function calendarEmbedUrl(value?: string): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;

  if (raw.startsWith("<iframe")) {
    const match = raw.match(/src=["']([^"']+)["']/);
    return match ? match[1] : undefined;
  }

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  return `${EMBED_BASE}?src=${encodeURIComponent(raw)}`;
}
