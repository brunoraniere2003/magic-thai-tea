/**
 * The "Gongfu tea ceremony in San Francisco" page (teardown play 1, 2026-11-19).
 * It answers what people ask on Reddit: where in the Bay Area can someone
 * guide me through gongfu tea? No prices here except SITE.gathering.
 */
export const GONGFU = {
  path: "/gongfu-tea-san-francisco",
  seoTitle: "Gongfu Tea Ceremony in San Francisco | The Red Flying Dragon",
  seoDescription:
    "A guided Taiwanese gongfu tea ceremony in San Francisco and the Bay Area with Ethan Holtzman. Private tastings for 1-5 guests, team events for 6 or more, and online sessions.",
  eyebrow: "San Francisco & the Bay Area",
  title: "A guided gongfu tea ceremony in San Francisco.",
  intro:
    "Gongfu cha is the Chinese way of brewing tea with care: a small pot or gaiwan, a lot of leaf, and many short steepings. Most tea shops in the city sell the leaf. I come to you, brew it in front of you, and explain each step as we go.",
  whatHappens: {
    title: "What happens in a session",
    steps: [
      {
        title: "Warming the teaware",
        text: "Hot water over the pot, the pitcher and the cups, so the tea keeps its heat and its aroma.",
      },
      {
        title: "Waking the leaf",
        text: "A quick first rinse. You smell the dry leaf, then the wet leaf, and notice how it changes.",
      },
      {
        title: "Many short steepings",
        text: "Each infusion lasts seconds, not minutes. We taste how the same tea opens over six steepings or more.",
      },
      {
        title: "Questions, all the way through",
        text: "Where the tea grew, how it was made, how to brew it at home. Nothing is too basic to ask.",
      },
    ],
  },
  forWho: {
    title: "Three ways to sit down for tea",
    options: [
      {
        title: "Just you, or up to five guests",
        text: "A private tasting, booked on The Tea Temple.",
        cta: { label: "Book a private tasting", href: "https://entertheteatemple.com/#book" },
      },
      {
        title: "Teams and groups of six or more",
        text: "I bring the ceremony to your office, offsite or event anywhere in the Bay Area, with Tai Chi if you like.",
        /** Shows SITE.gathering (the one price this site may show). */
        showGatheringPrice: true,
        cta: { label: "Plan a team event", href: "/#contact" },
      },
      {
        title: "From anywhere",
        text: "A private video session: my oolong is mailed to you first, so we brew the same tea side by side.",
        cta: { label: "Book an online session", href: "https://entertheteatemple.com/#online" },
      },
    ],
  },
  about:
    "I trained as a gongfu tea apprentice in Taiwan and Los Angeles, and I work with growers and importers to bring single-origin Taiwanese oolongs home to San Francisco.",
} as const;
