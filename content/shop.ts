/**
 * "Shop the Tea" (handoff v2, 3/9/2026; reshaped 2026-10-11).
 *
 * Every product lives on Stripe: each `buyUrl` is a hosted page that owns the
 * real price, the quantity selector, shipping and the receipt. **Stripe is the
 * source of truth for price** — the numbers here are a display copy, so they
 * must be checked by hand against the dashboard before every launch.
 *
 * The page is two symmetric rows of three: the three tiers of single teas
 * (price said once per tier), then the two boxes and the Ginger Elixir, with
 * the full box in the middle. These are the only prices on the whole site.
 *
 * Plates marked `placeholder` are stand-ins (Unsplash license, downloaded into
 * `public/images/shop/` so the page makes no third-party request). They show
 * leaf, steam and liquor — never invented packaging, which would be a claim we
 * cannot make. Swapping in Ethan's real photography is a one-line edit each.
 */

export interface ShopPlate {
  src: string;
  alt: string;
  /** True while this is a stand-in, not Ethan's own photography. */
  placeholder?: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  /** The name as it is written in Chinese. Decorative, hidden from AT. */
  hanzi: string;
  /**
   * Ethan's own tasting note, copied from the Stripe product page — the
   * authority on what he is selling. Never our invention.
   */
  note: string;
  buyUrl: string;
}

/** One tier of single teas: a price, a plate, and the teas under it. */
export interface ShopShelf {
  id: string;
  label: string;
  price: string;
  /** Unit the price buys, printed small next to it. */
  unit: string;
  plate: ShopPlate;
  items: ShopItem[];
}

/** A box or the Elixir: priced on its own, with its own plate. */
export interface ShopBox extends ShopItem {
  price: string;
  /** Small label over the name ("The full box"). */
  eyebrow: string;
  plate: ShopPlate;
  /** The one card that gets the gold frame and the filled button. */
  featured?: boolean;
}

export interface ShopContent {
  eyebrow: string;
  title: string;
  body: string;
  /** One quiet line under the title: checkout, quantity, shipping. */
  fineprint: string[];
  /** Turnaround time, once Ethan confirms it (blocker B13). */
  turnaround?: string;
  /** Labels over the two rows. */
  rows: { teas: string; collection: string };
  shelves: ShopShelf[];
  /** Second row, left to right; the featured one sits in the middle. */
  collection: ShopBox[];
  /** Accessible name prefix: the visitor learns where the click lands. */
  buyLabel: string;
  /** What the buy control visibly says. */
  buyText: string;
}

const plate = (name: string, alt: string): ShopPlate => ({
  src: `/images/shop/plate-${name}.jpg`,
  alt,
  placeholder: true,
});

export const SHOP: ShopContent = {
  eyebrow: "Shop",
  title: "Shop the Tea",
  body: "Single-origin Taiwanese oolongs in 15g pouches. Take the ceremony home.",
  buyLabel: "Buy on Stripe",
  buyText: "Buy",

  fineprint: [
    "$8.95 flat shipping per order, U.S. only",
    "Choose quantity at checkout",
    "Secure checkout by Stripe",
  ],

  rows: { teas: "Single teas", collection: "Boxes & Elixir" },

  shelves: [
    {
      id: "everyday",
      label: "Everyday",
      price: "$10",
      unit: "/ 15g",
      plate: plate("everyday", "Tea being poured from a small clay pot in low light"),
      items: [
        {
          id: "bao-zhong",
          name: "Bao Zhong",
          hanzi: "包種",
          note: "Floral, umami.",
          buyUrl: "https://buy.stripe.com/7sY00cgcu6Ez4SUgN4eEo0f",
        },
        {
          id: "jin-xuan",
          name: "Jin Xuan",
          hanzi: "金萱",
          note: "Floral, creamy, milky.",
          buyUrl: "https://buy.stripe.com/8x200c7FY0gbbhi1SaeEo0g",
        },
      ],
    },
    {
      id: "signature",
      label: "Signature",
      price: "$12",
      unit: "/ 15g",
      plate: plate("signature", "A gaiwan being poured, steam rising over a dark table"),
      items: [
        {
          id: "alishan",
          name: "Alishan Oolong",
          hanzi: "阿里山",
          note: "Floral, fruity.",
          buyUrl: "https://buy.stripe.com/4gM00c5xQbYTade7cueEo0h",
        },
        {
          id: "dong-ding",
          name: "Dong Ding",
          hanzi: "凍頂",
          note: "Vintage style, roasted.",
          buyUrl: "https://buy.stripe.com/00wdR27FY1kf4SU9kCeEo0i",
        },
      ],
    },
    {
      id: "reserve",
      label: "Reserve",
      price: "$15",
      unit: "/ 15g",
      plate: plate("reserve", "Amber tea liquor in small cups, seen from above"),
      items: [
        {
          id: "oriental-beauty",
          name: "Oriental Beauty",
          hanzi: "東方美人",
          note: "Rare varietal. Honey, citrus.",
          buyUrl: "https://buy.stripe.com/00wdR23pI9QL0CE1SaeEo0j",
        },
        {
          id: "ruby-oolong",
          name: "Ruby Oolong",
          hanzi: "紅玉",
          note: "Rich, ripe fruit.",
          buyUrl: "https://buy.stripe.com/aFa00c2lEbYT99a9kCeEo0k",
        },
      ],
    },
  ],

  collection: [
    {
      id: "six-tea-sampler",
      name: "Six-Tea Sampler",
      hanzi: "六品",
      eyebrow: "Box",
      // The full box beside it includes the Elixir; say plainly this one does
      // not, or a $74 buyer may expect it in the parcel.
      note: "One 15g pack of each of the six teas. Elixir not included.",
      price: "$74",
      plate: {
        src: "/images/tea/tea-spread-overhead.jpg",
        alt: "A full gongfu tea spread seen from above, cups and pots laid out",
      },
      buyUrl: "https://buy.stripe.com/00w9AMbWe9QL2KM54meEo0n",
    },
    {
      id: "dragons-feast",
      name: "Dragon's Feast",
      hanzi: "全席",
      eyebrow: "The full box",
      note: "All six teas plus the Ginger Elixir, shipped as one order.",
      price: "$79",
      featured: true,
      plate: plate("boxes", "A full gongfu tea setting laid out in warm light"),
      buyUrl: "https://buy.stripe.com/7sY6oA9O65Av8567cueEo0o",
    },
    {
      id: "ginger-elixir",
      name: "Ginger Elixir",
      hanzi: "黑糖薑茶",
      eyebrow: "Elixir · per pack",
      note: "Black Sugar, Ginger, Longan Fruit, Jujube (Red Date).",
      price: "$5",
      plate: plate("remedy", "Ginger and dried fruit beside a warm cup"),
      buyUrl: "https://buy.stripe.com/7sY14ggcu0gb99adASeEo0l",
    },
  ],
};

/** Every purchasable thing on the page: the single teas, then the second row. */
export function allShopItems(): (ShopItem & { price?: string })[] {
  return [...SHOP.shelves.flatMap((shelf) => shelf.items), ...SHOP.collection];
}

/** What an item costs: its own price if it has one, else its tier's. */
export function priceOf(item: ShopItem): string {
  const own = SHOP.collection.find((b) => b.id === item.id);
  if (own) return own.price;
  const shelf = SHOP.shelves.find((s) => s.items.some((i) => i.id === item.id));
  return shelf ? shelf.price : "";
}

/** Accessible name for a buy control: never just "Buy" ten times over. */
export function buyLabelFor(item: ShopItem): string {
  return `${SHOP.buyLabel}: ${item.name}, ${priceOf(item)}`;
}
