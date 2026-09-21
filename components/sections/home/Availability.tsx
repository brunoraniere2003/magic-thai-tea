import { Reveal, Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";
import { CALENDAR_SOURCES } from "@/lib/calendar/sources";
import { calendarEmbedUrl } from "@/lib/calendar/embedUrl";
import { isPublicClass } from "@/lib/calendar/parseSchedule";
import {
  parseBusyBlocks,
  formatClock,
  dayKey,
  type BusyBlock,
} from "@/lib/calendar/parseBusy";

/**
 * "See When I'm Free" (spec 033 / R10) — the next two weeks, drawn by us.
 *
 * It reads BOTH calendars, because his private bookings sit on the class
 * calendar: embedding only the "business" one showed Thursday 11:00 as open
 * while he was teaching. Open classes do not count as busy — someone can join
 * those. Nothing but the hours survives the parse: no title, no client, no
 * address (see lib/calendar/parseBusy.ts).
 *
 * Revalidated hourly, same as the class schedule.
 */

const ICS_BASE = "https://calendar.google.com/calendar/ical";
const REVALIDATE_SECONDS = 3600;
const DAYS_AHEAD = 14;

function feedUrlFrom(source?: string): string | undefined {
  const embed = calendarEmbedUrl(source);
  if (!embed) return undefined;
  const src = new URL(embed).searchParams.get("src");
  return src
    ? `${ICS_BASE}/${encodeURIComponent(src)}/public/basic.ics`
    : undefined;
}

async function loadFeeds(): Promise<string[]> {
  const urls = [CALENDAR_SOURCES.availability, CALENDAR_SOURCES.classes]
    .map(feedUrlFrom)
    .filter((u): u is string => Boolean(u));

  const bodies = await Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, {
          next: { revalidate: REVALIDATE_SECONDS },
        });
        return response.ok ? await response.text() : "";
      } catch {
        return "";
      }
    }),
  );

  return bodies.filter(Boolean);
}

interface Day {
  key: string;
  label: string;
  busy: BusyBlock[];
}

function nextDays(from: Date, count: number, blocks: BusyBlock[]): Day[] {
  const formatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return Array.from({ length: count }, (_, i) => {
    const date = new Date(
      from.getFullYear(),
      from.getMonth(),
      from.getDate() + i,
    );
    const key = dayKey(date);
    return {
      key,
      label: formatter.format(date),
      busy: blocks.filter((b) => b.day === key),
    };
  });
}

export async function Availability() {
  const feeds = await loadFeeds();
  if (feeds.length === 0) return null;

  const now = new Date();
  const blocks = parseBusyBlocks(feeds, {
    from: now,
    days: DAYS_AHEAD,
    isOpen: isPublicClass,
  });
  const days = nextDays(now, DAYS_AHEAD, blocks);
  const content = HOME.availabilityCalendar;

  return (
    <section
      id="availability"
      className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow="Availability"
        title={content.title}
        intro={content.body}
        className="mb-10 max-w-2xl"
      />

      <Stagger as="ul" className="flex flex-col" start="top 90%">
        {days.map((day) => (
          <li
            key={day.key}
            className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-stone/15 py-3 last:border-b-0"
          >
            <span className="w-28 shrink-0 font-sans text-[0.7rem] uppercase tracking-[0.25em] text-stone/70">
              {day.label}
            </span>

            {day.busy.length === 0 ? (
              <span className="font-sans text-sm text-gold/90">Open</span>
            ) : (
              <span className="font-sans text-sm text-stone">
                Busy{" "}
                {day.busy
                  .map((b) => `${formatClock(b.start)}–${formatClock(b.end)}`)
                  .join(", ")}
              </span>
            )}
          </li>
        ))}
      </Stagger>

      <Reveal delay={0.1} className="mt-8">
        {/* The calendar is on the page now, so "View availability" would point
            at what you are already reading. The next step is the conversation. */}
        <a href="#contact" className={buttonClasses("secondary")}>
          {HOME.hero.secondaryCta.label}
        </a>
      </Reveal>
    </section>
  );
}
