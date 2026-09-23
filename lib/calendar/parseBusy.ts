/**
 * Busy time, with every name stripped off it.
 *
 * "See When I'm Free" has to answer one question — is he taken at this hour? —
 * without saying who he is with. Google's own free/busy sharing would do that
 * for one calendar, but Ethan's private bookings live on his CLASS calendar,
 * so the availability view was showing Thursday 11:00 as open while he was
 * teaching. This reads any number of feeds and keeps only date, start and end.
 *
 * What it deliberately does NOT keep: summary, location, attendees, ids. The
 * output type has nowhere to put them.
 */

export interface BusyBlock {
  /** Local day, "YYYY-MM-DD". */
  day: string;
  /** Minutes past midnight, local time. */
  start: number;
  end: number;
}

/** Events that are not the person being busy: open classes anyone can join. */
export type BusyFilter = (summary: string) => boolean;

const MS_DAY = 86_400_000;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** iCal stamps: "20260919T163000Z" (UTC) or "20260919T090000" (local/TZID). */
function toDate(stamp: string): Date | undefined {
  const m = stamp.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?/);
  if (!m) return undefined;
  const [, y, mo, d, hh = "0", mm = "0", ss = "0", utc] = m;
  const parts = [Number(y), Number(mo) - 1, Number(d), Number(hh), Number(mm), Number(ss)] as const;
  return utc
    ? new Date(Date.UTC(...parts))
    : new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]);
}

function minutes(date: Date): number {
  return date.getHours() * 60 + date.getMinutes();
}

function unfold(ics: string): string {
  return ics.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "");
}

interface RawEvent {
  summary: string;
  start: Date;
  end: Date;
  rrule?: string;
  exdates: Set<string>;
}

function readEvents(ics: string): RawEvent[] {
  const events: RawEvent[] = [];

  for (const block of unfold(ics).split("BEGIN:VEVENT").slice(1)) {
    const body = block.split("END:VEVENT")[0];
    const get = (name: string) => {
      const line = body
        .split("\n")
        .find((l) => l.startsWith(`${name}:`) || l.startsWith(`${name};`));
      return line?.slice(line.indexOf(":") + 1).trim();
    };

    const start = toDate(get("DTSTART") ?? "");
    const end = toDate(get("DTEND") ?? "");
    if (!start || !end) continue;

    const exdates = new Set(
      body
        .split("\n")
        .filter((l) => l.startsWith("EXDATE"))
        .flatMap((l) => l.slice(l.indexOf(":") + 1).split(","))
        .map((raw) => toDate(raw.trim()))
        .filter((d): d is Date => Boolean(d))
        .map(dayKey),
    );

    events.push({
      summary: get("SUMMARY") ?? "",
      start,
      end,
      rrule: get("RRULE"),
      exdates,
    });
  }

  return events;
}

const DAY_CODES = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"] as const;

/** Does this weekly rule fire on that date? */
function firesOn(rrule: string, seed: Date, date: Date): boolean {
  const until = rrule.match(/UNTIL=([0-9TZ]+)/i)?.[1];
  if (until) {
    const limit = toDate(until);
    if (limit && date > limit) return false;
  }
  const byDay = rrule.match(/BYDAY=([^;]+)/i)?.[1];
  const code = DAY_CODES[date.getDay()];
  if (byDay) {
    return byDay
      .split(",")
      .map((d) => d.trim().slice(-2).toUpperCase())
      .includes(code);
  }
  return date.getDay() === seed.getDay();
}

/**
 * Busy blocks for `days` days starting at `from`, from one or more feeds.
 * `isOpen` marks events that should NOT count as busy (the public classes).
 */
export function parseBusyBlocks(
  feeds: string[],
  { from, days, isOpen }: { from: Date; days: number; isOpen?: BusyFilter },
): BusyBlock[] {
  const blocks: BusyBlock[] = [];
  const startOfRange = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const endOfRange = new Date(startOfRange.getTime() + days * MS_DAY);

  for (const ics of feeds) {
    for (const event of readEvents(ics)) {
      if (isOpen?.(event.summary)) continue;

      const length = Math.max(0, event.end.getTime() - event.start.getTime());

      if (!event.rrule || !/FREQ=WEEKLY/i.test(event.rrule)) {
        if (event.start >= startOfRange && event.start < endOfRange) {
          blocks.push({
            day: dayKey(event.start),
            start: minutes(event.start),
            end: minutes(new Date(event.start.getTime() + length)),
          });
        }
        continue;
      }

      for (let i = 0; i < days; i += 1) {
        const date = new Date(startOfRange.getTime() + i * MS_DAY);
        if (date < new Date(event.start.getFullYear(), event.start.getMonth(), event.start.getDate())) {
          continue;
        }
        if (!firesOn(event.rrule, event.start, date)) continue;
        if (event.exdates.has(dayKey(date))) continue;

        const occurrence = new Date(date);
        occurrence.setHours(event.start.getHours(), event.start.getMinutes(), 0, 0);
        blocks.push({
          day: dayKey(occurrence),
          start: minutes(occurrence),
          end: minutes(new Date(occurrence.getTime() + length)),
        });
      }
    }
  }

  return mergeBusy(blocks);
}

/** Overlapping or touching blocks on the same day become one. */
export function mergeBusy(blocks: BusyBlock[]): BusyBlock[] {
  const sorted = [...blocks].sort(
    (a, b) => a.day.localeCompare(b.day) || a.start - b.start,
  );
  const merged: BusyBlock[] = [];

  for (const block of sorted) {
    const last = merged[merged.length - 1];
    if (last && last.day === block.day && block.start <= last.end) {
      last.end = Math.max(last.end, block.end);
      continue;
    }
    merged.push({ ...block });
  }

  return merged;
}

export function formatClock(minutesOfDay: number): string {
  const h24 = Math.floor(minutesOfDay / 60) % 24;
  const m = minutesOfDay % 60;
  const suffix = h24 < 12 ? "am" : "pm";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${pad(m)} ${suffix}`;
}
