/** Home page copy (v1 — see docs/blueprint.md §6). */

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  scrollCue: string;
}

export interface HomeContent {
  hero: HeroContent;
}

export const HOME: HomeContent = {
  hero: {
    eyebrow: "Magician · Tea · Tai Chi",
    title: "Wonder, in three forms.",
    subtitle:
      "Close-up magic, the Chinese art of tea, and the stillness of Tai Chi — performed by Ethan Holtzman.",
    primaryCta: { label: "Experience it", href: "#worlds" },
    secondaryCta: { label: "Book Ethan", href: "#book" },
    scrollCue: "Scroll to enter",
  },
};
