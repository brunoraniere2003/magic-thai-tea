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

export type WorldKey = "magic" | "tea" | "taichi";

export interface StatementSegment {
  text: string;
  /** Highlight color tied to a world, if any. */
  world?: WorldKey;
}

export interface World {
  key: WorldKey;
  eyebrow: string;
  title: string;
  essence: string;
  description: string;
  href: string;
  /** Card face image (placeholder until Ethan's real media). */
  image: string;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  intro?: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface Quote {
  quote: string;
  author: string;
  context?: string;
}

export interface HomeCtaContent {
  title: string;
  body: string;
  primary: HeroCta;
  secondary: HeroCta;
}

export interface HomeContent {
  hero: HeroContent;
  statement: StatementSegment[];
  worldsHeading: SectionIntro;
  worlds: World[];
  about: { eyebrow: string; title: string; body: string[] };
  proof: { heading: SectionIntro; items: Quote[] };
  process: { heading: SectionIntro; steps: ProcessStep[] };
  cta: HomeCtaContent;
  contact: SectionIntro;
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

  statement: [
    { text: "Magic", world: "magic" },
    { text: ", " },
    { text: "tea", world: "tea" },
    { text: ", and " },
    { text: "tai chi", world: "taichi" },
    {
      text: ". Three arts, one pursuit — the moment a room goes quiet and leans in.",
    },
  ],

  worldsHeading: {
    eyebrow: "Three worlds",
    title: "Choose the kind of wonder.",
  },

  worlds: [
    {
      key: "magic",
      eyebrow: "Close-up magic",
      title: "Magic",
      essence: "Impossible things, inches from your eyes.",
      description:
        "Card miracles and sleight of hand, performed table to table — close-up wonder your guests will retell for years.",
      href: "/magic",
      image: "/images/worlds/magic.jpg",
    },
    {
      key: "tea",
      eyebrow: "The Chinese art of tea",
      title: "Tea",
      essence: "A ceremony that slows the whole room down.",
      description:
        "A gongfu tea ceremony for your guests — fragrance, ritual, and stillness, poured one careful cup at a time.",
      href: "/tea",
      image: "/images/worlds/tea.jpg",
    },
    {
      key: "taichi",
      eyebrow: "Tai chi chuan",
      title: "Tai Chi",
      essence: "Strength that moves like calm.",
      description:
        "Private and group classes in tai chi's moving meditation — balance, breath, and a quiet kind of power.",
      href: "/tai-chi",
      image: "/images/worlds/taichi.jpg",
    },
  ],

  about: {
    eyebrow: "About Ethan",
    title: "A performer who studies attention for a living.",
    body: [
      "Ethan Holtzman works at the meeting point of three disciplines that look nothing alike and share everything: the misdirection of close-up magic, the patience of the Chinese tea ceremony, and the grounded flow of tai chi.",
      "What connects them is presence. A vanishing coin, the first pour of an oolong, a slow turn through a form — each one is really the same craft: holding a room's full attention, and handing it something to remember.",
    ],
  },

  proof: {
    heading: {
      eyebrow: "Kind words",
      title: "Rooms remember how you make them feel.",
    },
    items: [
      {
        quote:
          "Our guests are still talking about the magician. He worked the whole room and not one person looked away.",
        author: "Marisa T.",
        context: "Private event, Brooklyn",
      },
      {
        quote:
          "The tea ceremony was the most calming thirty minutes of our retreat. Genuinely unforgettable.",
        author: "David L.",
        context: "Corporate retreat",
      },
      {
        quote:
          "I came for the tai chi and stayed for the calm. Ethan is patient, precise, and impossible not to like.",
        author: "Priya N.",
        context: "Weekly class",
      },
    ],
  },

  process: {
    heading: {
      eyebrow: "How it works",
      title: "From hello to wonder, in three steps.",
    },
    steps: [
      {
        title: "Tell Ethan the occasion",
        description:
          "Your date, your guests, and the world you have in mind — magic, tea, or tai chi.",
      },
      {
        title: "Shape the experience",
        description:
          "Ethan tailors the performance or class to your room, your timing, and your crowd.",
      },
      {
        title: "Share the wonder",
        description:
          "He reads the room and gives your guests a moment they will be talking about long after.",
      },
    ],
  },

  cta: {
    title: "Bring wonder to your next gathering.",
    body: "Private events, parties, retreats, and weekly classes — book the experience your guests will not stop talking about.",
    primary: { label: "Book Ethan", href: "#contact" },
    secondary: { label: "See the three worlds", href: "#worlds" },
  },

  contact: {
    eyebrow: "Get in touch",
    title: "Let's make your event unforgettable.",
    intro:
      "Tell Ethan what you are planning, or text him directly — he reads every message himself.",
  },
};
