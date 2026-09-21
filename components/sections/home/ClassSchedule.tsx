import { Reveal, Stagger, ShelfRule } from "@/components/motion";
import { buttonClasses } from "@/components/ui/Button";
import { HOME } from "@/content/home";
import { CALENDAR_SOURCES } from "@/lib/calendar/sources";
import { calendarEmbedUrl } from "@/lib/calendar/embedUrl";
import {
  parseWeeklyClasses,
  formatDays,
  type ClassSession,
} from "@/lib/calendar/parseSchedule";

/**
 * "Upcoming Tai Chi Sessions" — drawn from Ethan's calendar, not embedded.
 *
 * His class calendar is public, but it also carries private bookings by client
 * name, personal errands and his home street address. Google's iframe would
 * republish all of it, and there is no parameter to hide event titles. So we
 * read the public feed ourselves and print only the recurring classes, in this
 * page's own type (see lib/calendar/parseSchedule.ts for the allowlist).
 *
 * Revalidated hourly: adding a class on his phone shows up here without a
 * deploy. If the feed is unreachable, the section falls back to the link.
 */

const ICS_BASE = "https://calendar.google.com/calendar/ical";
const REVALIDATE_SECONDS = 3600;

/** The public .ics feed for a calendar embed URL, when we can derive one. */
function feedUrlFrom(source?: string): string | undefined {
  const embed = calendarEmbedUrl(source);
  if (!embed) return undefined;
  const src = new URL(embed).searchParams.get("src");
  return src ? `${ICS_BASE}/${encodeURIComponent(src)}/public/basic.ics` : undefined;
}

async function loadSessions(): Promise<ClassSession[]> {
  const feed = feedUrlFrom(CALENDAR_SOURCES.classes);
  if (!feed) return [];

  try {
    const response = await fetch(feed, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (!response.ok) return [];
    return parseWeeklyClasses(await response.text());
  } catch {
    // A calendar that cannot be read is not a broken page: fall back quietly.
    return [];
  }
}

export async function ClassSchedule() {
  const sessions = await loadSessions();
  const publicUrl = calendarEmbedUrl(CALENDAR_SOURCES.classes);
  const content = HOME.classesCalendar;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="font-display text-2xl text-cream sm:text-3xl">
          {content.title}
        </h3>
        <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-stone">
          {content.body}
        </p>
      </div>

      {sessions.length > 0 ? (
        <Stagger as="ul" className="flex flex-col" start="top 90%">
          {sessions.map((session) => (
            <li
              key={`${session.title}-${session.startsAt}`}
              className="border-b border-stone/15 py-4 last:border-b-0"
            >
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="w-40 shrink-0 font-sans text-[0.7rem] uppercase tracking-[0.25em] text-gold/80">
                  {formatDays(session.days)}
                </span>
                <span className="font-display text-lg leading-none text-cream">
                  {session.title}
                </span>
                <ShelfRule className="hidden h-px flex-1 bg-stone/20 sm:block" />
                <span className="font-sans text-sm text-stone">
                  {session.time}
                  <span className="mx-2 text-stone/40">·</span>
                  {session.place}
                </span>
              </div>
            </li>
          ))}
        </Stagger>
      ) : null}

      {publicUrl ? (
        <Reveal delay={0.1}>
          <a
            href={publicUrl}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses("secondary", "self-start")}
          >
            {content.cta}
          </a>
        </Reveal>
      ) : null}
    </div>
  );
}
