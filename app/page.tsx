import { HeroContent } from "@/components/sections/home/HeroContent";
import { HeroPoster } from "@/components/sections/home/HeroPoster";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        <HeroPoster />
        <HeroContent />
      </section>
    </main>
  );
}
