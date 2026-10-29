import { Hero } from "@/components/sections/home/Hero";
import { Practice } from "@/components/sections/home/Practice";
import { YinYang } from "@/components/sections/home/YinYang";
import { Reviews } from "@/components/sections/home/Reviews";
import { TwoDoors } from "@/components/sections/home/TwoDoors";
import { Corporate } from "@/components/sections/home/Corporate";
import { Shop } from "@/components/sections/home/Shop";
import { About } from "@/components/sections/home/About";
import { TeaList } from "@/components/sections/home/TeaList";
import { Connect } from "@/components/sections/home/Connect";
import { Events } from "@/components/sections/home/Events";
import { Contact } from "@/components/sections/home/Contact";
import { ClassSchedule } from "@/components/sections/home/ClassSchedule";
import { HOME } from "@/content/home";

/**
 * Page order (brief 2026-10-29):
 * Hero > Team events > About > Two ways to book > Tea Ceremony > Tai Chi >
 * Tea + Tai Chi > Reviews > Take the tea home > Contact > Tai Chi classes >
 * Tea List > Connect > Events.
 *
 * The page now leads with the team-event offer (price, steps, two business
 * quotes); the weekly class schedule sits low, where students look for it.
 */
export default function Home() {
  const [tea, taichi] = HOME.practices;

  return (
    <main id="main" className="relative flex flex-1 flex-col">
      <Hero />
      <Corporate />
      <About />
      <TwoDoors />
      <Practice practice={tea} />
      <Practice practice={taichi} reversed />
      <YinYang />
      <Reviews />
      <Shop />
      <Contact />
      {/* Drawn from the calendar feed, not embedded: Google's iframe would
          republish his private bookings, errands and home address. */}
      <ClassSchedule />
      <TeaList />
      <Connect />
      <Events />
    </main>
  );
}
