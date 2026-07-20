/** Landing page copy for The Red Flying Dragon. English (US audience). */

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
/** A card front is drawn from its symbol (no photo). See makeCardFaceTextures. */
export type WorldSymbol = WorldKey;

export interface World {
  key: WorldKey;
  eyebrow: string;
  title: string;
  essence: string;
  /** Invitation shown inside the card when "revealed" (tap Book to plan). */
  blurb: string;
  /** Drawn-icon identifier for the canvas card face. */
  symbol: WorldSymbol;
}

export interface SectionIntro {
  eyebrow: string;
  title: string;
  intro?: string;
}

export interface OpportunityImage {
  src: string;
  alt: string;
}

export interface Opportunity {
  key: "tea" | "taichi";
  eyebrow: string;
  title: string;
  description: string;
  formats: string[];
  image: OpportunityImage;
  /** Extra real photos shown alongside the main one (small gallery strip). */
  gallery: OpportunityImage[];
  cta: HeroCta;
}

export interface Review {
  quote: string;
  name: string;
  role?: string;
}

export interface HomeContent {
  hero: HeroContent;
  worldsHeading: SectionIntro;
  worlds: World[];
  opportunitiesHeading: SectionIntro;
  opportunities: Opportunity[];
  reviewsHeading: SectionIntro;
  reviews: Review[];
  contact: SectionIntro;
}

export const HOME: HomeContent = {
  hero: {
    eyebrow: "The Red Flying Dragon",
    title: "Tea, tai chi, and the calm in between.",
    subtitle:
      "Ethan Holtzman pours the Chinese art of tea and teaches the moving meditation of tai chi, a ceremony that slows the whole room down.",
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
      blurb:
        "Book a private tea tasting. A gongfu ceremony performed for you and your guests. Tap Book to choose a date.",
      symbol: "tea",
    },
    {
      key: "taichi",
      eyebrow: "Tai chi chuan",
      title: "Tai Chi",
      essence: "Strength that moves like calm.",
      blurb:
        "Book a tai chi performance or class for your event. Breath, balance, a quiet power. Tap Book to plan a date.",
      symbol: "taichi",
    },
    {
      key: "yinyang",
      eyebrow: "Balance",
      title: "Yin & Yang",
      essence: "Where tea meets tai chi.",
      blurb:
        "Book the full experience. Tea and tai chi together, stillness and motion in one evening. Tap Book to plan it.",
      symbol: "yinyang",
    },
  ],

  opportunitiesHeading: {
    eyebrow: "What you can book",
    title: "Two practices. One presence.",
  },

  opportunities: [
    {
      key: "tea",
      eyebrow: "The Chinese art of tea",
      title: "A ceremony that slows the room down.",
      description:
        "Gongfu cha is a Chinese tea tradition: small clay vessels, the same leaves steeped again and again, each infusion drawing out a new layer of flavor. Ethan pours it as a guided ceremony, part ritual, part conversation, that turns a simple cup of tea into a shared, unhurried moment.",
      formats: ["Intimate tasting", "Group session", "Private event"],
      image: {
        src: "/images/tea/tea-pouring-smiling.jpg",
        alt: "Ethan Holtzman smiling while pouring tea for guests during a ceremony",
      },
      gallery: [
        {
          src: "/images/tea/tea-friends-smiling.jpg",
          alt: "A group of friends smiling together during a tea tasting",
        },
        {
          src: "/images/tea/tea-ceremony-fire.jpg",
          alt: "Ethan Holtzman seated at a tea ceremony in a red silk jacket, warm light around him",
        },
        {
          src: "/images/tea/tea-spread-overhead.jpg",
          alt: "An overhead view of a full gongfu tea spread with cups, pots, and food",
        },
      ],
      cta: { label: "Reserve a tasting", href: "#contact" },
    },
    {
      key: "taichi",
      eyebrow: "Tai chi chuan",
      title: "Strength that moves like calm.",
      description:
        "Tai chi is moving meditation: slow, deliberate forms that build balance, breath control, and a quiet kind of power. Ethan teaches it one on one or in small groups, meeting each student at their own pace, indoors or outside.",
      formats: ["Private lesson", "Small group", "Event performance"],
      image: {
        src: "/images/tai-chi/tai-chi-teaching.jpg",
        alt: "Ethan Holtzman teaching a tai chi stance to a student outdoors",
      },
      gallery: [
        {
          src: "/images/tai-chi/tai-chi-teaching-2.jpg",
          alt: "Ethan Holtzman guiding a student through a tai chi movement",
        },
        {
          src: "/images/tai-chi/master-and-ethan.jpg",
          alt: "Ethan Holtzman standing together with his tai chi master",
        },
      ],
      cta: { label: "Begin your practice", href: "#contact" },
    },
  ],

  reviewsHeading: {
    eyebrow: "What people feel",
    title: "Don't take our word for it.",
  },

  reviews: [
    {
      quote:
        "Working with Ethan was delightful from beginning to end. He was calm, charismatic, and completely in tune with our guests. The ceremony was educational and entertaining, the tea itself was delicious, and the whole evening flew by. I will absolutely work with him again.",
      name: "Cathy Cao",
      role: "Founder",
    },
    {
      quote:
        "Ethan creates a warm, intimate atmosphere from the first moment. His knowledge of tea runs deep, and he shares it with genuine passion and humor. Two hours passed like twenty minutes.",
      name: "Lucy Shen",
      role: "Brand Marketing Manager",
    },
    {
      quote:
        "Ethan is charismatic and creates such a warm, inviting space to connect and drink delicious tea. It is an experience unlike anything else.",
      name: "Sydney Devlin",
      role: "Social Media Manager",
    },
    {
      quote:
        "You will never forget your night with Ethan. He evokes every sense, touch, smell, taste, sight. You need to experience it to believe it.",
      name: "Doug Richard",
      role: "Brand Designer",
    },
    {
      quote:
        "What made Ethan's tea ceremony so extraordinary was his warmth and engaging personality. Every cup became a truly memorable experience, filled with laughter, thoughtful conversation, and quiet appreciation.",
      name: "Dana",
    },
    {
      quote:
        "Ethan gives a meticulous and mesmerizing tea ceremony. I learned so much about tea and how preparation affects the taste. He is funny, engaging, and happy to answer every question.",
      name: "Mary T.",
    },
  ],

  contact: {
    eyebrow: "Get in touch",
    title: "Talk to Ethan.",
    intro:
      "Tell Ethan what you have in mind, a tea tasting, a tai chi session, or both, and he will reply to you personally.",
  },
};
