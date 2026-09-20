/**
 * "Shop the Tea" (handoff v2, 3/9/2026).
 *
 * Every product lives on Stripe: each `buyUrl` is a hosted payment page that
 * owns the real price, the quantity selector, shipping and the receipt. This
 * file only holds what the page shows. No cart, no backend, no card data here.
 *
 * Photos are PLACEHOLDERS from Unsplash (free license), downloaded into
 * `public/images/shop/` so the page makes no third-party requests. Swapping in
 * Ethan's real product shots is a one-line edit per item.
 */

export type TeaTier = "Everyday" | "Signature" | "Reserve" | "Elixir";

export interface ShopImage {
  src: string;
  alt: string;
  /** True while this is a stand-in, not the real product shot. */
  placeholder?: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  /** Absent on bundles, which are not graded by tier. */
  tier?: TeaTier;
  /** What the visitor gets, in Ethan's words where he wrote them. */
  detail: string;
  /** Shown as-is. The authority is the Stripe page. */
  price: string;
  /** Stripe-hosted checkout for this item. */
  buyUrl: string;
  image: ShopImage;
}

export interface ShopContent {
  eyebrow: string;
  title: string;
  body: string;
  /** Said before the first click, never after. */
  shipping: string;
  /** Turnaround time, once Ethan confirms it (blocker B13). */
  turnaround?: string;
  teas: ShopItem[];
  bundles: ShopItem[];
  /** Label pattern for the buy control; the tea name makes it unique. */
  buyLabel: string;
}

const PLACEHOLDER = (n: number, alt: string): ShopImage => ({
  src: `/images/shop/placeholder-${n}.jpg`,
  alt,
  placeholder: true,
});

export const SHOP: ShopContent = {
  eyebrow: "Shop",
  title: "Shop the Tea",
  body: "Take the ceremony home. Single-origin teas from Taiwan, packed 15g at a time — enough for several gongfu-style steepings.",
  shipping:
    "Flat $8.95 shipping, US only, added at checkout. Each item is its own order, so a bundle ships cheaper than the same teas bought one by one.",
  buyLabel: "Buy",

  teas: [
    {
      id: "bao-zhong",
      name: "Bao Zhong",
      tier: "Everyday",
      detail: "15g pack",
      price: "$10",
      buyUrl: "https://buy.stripe.com/7sY00cgcu6Ez4SUgN4eEo0f",
      image: PLACEHOLDER(1, "Loose leaf tea in a ceramic dish"),
    },
    {
      id: "jin-xuan",
      name: "Jin Xuan",
      tier: "Everyday",
      detail: "15g pack",
      price: "$10",
      buyUrl: "https://buy.stripe.com/8x200c7FY0gbbhi1SaeEo0g",
      image: PLACEHOLDER(2, "Rolled oolong leaves close up"),
    },
    {
      id: "alishan",
      name: "Alishan Oolong",
      tier: "Signature",
      detail: "15g pack",
      price: "$12",
      buyUrl: "https://buy.stripe.com/4gM00c5xQbYTade7cueEo0h",
      image: PLACEHOLDER(3, "High mountain oolong leaves"),
    },
    {
      id: "dong-ding",
      name: "Dong Ding",
      tier: "Signature",
      detail: "15g pack",
      price: "$12",
      buyUrl: "https://buy.stripe.com/00wdR27FY1kf4SU9kCeEo0i",
      image: PLACEHOLDER(4, "Roasted oolong leaves in a scoop"),
    },
    {
      id: "oriental-beauty",
      name: "Oriental Beauty",
      tier: "Reserve",
      detail: "15g pack",
      price: "$15",
      buyUrl: "https://buy.stripe.com/00wdR23pI9QL0CE1SaeEo0j",
      image: PLACEHOLDER(5, "Amber tea liquor in a small cup"),
    },
    {
      id: "ruby-oolong",
      name: "Ruby Oolong",
      tier: "Reserve",
      detail: "15g pack",
      price: "$15",
      buyUrl: "https://buy.stripe.com/aFa00c2lEbYT99a9kCeEo0k",
      image: PLACEHOLDER(6, "Dark twisted tea leaves"),
    },
    {
      id: "ginger-elixir",
      name: "Ginger Elixir",
      tier: "Elixir",
      detail: "Black sugar, ginger, longan, jujube",
      price: "$5",
      buyUrl: "https://buy.stripe.com/7sY14ggcu0gb99adASeEo0l",
      image: PLACEHOLDER(7, "Ginger root and dried fruit on a wooden board"),
    },
  ],

  bundles: [
    {
      id: "tasting-flight",
      name: "Tasting Flight",
      detail: "Any 3 teas, 15g each. You note your picks at checkout.",
      price: "From $38",
      buyUrl: "https://buy.stripe.com/00w3co9O6aUP99a7cueEo0m",
      image: PLACEHOLDER(8, "Three small tea packets side by side"),
    },
    {
      id: "six-tea-sampler",
      name: "Six-Tea Sampler",
      detail: "One 15g pack of all six teas.",
      price: "$74",
      buyUrl: "https://buy.stripe.com/00w9AMbWe9QL2KM54meEo0n",
      image: PLACEHOLDER(9, "A spread of six different loose leaf teas"),
    },
    {
      id: "dragons-feast",
      name: "Dragon's Feast",
      detail: "The full box: all six teas plus the Ginger Elixir.",
      price: "$79",
      buyUrl: "https://buy.stripe.com/7sY6oA9O65Av8567cueEo0o",
      image: PLACEHOLDER(10, "A full gongfu tea set laid out on a table"),
    },
  ],
};

/** Tea tiers in the order they are poured: light to rare. */
export const TEA_TIERS: TeaTier[] = [
  "Everyday",
  "Signature",
  "Reserve",
  "Elixir",
];

/** The teas of one tier, in the order they appear in SHOP.teas. */
export function teasByTier(tier: TeaTier): ShopItem[] {
  return SHOP.teas.filter((tea) => tea.tier === tier);
}

/** Accessible name for a buy control: never just "Buy" ten times over. */
export function buyLabelFor(item: ShopItem): string {
  return `${SHOP.buyLabel} ${item.name}, ${item.price}`;
}
