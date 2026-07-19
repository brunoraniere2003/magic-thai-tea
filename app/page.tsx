import { Hero } from "@/components/sections/home/Hero";
import { Worlds } from "@/components/sections/home/Worlds";
import { Opportunities } from "@/components/sections/home/Opportunities";
import { Reviews } from "@/components/sections/home/Reviews";
import { Contact } from "@/components/sections/home/Contact";

export default function Home() {
  return (
    <main id="main" className="relative flex flex-1 flex-col">
      <Hero />
      <Worlds />
      <Opportunities />
      <Reviews />
      <Contact />
    </main>
  );
}
