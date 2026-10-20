/**
 * "Shop the Tea" (handoff v2, 3/9/2026; reshaped 2026-10-11; cart 2026-10-19).
 *
 * The shop is a cart: visitors add teas and teaware, change quantities in the
 * cart drawer, and pay once on Stripe Checkout (app/api/checkout). **This file
 * is the source of truth for price**: the server reads the price from here when
 * it builds the Stripe checkout, and never trusts a price sent by the browser.
 * Change a number here and both the page and the checkout follow.
 *
 * The page is rows of three: the three tiers of single teas (price said once
 * per tier), the two boxes and the Ginger Elixir with the full box in the
 * middle, then the glass teaware with the set in the middle.
 *
 * Plates marked `placeholder` are stand-ins (Unsplash license, downloaded into
 * `public/images/shop/` so the page makes no third-party request). They show
 * leaf, steam and liquor — never invented packaging, which would be a claim we
 * cannot make. An item with no plate shows its name in Chinese until Ethan's
 * photo arrives. Swapping in a real photo is a one-line edit each.
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
}

/** One tier of single teas: a price, a plate, and the teas under it. */
export interface ShopShelf {
  id: string;
  label: string;
  /** In dollars, per item. */
  price: number;
  /** Unit the price buys, printed small next to it. */
  unit: string;
  plate: ShopPlate;
  items: ShopItem[];
}

/** A box or the Elixir: priced on its own, with its own plate. */
export interface ShopBox extends ShopItem {
  /** In dollars. */
  price: number;
  /** Small label over the name ("The full box"). */
  eyebrow: string;
  /** No plate yet: the card shows the name in Chinese instead. */
  plate?: ShopPlate;
  /** The one card that gets the gold frame and the filled button. */
  featured?: boolean;
  /**
   * For a bundle: the ids of what is in it. When the bundle costs less than
   * its parts, the card says "Save $X" on its own.
   */
  includes?: string[];
}

export interface ShopContent {
  eyebrow: string;
  title: string;
  body: string;
  /** One quiet line under the title: checkout, quantity, shipping. */
  fineprint: string[];
  /** Turnaround time, once Ethan confirms it (blocker B13). */
  turnaround?: string;
  /** Labels over the rows. */
  rows: { teas: string; collection: string; teaware: string };
  shelves: ShopShelf[];
  /** Second row, left to right; the featured one sits in the middle. */
  collection: ShopBox[];
  /** Third row, left to right; the set sits in the middle. */
  teaware: ShopBox[];
  shipping: ShopShipping;
  /** What the add-to-cart button visibly says. */
  addText: string;
}

/** Shipping, as Stripe Checkout offers it. Amounts in dollars. */
export interface ShopShipping {
  /** Flat rate for orders under `freeOver`. */
  flat: number;
  /** Cart subtotal at which shipping becomes free. */
  freeOver: number;
  /** The $0 pickup option, always offered. */
  pickupLabel: string;
  /** Shown on Stripe's checkout page, by the shipping address. */
  pickupNote: string;
  /** Shown once paid: on Stripe's page and in the cart's thank-you. */
  pickupThanks: string;
}

/** The six single teas, as the boxes list them. */
const TEAS = [
  "bao-zhong",
  "jin-xuan",
  "alishan",
  "dong-ding",
  "oriental-beauty",
  "ruby-oolong",
];

const plate = (name: string, alt: string): ShopPlate => ({
  src: `/images/shop/plate-${name}.jpg`,
  alt,
  placeholder: true,
});

const SHIPPING: ShopShipping = {
  flat: 9,
  freeOver: 75,
  pickupLabel: "Free local pickup in San Francisco",
  pickupNote:
    "Picking up in San Francisco? Choose free local pickup, and Ethan will email you to arrange a time.",
  pickupThanks:
    "Chose free local pickup in San Francisco? Ethan will email you to arrange a time.",
};

export const SHOP: ShopContent = {
  eyebrow: "Shop",
  title: "Shop the Tea",
  body: "Single-origin Taiwanese oolongs in 15g pouches, and glass teaware to brew them in. Take the ceremony home.",
  addText: "Add",

  fineprint: [
    `Free U.S. shipping over $${SHIPPING.freeOver}, $${SHIPPING.flat} flat under`,
    "Free local pickup in San Francisco",
    "Secure checkout by Stripe",
  ],

  shipping: SHIPPING,

  rows: {
    teas: "Single teas",
    collection: "Boxes & Elixir",
    teaware: "Glass teaware",
  },

  shelves: [
    {
      id: "everyday",
      label: "Everyday",
      price: 10,
      unit: "/ 15g",
      plate: plate(
        "everyday",
        "Tea being poured from a small clay pot in low light",
      ),
      items: [
        {
          id: "bao-zhong",
          name: "Bao Zhong",
          hanzi: "包種",
          note: "Floral, umami.",
        },
        {
          id: "jin-xuan",
          name: "Jin Xuan",
          hanzi: "金萱",
          note: "Floral, creamy, milky.",
        },
      ],
    },
    {
      id: "signature",
      label: "Signature",
      price: 12,
      unit: "/ 15g",
      plate: plate(
        "signature",
        "A gaiwan being poured, steam rising over a dark table",
      ),
      items: [
        {
          id: "alishan",
          name: "Alishan Oolong",
          hanzi: "阿里山",
          note: "Floral, fruity.",
        },
        {
          id: "dong-ding",
          name: "Dong Ding",
          hanzi: "凍頂",
          note: "Vintage style, roasted.",
        },
      ],
    },
    {
      id: "reserve",
      label: "Reserve",
      price: 15,
      unit: "/ 15g",
      plate: plate(
        "reserve",
        "Amber tea liquor in small cups, seen from above",
      ),
      items: [
        {
          id: "oriental-beauty",
          name: "Oriental Beauty",
          hanzi: "東方美人",
          note: "Rare varietal. Honey, citrus.",
        },
        {
          id: "ruby-oolong",
          name: "Ruby Oolong",
          hanzi: "紅玉",
          note: "Rich, ripe fruit.",
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
      price: 74,
      plate: {
        src: "/images/tea/tea-spread-overhead.jpg",
        alt: "A full gongfu tea spread seen from above, cups and pots laid out",
      },
      includes: TEAS,
    },
    {
      id: "dragons-feast",
      name: "Dragon's Feast",
      hanzi: "全席",
      eyebrow: "The full box",
      note: "All six teas plus the Ginger Elixir, shipped as one order.",
      price: 79,
      featured: true,
      plate: plate("boxes", "A full gongfu tea setting laid out in warm light"),
      includes: [...TEAS, "ginger-elixir"],
    },
    {
      id: "ginger-elixir",
      name: "Ginger Elixir",
      hanzi: "黑糖薑茶",
      eyebrow: "Elixir · per pack",
      note: "Black Sugar, Ginger, Longan Fruit, Jujube (Red Date).",
      price: 5,
      plate: plate("remedy", "Ginger and dried fruit beside a warm cup"),
    },
  ],

  // Photos and capacity in ml: coming from Ethan.
  teaware: [
    {
      id: "glass-teapot",
      name: "Glass Gongfu Teapot",
      hanzi: "玻璃壺",
      eyebrow: "Teapot",
      note: "Brews almost any tea. The glass makes heat easy to manage and the pot easy to handle.",
      price: 30,
    },
    {
      id: "gongfu-glass-set",
      name: "Gongfu Glass Set",
      hanzi: "茶具",
      eyebrow: "The set",
      note: "The glass teapot and the double-walled fairness pitcher, together.",
      price: 55,
      includes: ["glass-teapot", "glass-pitcher"],
    },
    {
      id: "glass-pitcher",
      name: "Double-Walled Glass Fairness Pitcher",
      hanzi: "公道杯",
      eyebrow: "Pitcher",
      note: "Double-walled glass, to pour every cup even. Matches the teapot.",
      price: 30,
    },
  ],
};

/** Every purchasable thing on the page, in page order. */
export function allShopItems(): ShopItem[] {
  return [
    ...SHOP.shelves.flatMap((shelf) => shelf.items),
    ...SHOP.collection,
    ...SHOP.teaware,
  ];
}

/** A purchasable item by id, or undefined. */
export function findShopItem(id: string): ShopItem | undefined {
  return allShopItems().find((item) => item.id === id);
}

/** What an item costs, in dollars: its own price if it has one, else its tier's. */
export function priceOf(item: ShopItem): number {
  const own = [...SHOP.collection, ...SHOP.teaware].find(
    (b) => b.id === item.id,
  );
  if (own) return own.price;
  const shelf = SHOP.shelves.find((s) => s.items.some((i) => i.id === item.id));
  return shelf ? shelf.price : 0;
}

/** The tier unit an item is sold by ("15g"), if any. */
export function unitOf(item: ShopItem): string | undefined {
  return SHOP.shelves
    .find((s) => s.items.some((i) => i.id === item.id))
    ?.unit.replace(/^\/\s*/, "");
}

/** Dollars to Stripe's cents, without float drift ($8.95 -> 895). */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}

/** "$10", "$8.95", "$1,200". */
export function formatPrice(dollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
  }).format(dollars);
}

/** How much a bundle saves against its parts bought one by one (0 if none). */
export function savingsOf(box: ShopBox): number {
  if (!box.includes) return 0;
  const parts = box.includes.reduce((sum, id) => {
    const item = findShopItem(id);
    return sum + (item ? priceOf(item) : 0);
  }, 0);
  return Math.max(0, parts - box.price);
}

/** Accessible name for an add control: never just "Add" a dozen times over. */
export function addLabelFor(item: ShopItem): string {
  return `Add to cart: ${item.name}, ${formatPrice(priceOf(item))}`;
}
