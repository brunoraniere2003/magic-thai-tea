import { SITE } from "@/content/site";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
      <p className="font-sans text-xs uppercase tracking-[0.3em] text-stone">
        Magician · Tea · Tai Chi
      </p>
      <h1 className="font-display text-5xl text-cream sm:text-6xl">
        {SITE.name}
      </h1>
      <p className="font-sans text-stone">{SITE.tagline}</p>
    </main>
  );
}
