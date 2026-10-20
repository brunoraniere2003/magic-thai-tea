import { Hero } from "@/components/sections/home/Hero";
import { Practice } from "@/components/sections/home/Practice";
import { YinYang } from "@/components/sections/home/YinYang";
import { Reviews } from "@/components/sections/home/Reviews";
import { TwoDoors } from "@/components/sections/home/TwoDoors";
import { Shop } from "@/components/sections/home/Shop";
import { About } from "@/components/sections/home/About";
import { TeaList } from "@/components/sections/home/TeaList";
import { Connect } from "@/components/sections/home/Connect";
import { Events } from "@/components/sections/home/Events";
import { Contact } from "@/components/sections/home/Contact";
import { ClassSchedule } from "@/components/sections/home/ClassSchedule";
import { HOME } from "@/content/home";

/**
 * Page order (brief 2026-10-20):
 * Hero > About > Two ways to book > Tea Ceremony > Tai Chi (+ class schedule)
 * > Tea + Tai Chi > Reviews > Shop > Contact > Tea List > Connect > Events.
 *
 * Who Ethan is, then how to book him (a gathering through the contact form, or
 * an intimate session at The Tea Temple), then the practices and the proof,
 * then the shop with the contact form right after it. Ways to stay in touch
 * close the page. Every section is one tap away in the header (SITE.nav/menu).
 */
export default function Home() {
  const [tea, taichi] = HOME.practices;

  return (
    <main id="main" className="relative flex flex-1 flex-col">
      <Hero />
      <About />
      <TwoDoors />
      <Practice practice={tea} />
      <Practice practice={taichi} reversed>
        {/* Drawn from the calendar feed, not embedded: Google's iframe would
            republish his private bookings, errands and home address, and has
            no way to hide event titles. See ClassSchedule. */}
        <ClassSchedule />
      </Practice>
      <YinYang />
      <Reviews />
      <Shop />
      <Contact />
      <TeaList />
      <Connect />
      <Events />
    </main>
  );
}
