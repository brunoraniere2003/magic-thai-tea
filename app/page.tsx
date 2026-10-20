import { Hero } from "@/components/sections/home/Hero";
import { Practice } from "@/components/sections/home/Practice";
import { YinYang } from "@/components/sections/home/YinYang";
import { Reviews } from "@/components/sections/home/Reviews";
import { TeaTemple } from "@/components/sections/home/TeaTemple";
import { Shop } from "@/components/sections/home/Shop";
import { About } from "@/components/sections/home/About";
import { TeaList } from "@/components/sections/home/TeaList";
import { Connect } from "@/components/sections/home/Connect";
import { Events } from "@/components/sections/home/Events";
import { Contact } from "@/components/sections/home/Contact";
import { ClassSchedule } from "@/components/sections/home/ClassSchedule";
import { HOME } from "@/content/home";

/**
 * Page order (2026-10-11 refocus on tea and tai chi):

 * (2026-10-19: the three-card reveal is gone; the hero's one button, "Book
 * me", goes straight to the contact form.)
 * Hero > Tea Ceremony > Tai Chi (+ class schedule) >
 * Tea + Tai Chi > Reviews > Private sessions (The Tea Temple) > Shop >
 * About > Tea List > Connect > Events > Contact.
 *
 * The offer comes first, then the proof, then the two ways to say yes: book a
 * session, or take the tea home. The story and the ways to stay in touch close
 * the page. Every section is one tap away in the header (SITE.nav / menu).
 */
export default function Home() {
  const [tea, taichi] = HOME.practices;

  return (
    <main id="main" className="relative flex flex-1 flex-col">
      <Hero />
      <Practice practice={tea} />
      <Practice practice={taichi} reversed>
        {/* Drawn from the calendar feed, not embedded: Google's iframe would
            republish his private bookings, errands and home address, and has
            no way to hide event titles. See ClassSchedule. */}
        <ClassSchedule />
      </Practice>
      <YinYang />
      <Reviews />
      <TeaTemple />
      <Shop />
      <About />
      <TeaList />
      <Connect />
      <Events />
      <Contact />
    </main>
  );
}
