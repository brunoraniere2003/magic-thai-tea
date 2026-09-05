import { Hero } from "@/components/sections/home/Hero";
import { Worlds } from "@/components/sections/home/Worlds";
import { Practice } from "@/components/sections/home/Practice";
import { YinYang } from "@/components/sections/home/YinYang";
import { Services } from "@/components/sections/home/Services";
import { About } from "@/components/sections/home/About";
import { Magic } from "@/components/sections/home/Magic";
import { Reviews } from "@/components/sections/home/Reviews";
import { Connect } from "@/components/sections/home/Connect";
import { TeaList } from "@/components/sections/home/TeaList";
import { Availability } from "@/components/sections/home/Availability";
import { Events } from "@/components/sections/home/Events";
import { Contact } from "@/components/sections/home/Contact";
import { CalendarEmbed } from "@/components/shared/CalendarEmbed";
import { HOME } from "@/content/home";
import { CALENDAR_SOURCES } from "@/lib/calendar/sources";

/**
 * Page order from the handoff (spec 033, ADR 0012):
 * Hero > Tea Ceremony > Tai Chi (+ class calendar) > Yin & Yang > Services >
 * About > Magic > Testimonials > Connect > Tea List > Availability > Events >
 * Contact.
 *
 * Worlds (the card deck) stays right after the hero: it is the landing page's
 * signature animation, and the handoff only reorders the content sections.
 */
export default function Home() {
  const [tea, taichi] = HOME.practices;

  return (
    <main id="main" className="relative flex flex-1 flex-col">
      <Hero />
      <Worlds />
      <Practice practice={tea} />
      <Practice practice={taichi} reversed>
        <CalendarEmbed
          content={HOME.classesCalendar}
          source={CALENDAR_SOURCES.classes}
        />
      </Practice>
      <YinYang />
      <Services />
      <About />
      <Magic />
      <Reviews />
      <Connect />
      <TeaList />
      <Availability />
      <Events />
      <Contact />
    </main>
  );
}
