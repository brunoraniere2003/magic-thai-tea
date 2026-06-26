/** Landing page copy — The Red Flying Dragon (spec 028). English (US audience). */

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

/** The three cards. `yinyang` is the balance that links tea and tai chi. */
export type WorldKey = "tea" | "yinyang" | "taichi";
/** A card front is drawn from its symbol (no photo) — see makeCardFaceTextures. */
export type WorldSymbol = WorldKey;

export interface World {
  key: WorldKey;
  eyebrow: string;
  title: string;
  essence: string;
  /** Drawn-icon identifier for the canvas card face. */
  symbol: WorldSymbol;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  intro?: string;
}

export interface HomeContent {
  hero: HeroContent;
  worldsHeading: SectionIntro;
  worlds: World[];
  contact: SectionIntro;
}

export const HOME: HomeContent = {
  hero: {
    eyebrow: "The Red Flying Dragon",
    title: "Tea, tai chi, and the calm in between.",
    subtitle:
      "Ethan Holtzman pours the Chinese art of tea and teaches the moving meditation of tai chi — a ceremony that slows the whole room down.",
    primaryCta: { label: "See the practice", href: "#worlds" },
    secondaryCta: { label: "Talk to Ethan", href: "#contact" },
    scrollCue: "Scroll to enter",
  },

  worldsHeading: {
    eyebrow: "Three forms",
    title: "One practice, three forms.",
  },

  worlds: [
    {
      key: "tea",
      eyebrow: "The Chinese art of tea",
      title: "Tea",
      essence: "A ceremony that slows the whole room down.",
      symbol: "tea",
    },
    {
      key: "yinyang",
      eyebrow: "Balance",
      title: "Yin & Yang",
      essence: "The still point where tea meets motion.",
      symbol: "yinyang",
    },
    {
      key: "taichi",
      eyebrow: "Tai chi chuan",
      title: "Tai Chi",
      essence: "Strength that moves like calm.",
      symbol: "taichi",
    },
  ],

  contact: {
    eyebrow: "Get in touch",
    title: "Talk to Ethan.",
    intro:
      "Tell Ethan about your event or class — he reads every message himself. Prefer to text? Reach him directly below.",
  },
};
