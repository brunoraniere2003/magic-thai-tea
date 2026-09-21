import { Hero } from "@/components/sections/home/Hero";
import { Worlds } from "@/components/sections/home/Worlds";
import { Practice } from "@/components/sections/home/Practice";
import { YinYang } from "@/components/sections/home/YinYang";
import { Services } from "@/components/sections/home/Services";
import { About } from "@/components/sections/home/About";
import { Magic } from "@/components/sections/home/Magic";
import { Reviews } from "@/components/sections/home/Reviews";
import { Shop } from "@/components/sections/home/Shop";
import { Connect } from "@/components/sections/home/Connect";
import { TeaList } from "@/components/sections/home/TeaList";
import { Availability } from "@/components/sections/home/Availability";
import { Events } from "@/components/sections/home/Events";
import { Contact } from "@/components/sections/home/Contact";
import { ClassSchedule } from "@/components/sections/home/ClassSchedule";
import { HOME } from "@/content/home";

/**
 * Page order from the handoff (spec 033, ADR 0012):
 * Hero > Tea Ceremony > Tai Chi (+ class calendar) > Yin & Yang > Services >
 * About > Magic > Testimonials > Shop the Tea > Connect > Tea List >
 * Availability > Events > Contact.
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
        {/* Drawn from the calendar feed, not embedded: Google's iframe would
            republish his private bookings, errands and home address, and has
            no way to hide event titles. See ClassSchedule. */}
        <ClassSchedule />
      </Practice>
      <YinYang />
      <Services />
      <About />
      <Magic />
      <Reviews />
      <Shop />
      <Connect />
      <TeaList />
      <Availability />
      <Events />
      <Contact />
    </main>
  );
}
