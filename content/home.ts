/**
 * Landing page copy for The Red Flying Dragon. English (US audience).
 *
 * Sections marked "handoff" started as copy transcribed from Ethan's
 * `redflyingdragondevhandoff.md` (8/20/26), archived in
 * `docs/specs/033-content-handoff-2026-08/source-handoff.md`. Since 2026-10-11
 * Ethan edits this file directly (spec 036): this file is the source of truth.
 *
 * 2026-10-11 refocus: the site is tea and tai chi only. Magic, the service
 * price list and the free/busy calendar are gone; private sessions are booked
 * on The Tea Temple (SITE.booking), and the only prices on the page are the
 * teas in the shop.
 */
import { SITE } from "./site";

export interface HeroCta {
  label: string;
  href: string;
}

export interface HeroContent {
  eyebrow: string;
  /** Where Ethan works, shown under the eyebrow. */
  region: string;
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
  /** Small spaced line under the card's emblem (e.g. "Gongfu Cha"). */
  subtitle: string;
  /** Invitation shown inside the card when "revealed" (tap Book to plan). */
  blurb: string;
  /** Where the card's "Book" goes: an on-page anchor or the booking site. */
  bookHref: string;
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
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: PracticeImage;
}

/** "Enter the Tea Temple": the invitation to book a private session. */
export interface BookContent {
  eyebrow: string;
  title: string;
  body: string;
  /** The five beats of a session, shown as one quiet line. */
  steps: string[];
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  image: PracticeImage;
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
    /** Same idea for the provider chrome below the media (likes, caption). */
    cropBottom?: number;
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

export interface ContactContent extends SectionIntro {
  /** One line above the form pointing private sessions to The Tea Temple. */
  templeNote: string;
  templeLinkLabel: string;
}

export interface HomeContent {
  hero: HeroContent;
  worldsHeading: SectionIntro;
  worlds: World[];
  practices: Practice[];
  yinYang: YinYangContent;
  book: BookContent;
  bookingPolicy: BookingPolicyContent;
  about: AboutContent;
  reviewsHeading: SectionIntro;
  reviews: Review[];
  connect: ConnectContent;
  teaList: TeaListContent;
  classesCalendar: CalendarContent;
  events: EventsContent;
  contact: ContactContent;
}

export const HOME: HomeContent = {
  hero: {
    eyebrow: "Tea & Tai Chi",
    region: "Serving San Francisco, the Bay Area & beyond",
    title: "The Red Flying Dragon",
    subtitle:
      "Taiwanese gongfu tea and Yang-style Tai Chi with Ethan Holtzman. Private ceremonies, classes, and teas to take home.",
    primaryCta: { label: "Explore the practice", href: "#worlds" },
    secondaryCta: { label: "Shop the tea", href: "#shop" },
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
      subtitle: "Gongfu Cha",
      essence: "A ceremony that slows the whole room down.",
      blurb:
        "A private gongfu ceremony for you and your guests, at the Tea Temple or in your home. Tap Book to choose a time.",
      bookHref: SITE.booking.url,
      symbol: "tea",
    },
    {
      key: "taichi",
      eyebrow: "Tai chi chuan",
      title: "Tai Chi",
      subtitle: "Taiji Quan",
      essence: "Strength that moves like calm.",
      blurb:
        "Book a tai chi class, a private lesson, or a performance for your event. Breath, balance, a quiet power. Tap Book to plan it.",
      bookHref: "#contact",
      symbol: "taichi",
    },
    {
      key: "yinyang",
      eyebrow: "Balance",
      title: "Yin & Yang",
      subtitle: "Tea & Tai Chi",
      essence: "Where tea meets tai chi.",
      blurb:
        "Book the full experience. Tea and tai chi together, stillness and motion in one evening. Tap Book to plan it.",
      bookHref: "#contact",
      symbol: "yinyang",
    },
  ],

  // handoff — Tea Ceremony / Tai Chi (tightened 2026-10-11)
  practices: [
    {
      key: "tea",
      id: "tea-ceremony",
      eyebrow: "The Chinese art of tea",
      title: "Tea Ceremony",
      short:
        "Gongfu cha: the art of tea, done slowly. Small clay vessels, patient steepings, full attention.",
      body: "It's Taiwan's tradition of “tea made with skill”: high-mountain oolongs steeped again and again, each pour a little different from the last. I guide you through the whole ritual, the smell of the leaf, the sound of the pour, the way the taste opens over rounds. No tea knowledge required. Just come and taste.",
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
      cta: { label: "Book a tea session", href: SITE.booking.url },
    },
    {
      key: "taichi",
      id: "tai-chi",
      eyebrow: "Tai chi chuan",
      title: "Tai Chi",
      short:
        "An internal martial art: soft on the outside, powerful underneath, moved by breath and cultivated inner energy.",
      body: "I teach the Yang-style forms passed down by my teacher, Sifu Chen, in Taipei. Slow, deliberate movement that builds balance, root, and a calm nervous system. Some call it moving meditation. I call it strength that doesn't announce itself.",
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
        // NOTE (blocker: photo needed from Ethan). The handoff's 4th starter
        // caption, "Golden Rooster Stands on One Leg", is written and correct in
        // content/captions.ts but reaches no <figcaption>, because it is keyed
        // to /images/worlds/taichi.jpg - a WebGL deck texture that is a stock
        // placeholder of a hand holding a phone. Hanging a posture caption on
        // that photo would caption a lie, so the slot stays empty until Ethan
        // sends a frame that actually shows the posture; then add it here and
        // rekey the caption to the new path. Tracked by the pending-photo list
        // in content/captions.test.ts.
      ],
      cta: { label: "Begin your practice", href: "#contact" },
    },
  ],

  // handoff — Yin & Yang (Combined)
  yinYang: {
    eyebrow: "Tea + Tai Chi",
    title: "Yin & Yang",
    body: "Tea slows you down. Tai Chi grounds you. Together, they're a full evening of stillness and motion, a ceremony for the body and the senses, shaped around your space and your group.",
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
  },

  // Private sessions are booked on The Tea Temple (entertheteatemple.com).
  book: {
    eyebrow: "Private sessions",
    title: "Enter the Tea Temple",
    body: "Taiwanese oolong, unhurried conversation, and a few minutes of grounding. In my tea room in San Francisco, or brought to you anywhere in the Bay Area, for one to five guests.",
    steps: ["Arrive", "Settle", "Ground", "Share", "Reconnect"],
    primaryCta: { label: "Enter the Tea Temple", href: SITE.booking.url },
    secondaryCta: {
      label: "Planning an event? Write to Ethan",
      href: "#contact",
    },
    image: {
      src: "/images/tea/tea-pouring-smiling.jpg",
      alt: "Ethan Holtzman smiling while pouring tea for his guests",
    },
  },

  bookingPolicy: {
    title: "Booking policy",
    teaser: "Paid in full when the date is confirmed",
    items: [
      {
        label: "Payment",
        text: "The full amount is charged when the booking is confirmed, not a deposit. Ethan sends a secure payment link once your date and details are set.",
      },
      {
        label: "Cancellation",
        text: "Full refund if cancelled 72+ hours out. Inside 72 hours: one free reschedule, no refund. No-shows forfeit the full payment.",
      },
      {
        label: "Weather (outdoor Tai Chi)",
        text: "Host's call, reschedule at no cost.",
      },
    ],
  },

  about: {
    eyebrow: "About",
    title: "About Ethan",
    paragraphs: [
      "I trained as a gongfu tea apprentice in Taiwan and Los Angeles, learning the ceremony leaf by leaf, steep by steep. Today I work with growers and importers to bring those teas home to San Francisco.",
      "In Taipei I trained under my teacher, Sifu Chen: Yang 37 Tai Chi as a 5th-generation practitioner, and Whooping White Crane as a 4th. Both are internal arts, built on breath, root, and quiet inner strength.",
      "Two practices, one thread: helping people slow down, come back into their bodies, and feel something real, whether it's a form moving through stillness or a tea opening over six steepings. Come find out for yourself.",
    ],
    image: {
      src: "/images/hero-ethan-tea.jpg",
      alt: "Portrait of Ethan Holtzman pouring tea",
    },
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
        note: "tea and Tai Chi, behind the scenes",
        // Instagram has no profile embed (Meta only exposes single posts, and
        // the profile page is login-walled). So the card embeds a real post
        // from the account and links out to the profile.
        embed: {
          url: "https://www.instagram.com/p/DWncQMrDiLr/embed",
          frameTitle: "Instagram post from @theredflyingdragon",
          ratio: "portrait",
          cropTop: 56,
          cropBottom: 140,
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
        // youtube-nocookie.com, not youtube.com: the regular host pulls in
        // Google's ad stack (googleads.g.doubleclick.net, ad_status.js) on load,
        // and the page carries no consent banner.
        embed: {
          url: "https://www.youtube-nocookie.com/embed/2aR6WcCRUPk?rel=0",
          frameTitle: "The Third Steep podcast episode",
        },
      },
    ],
  },

  // handoff — Join the Tea List
  teaList: {
    eyebrow: "Newsletter",
    title: "Join the Tea List",
    body: "Upcoming ceremonies, Tai Chi sessions, and the occasional limited release, straight to your inbox. No spam, just the good stuff.",
    nameLabel: "Name",
    emailLabel: "Email",
    buttonLabel: "Join the list",
    successMessage: "You're on the list. Watch your inbox.",
    errorMessage: "Something went wrong. Please try again in a moment.",
  },

  // handoff — public Tai Chi class schedule (drawn from the calendar feed)
  classesCalendar: {
    title: "Upcoming Tai Chi Sessions",
    body: "Regular sessions, open to join. Dates, times, and locations below.",
    cta: "View the schedule",
    frameTitle: "Tai Chi class schedule calendar",
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
      "Planning an event, a Tai Chi class, or a tea evening for your team? Tell Ethan what you have in mind and he will reply personally.",
    templeNote: "Booking a private tea session?",
    templeLinkLabel: "Go straight to the Tea Temple",
  },
};
