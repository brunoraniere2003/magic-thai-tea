/**
 * "Shop the Tea" (handoff v2, 3/9/2026).
 *
 * Every product lives on Stripe: each `buyUrl` is a hosted page that owns the
 * real price, the quantity selector, shipping and the receipt. **Stripe is the
 * source of truth for price** — the numbers here are a display copy, so they
 * must be checked by hand against the dashboard before every launch.
 *
 * The page is shaped like an apothecary cabinet: the price belongs to the
 * SHELF (a tier), not to each drawer, and one photographic plate stands for a
 * whole chapter instead of one stock photo per product.
 *
 * Plates are PLACEHOLDERS (Unsplash license, downloaded into
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
  /** What arrives. Kept factual: no invented tasting notes. */
  note: string;
  buyUrl: string;
}

/** One shelf of the cabinet: a price, a plate, and the drawers under it. */
export interface ShopShelf {
  id: string;
  label: string;
  price: string;
  /** Unit the price buys, printed small next to it. */
  unit: string;
  plate: ShopPlate;
  items: ShopItem[];
}

/** A box has its own price, because each one is a different size of answer. */
export interface ShopBox extends ShopItem {
  price: string;
  /** "lead" gets the plate and the largest type. */
  weight: "lead" | "plain";
}

export interface ShopContent {
  eyebrow: string;
  title: string;
  body: string;
  /** Short lines on the counter plaque, next to the shelves. */
  counter: string[];
  /** The long version, folded away under a disclosure. */
  policy: { title: string; teaser: string; items: { label: string; text: string }[] };
  /** Turnaround time, once Ethan confirms it (blocker B13). */
  turnaround?: string;
  shelves: ShopShelf[];
  boxes: { headline: string; arithmetic: string; plate: ShopPlate; items: ShopBox[] };
  /** Visible on every drawer: the visitor learns where the click lands. */
  buyLabel: string;
}

const plate = (name: string, alt: string): ShopPlate => ({
  src: `/images/shop/plate-${name}.jpg`,
  alt,
  placeholder: true,
});

export const SHOP: ShopContent = {
  eyebrow: "Shop",
  title: "Shop the Tea",
  body: "Take the ceremony home. Single-origin teas from Taiwan, packed 15g at a time — enough for several gongfu-style steepings.",
  buyLabel: "Buy on Stripe",

  counter: [
    "$8.95 flat shipping, U.S. only",
    "One tea, one order — each checkout is separate",
    "Quantity is set on the Stripe page",
  ],

  policy: {
    title: "Shipping & orders",
    teaser: "Flat rate, U.S. only, one order per item",
    items: [
      {
        label: "Shipping",
        text: "$8.95 flat, added automatically at checkout. United States only.",
      },
      {
        label: "Orders",
        text: "Each tea checks out on its own Stripe page, so three single teas are three orders and three shipping fees. A box travels as one.",
      },
      {
        label: "Quantity",
        text: "Set it on the Stripe page: up to 10 packs per tea, up to 5 for the Ginger Elixir.",
      },
    ],
  },

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
          note: "15g pack",
          buyUrl: "https://buy.stripe.com/7sY00cgcu6Ez4SUgN4eEo0f",
        },
        {
          id: "jin-xuan",
          name: "Jin Xuan",
          hanzi: "金萱",
          note: "15g pack",
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
          note: "15g pack",
          buyUrl: "https://buy.stripe.com/4gM00c5xQbYTade7cueEo0h",
        },
        {
          id: "dong-ding",
          name: "Dong Ding",
          hanzi: "凍頂",
          note: "15g pack",
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
          note: "15g pack",
          buyUrl: "https://buy.stripe.com/00wdR23pI9QL0CE1SaeEo0j",
        },
        {
          id: "ruby-oolong",
          name: "Ruby Oolong",
          hanzi: "紅玉",
          note: "15g pack",
          buyUrl: "https://buy.stripe.com/aFa00c2lEbYT99a9kCeEo0k",
        },
      ],
    },
    {
      id: "elixir",
      label: "Elixir",
      price: "$5",
      unit: "/ pack",
      plate: plate("remedy", "Ginger and dried fruit beside a warm cup"),
      items: [
        {
          id: "ginger-elixir",
          name: "Ginger Elixir",
          hanzi: "黑糖薑茶",
          note: "Black sugar, ginger, longan, jujube",
          buyUrl: "https://buy.stripe.com/7sY14ggcu0gb99adASeEo0l",
        },
      ],
    },
  ],

  boxes: {
    headline: "Three teas, three shipping fees. One box, one.",
    arithmetic:
      "Bought one by one, three single teas are three orders — $26.85 in shipping. The boxes travel as one.",
    plate: plate("boxes", "A full gongfu tea setting laid out in warm light"),
    items: [
      {
        id: "dragons-feast",
        name: "Dragon's Feast",
        hanzi: "全席",
        note: "The full box: all six teas plus the Ginger Elixir.",
        price: "$79",
        weight: "lead",
        buyUrl: "https://buy.stripe.com/7sY6oA9O65Av8567cueEo0o",
      },
      {
        id: "six-tea-sampler",
        name: "Six-Tea Sampler",
        hanzi: "六品",
        note: "One 15g pack of all six teas.",
        price: "$74",
        weight: "plain",
        buyUrl: "https://buy.stripe.com/00w9AMbWe9QL2KM54meEo0n",
      },
      {
        id: "tasting-flight",
        name: "Tasting Flight",
        hanzi: "三選",
        note: "Any three teas, 15g each. You note your picks at checkout.",
        price: "$38",
        weight: "plain",
        buyUrl: "https://buy.stripe.com/00w3co9O6aUP99a7cueEo0m",
      },
    ],
  },
};

/** Every purchasable thing on the page, shelves first then boxes. */
export function allShopItems(): (ShopItem & { price?: string })[] {
  return [...SHOP.shelves.flatMap((shelf) => shelf.items), ...SHOP.boxes.items];
}

/** What a drawer costs: its own price if it has one, else its shelf's. */
export function priceOf(item: ShopItem): string {
  const box = SHOP.boxes.items.find((b) => b.id === item.id);
  if (box) return box.price;
  const shelf = SHOP.shelves.find((s) => s.items.some((i) => i.id === item.id));
  return shelf ? shelf.price : "";
}

/** Accessible name for a buy control: never just "Buy" ten times over. */
export function buyLabelFor(item: ShopItem): string {
  return `${SHOP.buyLabel}: ${item.name}, ${priceOf(item)}`;
}
