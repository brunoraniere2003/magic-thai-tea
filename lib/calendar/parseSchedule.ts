/**
 * Reads Ethan's public class calendar (iCal) and returns only the weekly
 * classes, in our own shape — so the site can draw the schedule instead of
 * embedding Google's white iframe.
 *
 * This exists for a privacy reason, not a cosmetic one. That calendar also
 * carries his private bookings by client name ("Private training with Wayne"),
 * personal errands ("Handyman comes to fix the locks") and **his home street
 * address** in the location field. None of that may reach the site, so the
 * parser works by ALLOWLIST: an event is published only if it looks like one of
 * his class formats, and never if it looks private. Anything unrecognised is
 * dropped — the safe direction when the input is a live calendar we do not own.
 */

/** Day-of-week codes as iCal writes them, in display order. */
export const DAY_CODES = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"] as const;
export type DayCode = (typeof DAY_CODES)[number];

const DAY_LABEL: Record<DayCode, string> = {
  MO: "Mon",
  TU: "Tue",
  WE: "Wed",
  TH: "Thu",
  FR: "Fri",
  SA: "Sat",
  SU: "Sun",
};

export interface ClassSession {
  /** Class name, as Ethan writes it. */
  title: string;
  /** Weekdays it repeats on, in week order. */
  days: DayCode[];
  /** Start time, already formatted for reading ("9:00 am"). */
  time: string;
  /** Minutes past midnight — used only to sort. */
  startsAt: number;
  /** Where it happens, once it is safe to say. */
  place: "Online" | "In person" | string;
}

/** A class we publish must look like one of these. */
const CLASS_PATTERNS = [
  /tai\s*chi/i,
  /song\s*gong/i,
  /qi\s*gong/i,
  /cultivation/i,
  /meditation/i,
];

/** And must never look like any of these. */
const PRIVATE_PATTERNS = [
  /private/i,
  /personal/i,
  /handyman/i,
  /upload/i,
  /dentist|doctor|appointment/i,
  /\bwith\s+[A-Z][a-z]+/, // "with Wayne" — a named client
];

/** Street addresses are his home. Venues and links are fine. */
// A location that opens with a house number is an address, whatever the suffix
// — safer than chasing every word for "Terrace", "Circle", "Parkway"…
const STREET = /^\s*\d+\s+\S/;

export function isPublicClass(summary: string): boolean {
  if (!summary.trim()) return false;
  if (PRIVATE_PATTERNS.some((p) => p.test(summary))) return false;
  return CLASS_PATTERNS.some((p) => p.test(summary));
}

/** What we are willing to say about where a class happens. */
export function safePlace(location: string | undefined): ClassSession["place"] {
  const raw = (location ?? "").replace(/\\,/g, ",").trim();
  if (!raw) return "In person";
  if (/^https?:|zoom|meet\.google|teams\./i.test(raw)) return "Online";
  if (STREET.test(raw)) return "In person"; // never publish his street
  // A named venue is safe: "Sunset Recreation Center".
  return raw.split(",")[0].slice(0, 60);
}

/** Unfolds iCal continuation lines and splits the VEVENT blocks. */
function eventBlocks(ics: string): string[][] {
  const unfolded = ics.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
  const blocks: string[][] = [];
  let current: string[] | null = null;

  for (const line of unfolded.split("\n")) {
    if (line.startsWith("BEGIN:VEVENT")) current = [];
    else if (line.startsWith("END:VEVENT")) {
      if (current) blocks.push(current);
      current = null;
    } else if (current) current.push(line);
  }
  return blocks;
}

function field(lines: string[], name: string): string | undefined {
  const line = lines.find(
    (l) => l.startsWith(`${name}:`) || l.startsWith(`${name};`),
  );
  if (!line) return undefined;
  const at = line.indexOf(":");
  return at === -1 ? undefined : line.slice(at + 1).trim();
}

/** "20260525T090000" → 540 (minutes past midnight). */
function minutesOf(dtstart: string): number | undefined {
  const match = dtstart.match(/T(\d{2})(\d{2})/);
  if (!match) return undefined;
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatTime(minutes: number): string {
  const h24 = Math.floor(minutes / 60);
  const m = minutes % 60;
  const suffix = h24 < 12 ? "am" : "pm";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

function daysOf(rrule: string, dtstart: string): DayCode[] {
  const byDay = rrule.match(/BYDAY=([^;]+)/i)?.[1];
  if (byDay) {
    const wanted = byDay
      .split(",")
      .map((d) => d.trim().slice(-2).toUpperCase())
      .filter((d): d is DayCode => DAY_CODES.includes(d as DayCode));
    return DAY_CODES.filter((d) => wanted.includes(d));
  }
  // A weekly rule with no BYDAY repeats on the start day.
  const date = dtstart.match(/^(\d{4})(\d{2})(\d{2})/);
  if (!date) return [];
  const js = new Date(
    Number(date[1]),
    Number(date[2]) - 1,
    Number(date[3]),
  ).getDay();
  return [DAY_CODES[(js + 6) % 7]];
}

/**
 * The weekly classes, sorted by day then time. Only recurring events are
 * published: a one-off on the shared calendar is as likely to be an errand as
 * a class, and this page promises "regular sessions".
 */
export function parseWeeklyClasses(ics: string): ClassSession[] {
  const sessions: ClassSession[] = [];

  for (const lines of eventBlocks(ics)) {
    const summary = field(lines, "SUMMARY") ?? "";
    const rrule = field(lines, "RRULE");
    const dtstart = field(lines, "DTSTART");
    if (!rrule || !dtstart) continue;
    if (!/FREQ=WEEKLY/i.test(rrule)) continue;
    if (!isPublicClass(summary)) continue;

    const startsAt = minutesOf(dtstart);
    const days = daysOf(rrule, dtstart);
    if (startsAt === undefined || days.length === 0) continue;

    sessions.push({
      title: summary,
      days,
      time: formatTime(startsAt),
      startsAt,
      // A class that calls itself online is online, even with no link set.
      place: /online|zoom/i.test(summary)
        ? "Online"
        : safePlace(field(lines, "LOCATION")),
    });
  }

  return sessions.sort((a, b) => {
    const dayA = DAY_CODES.indexOf(a.days[0]);
    const dayB = DAY_CODES.indexOf(b.days[0]);
    return dayA - dayB || a.startsAt - b.startsAt;
  });
}

/** "Mon · Wed · Fri" */
export function formatDays(days: DayCode[]): string {
  return days.map((d) => DAY_LABEL[d]).join(" · ");
}
