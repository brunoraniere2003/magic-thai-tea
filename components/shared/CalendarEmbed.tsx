import type { CalendarContent } from "@/content/home";
import { calendarEmbedUrl } from "@/lib/calendar/embedUrl";
import { buttonClasses } from "@/components/ui/Button";

export interface CalendarEmbedProps {
  content: CalendarContent;
  /** Raw value from env: an embed URL, a calendar id, or a pasted iframe. */
  source?: string;
}

/**
 * A Google Calendar embed (spec 033 / R9, R10).
 *
 * Renders nothing until Ethan sends the calendar links (blocker B1), so the
 * page ships without an empty frame. Lazy and fixed-ratio: it loads below the
 * fold and reserves its own space, so it costs no LCP and no layout shift (§3).
 */
export function CalendarEmbed({ content, source }: CalendarEmbedProps) {
  const url = calendarEmbedUrl(source);
  if (!url) return null;

  return (
    <div className="flex flex-col gap-5">
      <h3 className="font-display text-2xl text-cream sm:text-3xl">
        {content.title}
      </h3>
      <p className="max-w-2xl font-sans text-base leading-relaxed text-stone">
        {content.body}
      </p>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-stone/20 sm:aspect-[16/9]">
        <iframe
          src={url}
          title={content.frameTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full"
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={buttonClasses("secondary", "self-start")}
      >
        {content.cta}
      </a>
    </div>
  );
}
