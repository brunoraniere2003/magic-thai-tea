import { CalendarEmbed } from "@/components/shared/CalendarEmbed";
import { HOME } from "@/content/home";
import { CALENDAR_SOURCES } from "@/lib/calendar/sources";
import { calendarEmbedUrl } from "@/lib/calendar/embedUrl";

/**
 * Free/busy calendar next to the booking conversation (spec 033 / R10).
 * Renders nothing until the availability calendar exists (blocker B1).
 */
export function Availability() {
  if (!calendarEmbedUrl(CALENDAR_SOURCES.availability)) return null;

  return (
    <section
      id="availability"
      className="mx-auto max-w-4xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <CalendarEmbed
        content={HOME.availabilityCalendar}
        source={CALENDAR_SOURCES.availability}
      />
    </section>
  );
}
