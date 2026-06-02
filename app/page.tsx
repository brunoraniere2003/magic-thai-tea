import { Hero } from "@/components/sections/home/Hero";
import { Statement } from "@/components/sections/home/Statement";
import { Worlds } from "@/components/sections/home/Worlds";
import { About } from "@/components/sections/home/About";
import { Proof } from "@/components/sections/home/Proof";
import { Process } from "@/components/sections/home/Process";
import { HomeCTA } from "@/components/sections/home/HomeCTA";
import { Contact } from "@/components/sections/home/Contact";

export default function Home() {
  return (
    <main id="main" className="relative flex flex-1 flex-col">
      <Hero />
      <Statement />
      <Worlds />
      <About />
      <Proof />
      <Process />
      <HomeCTA />
      <Contact />
    </main>
  );
}
