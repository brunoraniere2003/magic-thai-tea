/**
 * Landing page copy for The Red Flying Dragon. English (US audience).
 *
 * Sections marked "handoff" carry copy transcribed verbatim from Ethan's
 * `redflyingdragondevhandoff.md` (8/20/26) — the archived source of truth lives
 * in `docs/specs/033-content-handoff-2026-08/source-handoff.md`. Do not
 * paraphrase it here; edit the doc, re-archive, then update this file.
 */

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

export interface PracticeImage {
  src: string;
  alt: string;
  /** Crop focus for object-cover (default "center"). */
  position?: "center" | "top";
}

/** One bookable practice, rendered as its own section (Tea, then Tai Chi). */
export interface Practice {
  key: "tea" | "taichi";
  /** Anchor id, used by the nav and by in-page CTAs. */
  id: string;
  eyebrow: string;
  title: string;
  /** Handoff "short" line — the lead, next to the CTA. */
  short: string;
  /** Handoff "body copy". */
  body: string;
  formats: string[];
  image: PracticeImage;
  /** Extra real photos shown alongside the main one (small gallery strip). */
  gallery: PracticeImage[];
  cta: HeroCta;
}

export interface YinYangContent {
  eyebrow: string;
  title: string;
  body: string;
  cta: HeroCta;
  /** The two halves, shown side by side. */
  images: [PracticeImage, PracticeImage];
  /** Which Services tier this block quotes. */
  tierId: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: PracticeImage;
}

export interface PricingRow {
  /** Stable handle, so other sections can quote a tier without matching text. */
  id: string;
  /** First column: the tier or offering name. */
  name: string;
  included: string;
  /** Omitted by the compact (magic) table. */
  groupSize?: string;
  duration: string;
  price: string;
}

export interface ServicesContent {
  eyebrow: string;
  title: string;
  intro: string;
  tiers: PricingRow[];
  /** Footnote under the table. */
  addOns: string;
}

export interface BookingPolicyItem {
  label: string;
  text: string;
}

export interface BookingPolicyContent {
  title: string;
  /** One line shown while the terms are collapsed. */
  teaser: string;
  items: BookingPolicyItem[];
}

export interface MagicContent {
  eyebrow: string;
  /** Handoff section heading: "Also: Wonder, on Request". */
  title: string;
  body: string;
  cta: HeroCta;
  offerings: PricingRow[];
}

export interface Review {
  quote: string;
  name: string;
  role?: string;
}

/** How a channel previews itself on the card. */
export interface ConnectPreview {
  /** "letter" = drawn panel, "grid" = mini feed, "portrait" = one photo. */
  kind: "letter" | "grid" | "portrait";
  images: PracticeImage[];
}

export interface ConnectLink {
  label: string;
  value: string;
  href: string;
  note?: string;
  preview: ConnectPreview;
  /** Real third-party embed, when the platform allows one. */
  embed?: {
    url: string;
    frameTitle: string;
    /**
     * True when the embed shows someone else's content while Ethan's is not
     * available yet. The card labels it, so nobody reads it as his.
     */
    placeholder?: boolean;
    /** Frame shape: the Instagram post is tall, a video is 16:9. */
    ratio?: "video" | "portrait";
    /**
     * Pixels of the provider's own chrome to clip off the top. Instagram
     * renders a white header we do not want on a dark page.
     */
    cropTop?: number;
  };
}

export interface ConnectContent {
  eyebrow: string;
  title: string;
  links: ConnectLink[];
}

export interface TeaListContent {
  eyebrow: string;
  title: string;
  body: string;
  nameLabel: string;
  emailLabel: string;
  buttonLabel: string;
  successMessage: string;
  errorMessage: string;
}

/** One calendar embed (class schedule or free/busy availability). */
export interface CalendarContent {
  title: string;
  body: string;
  cta: string;
  /** Accessible title for the iframe. */
  frameTitle: string;
}

export interface EventEntry {
  title: string;
  /** ISO date (YYYY-MM-DD) so it can be sorted and formatted. */
  date: string;
  location: string;
  blurb: string;
}

export interface EventsContent {
  eyebrow: string;
  title: string;
  /** Empty at launch (blocker B5): the section does not render. */
  items: EventEntry[];
}

export interface HomeContent {
  hero: HeroContent;
  worldsHeading: SectionIntro;
  worlds: World[];
  practices: Practice[];
  yinYang: YinYangContent;
  services: ServicesContent;
  bookingPolicy: BookingPolicyContent;
  about: AboutContent;
  magic: MagicContent;
  reviewsHeading: SectionIntro;
  reviews: Review[];
  connect: ConnectContent;
  teaList: TeaListContent;
  classesCalendar: CalendarContent;
  availabilityCalendar: CalendarContent;
  events: EventsContent;
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

  // handoff — Tea Ceremony / Tai Chi
  practices: [
    {
      key: "tea",
      id: "tea-ceremony",
      eyebrow: "The Chinese art of tea",
      title: "Tea Ceremony",
      short:
        "Gongfu cha — the art of tea, done slowly. Small clay vessels, patient steepings, full attention. A ritual that invokes quiet serenity and joy — bring your curiosity, come learn and explore.",
      body: "Gongfu cha is Taiwan's tradition of “tea made with skill” — high-mountain oolongs and aged teas steeped again and again in small clay vessels, each pour a little different from the last. It's less a drink than a pace: unhurried, sensory, present. I lead you through the full ceremony — the smell of the leaf, the sound of the pour, the way the taste unfolds over rounds — as a shared ritual of hospitality, curiosity, and quiet joy. No tea knowledge required. Just come and taste.",
      formats: ["Intimate tasting", "Group session", "Private event"],
      image: {
        src: "/images/tea/tea-ceremony-fire.jpg",
        alt: "Ethan Holtzman seated at a tea ceremony in a red silk jacket, warm light around him",
      },
      gallery: [
        {
          src: "/images/tea/tea-friends-smiling.jpg",
          alt: "A group of friends smiling together during a tea tasting",
        },
        {
          src: "/images/tea/tea-spread-overhead.jpg",
          alt: "An overhead view of a full gongfu tea spread with cups, pots, and food",
          position: "top",
        },
        {
          src: "/images/tea/tea-pouring-smiling.jpg",
          alt: "Ethan Holtzman smiling while pouring tea for guests during a ceremony",
        },
      ],
      cta: { label: "Reserve a tasting", href: "#contact" },
    },
    {
      key: "taichi",
      id: "tai-chi",
      eyebrow: "Tai chi chuan",
      title: "Tai Chi",
      short:
        "Tai Chi trains soft but powerful movement, generated from cultivated inner energy — an internal art, a discipline of qigong.",
      body: "Tai Chi is an internal martial art — soft on the outside, powerful underneath, generated from breath and cultivated inner energy rather than muscle. Trained through the Yang-style forms passed down by my teacher, Sifu Chen, in Taipei, it builds balance, root, and a calm nervous system through slow, deliberate movement. Some call it moving meditation. I call it strength that doesn't announce itself.",
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

  // handoff — Yin & Yang (Combined)
  yinYang: {
    eyebrow: "Balance",
    title: "Yin & Yang",
    body: "Tea slows you down. Tai Chi grounds you. Together, they're a full evening of stillness and motion — a ceremony for the body and the senses, shaped around your space and your group.",
    cta: { label: "Plan the full evening", href: "#contact" },
    images: [
      {
        src: "/images/tea/tea-spread-overhead.jpg",
        alt: "A full gongfu tea spread seen from above, cups and pots laid out",
        position: "top",
      },
      {
        src: "/images/tai-chi/tai-chi-teaching-2.jpg",
        alt: "Ethan Holtzman guiding a student through a tai chi movement outdoors",
      },
    ],
    tierId: "yin-yang",
  },

  // handoff — Services (primary pricing table)
  services: {
    eyebrow: "What you can book",
    title: "Tea & Tai Chi",
    intro:
      "Every booking is shaped around your space and your group. Tell Ethan what you have in mind and he will quote it properly.",
    tiers: [
      {
        id: "tea-tasting",
        name: "Tea Ceremony (Tasting)",
        included:
          "Guided gongfu tasting, 4–6 steepings across 1–2 teas, ritual + story + conversation",
        groupSize: "2–8 guests",
        duration: "90 min–2 hrs",
        price: "$250–$450 flat, or $60–$85/person for larger groups",
      },
      {
        id: "yin-yang",
        name: "Yin & Yang (Tea + Tai Chi)",
        included:
          "45–60 min guided Tai Chi (grounding, breath, a few forms) followed by the full tea ceremony",
        groupSize: "4–12 guests",
        duration: "2.5–3 hrs",
        price: "$550–$900",
      },
      {
        id: "extended-workshop",
        name: "Extended Workshop / Event",
        included:
          "Full immersive: Tai Chi instruction + tea ceremony, optional magic close as a finale, take-home toolkit (tea sample + form reference card)",
        groupSize: "10–30+ (event/corporate scale)",
        duration: "Half-day or 3–4 hrs",
        price: "Custom quote, starting ~$1,500",
      },
    ],
    addOns:
      "Add-ons: private 1:1 lesson, magic set (15–20 min close-up), extra tea flight, travel fee beyond ~20 miles.",
  },

  // handoff — Booking Policy
  bookingPolicy: {
    title: "Booking policy",
    teaser: "50% deposit, free reschedule 72 hours out",
    items: [
      {
        label: "Deposit",
        text: "50% non-refundable to hold the date, balance due day-of. Private lessons under ~$150: 100% upfront.",
      },
      {
        label: "Cancellation",
        text: "Full refund or free reschedule 72+ hours out. Inside 72 hours: deposit forfeited, one reschedule still allowed. No-shows forfeit full payment.",
      },
      {
        label: "Weather (outdoor Tai Chi)",
        text: "Host's call, reschedule at no cost.",
      },
    ],
  },

  // handoff — About Ethan
  about: {
    eyebrow: "About",
    title: "About Ethan",
    paragraphs: [
      "I come from a family of magicians — mine goes back generations, with names well known in the craft of wonder. I grew up backstage before I grew up anywhere else, and sleight of hand was the first language I learned for presence, timing, and connection.",
      "That same instinct carried me into tea and into Tai Chi. In Taiwan, I trained as a gongfu tea specialist, learning the ceremony leaf by leaf, steep by steep, and now work directly with growers and importers to bring that tradition home. In Taipei, I studied Tai Chi and White Crane under my teacher, Sifu Chen — an internal art built on breath, root, and cultivated inner strength.",
      "Three crafts, one thread: helping people slow down, pay attention, and feel something real — whether it's a card vanishing in your hand, a form moving through stillness, or a tea opening over six steepings. Come find out for yourself.",
    ],
    image: {
      src: "/images/hero-ethan-tea.jpg",
      alt: "Portrait of Ethan Holtzman pouring tea",
    },
  },

  // handoff — Magic (back on the page: ADR 0012)
  magic: {
    eyebrow: "Magic",
    title: "Also: Wonder, on Request",
    body: "Magic runs in my family — literally, generations deep, in a family of world-renowned magicians. It's where I learned presence and timing before I ever picked up a tea pot or trained a form. I still perform and I still teach: close-up walkabout magic for private parties, restaurants, and corporate events; small parlor sets for intimate gatherings; and 1:1 coaching for people who want to learn sleight of hand itself, from fundamentals to advanced technique. Ask about weaving a few minutes of astonishment into your tea or Tai Chi booking — or book magic on its own.",
    cta: { label: "Inquire about magic", href: "#contact" },
    offerings: [
      {
        id: "magic-show",
        name: "Magic Show / Walkabout",
        included:
          "Close-up magic for private events, corporate parties, restaurant walkabout",
        duration: "1–3 hrs",
        price: "$400–$800/hr or $600–$2,000 flat per event",
      },
      {
        id: "magic-coaching",
        name: "Magic Coaching",
        included:
          "1:1 mentorship, sleight of hand fundamentals through advanced technique",
        duration: "60–90 min/session",
        price: "$150–$300/session",
      },
    ],
  },

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

  // handoff — Connect
  connect: {
    eyebrow: "Connect",
    title: "Find me elsewhere",
    links: [
      {
        label: "Email",
        value: "flyingdragontea@gmail.com",
        href: "mailto:flyingdragontea@gmail.com",
        note: "write to Ethan directly",
        // Drawn, not photographed: an inbox has no photo, and the seal keeps
        // the card in the same gold line-art family as the rest of the page.
        preview: { kind: "letter", images: [] },
      },
      {
        label: "Instagram",
        value: "@theredflyingdragon",
        href: "https://www.instagram.com/theredflyingdragon",
        note: "tea, Tai Chi, and magic behind the scenes",
        // Instagram has no profile embed (Meta only exposes single posts, and
        // the profile page is login-walled). So the card embeds a real post
        // from the account and links out to the profile.
        embed: {
          url: "https://www.instagram.com/p/DWncQMrDiLr/embed",
          frameTitle: "Instagram post from @theredflyingdragon",
          ratio: "portrait",
          cropTop: 56,
        },
        preview: {
          kind: "grid",
          images: [
            {
              src: "/images/tea/tea-spread-overhead.jpg",
              alt: "A gongfu tea spread seen from above",
              position: "top",
            },
            {
              src: "/images/tai-chi/tai-chi-teaching-2.jpg",
              alt: "Ethan guiding a student through a tai chi movement",
            },
            {
              src: "/images/tea/tea-friends-smiling.jpg",
              alt: "Friends smiling together during a tea tasting",
            },
          ],
        },
      },
      {
        label: "Podcast",
        value: "The Third Steep",
        href: "https://www.youtube.com/@TheThirdSteep",
        note: "conversations over tea",
        preview: {
          kind: "portrait",
          images: [
            {
              src: "/images/tea/tea-ceremony-fire.jpg",
              alt: "Ethan seated at a tea ceremony in warm light",
            },
          ],
        },
        // PLACEHOLDER (blocker B8). Ethan's channel has no published episode
        // yet, so this plays "Gong Fu Tea|chA" by Tea House Ghost, another
        // gongfu-tea conversation show, only to prove the player and the
        // layout. The card is labelled so no visitor mistakes it for his.
        // To go live: swap the list id for UUbXEDU56uNY-IeExVh1gEeA (his own
        // uploads playlist) and drop `placeholder`.
        embed: {
          url: "https://www.youtube.com/embed/videoseries?list=UUg_-d3VHLMGiM6fuGRB0FtA&rel=0",
          frameTitle: "Sample gongfu tea conversation, standing in for The Third Steep",
          placeholder: true,
        },
      },
    ],
  },

  // handoff — Join the Tea List
  teaList: {
    eyebrow: "Newsletter",
    title: "Join the Tea List",
    body: "Upcoming ceremonies, Tai Chi sessions, magic nights, and the occasional exclusive release — straight to your inbox. No spam, just the good stuff.",
    nameLabel: "Name",
    emailLabel: "Email",
    buttonLabel: "Join the list",
    successMessage: "You're on the list. Watch your inbox.",
    errorMessage: "Something went wrong. Please try again in a moment.",
  },

  // handoff — Calendar / Availability (1 of 2: public class schedule)
  classesCalendar: {
    title: "Upcoming Tai Chi Sessions",
    body: "Regular sessions, open to join — see dates, times, and locations below.",
    cta: "View the schedule",
    frameTitle: "Tai Chi class schedule calendar",
  },

  // handoff — Calendar / Availability (2 of 2: free/busy only)
  availabilityCalendar: {
    title: "See When I'm Free",
    body: "Peek at my calendar before you reach out — open slots are marked, so you know what's realistic before we talk dates.",
    cta: "View availability",
    frameTitle: "Availability calendar, free and busy times only",
  },

  // handoff — Contact / Events. Empty at launch (blocker B5).
  events: {
    eyebrow: "What's next",
    title: "Upcoming Events",
    items: [],
  },

  contact: {
    eyebrow: "Get in touch",
    title: "Talk to Ethan.",
    intro:
      "Tell Ethan what you have in mind, a tea tasting, a tai chi session, or both, and he will reply to you personally.",
  },
};
