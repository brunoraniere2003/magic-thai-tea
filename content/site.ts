/**
 * Site-wide content and configuration for The Red Flying Dragon.
 * Single source of truth for copy that lives outside components.
 */

export interface SiteNavItem {
  label: string;
  href: string;
}

export interface SiteContact {
  /** Inbox that receives contact-form leads. */
  email: string;
  /** Click-to-text number in E.164 format. */
  sms: string;
}

export interface SiteSeo {
  title: string;
  description: string;
  url: string;
}

/** Where private sessions are booked: Ethan's own booking site. */
export interface SiteBooking {
  /** The place, as it is named in copy. */
  name: string;
  /** Short call to action for the header button. */
  cta: string;
  /** One line describing it, for the menu card. */
  note: string;
  url: string;
}

export interface Site {
  name: string;
  tagline: string;
  /** The header's text links (desktop). Keep it short: six at most. Anchors,
   * except Shop, which goes to The Tea Temple. */
  nav: SiteNavItem[];
  /** Every section worth jumping to, in page order: phone menu and footer. */
  menu: SiteNavItem[];
  booking: SiteBooking;
  /** Teas and teaware are sold on The Tea Temple, the only site with prices. */
  shopUrl: string;
  /** The header's always-visible button: to the contact form. */
  headerCta: SiteNavItem;
  contact: SiteContact;
  seo: SiteSeo;
}

const SHOP_URL = "https://entertheteatemple.com/#shop";

export const SITE: Site = {
  name: "The Red Flying Dragon",
  tagline: "The Chinese arts of tea and tai chi, by Ethan Holtzman.",
  nav: [
    { label: "About", href: "#about" },
    { label: "Tea", href: "#tea-ceremony" },
    { label: "Tai Chi", href: "#tai-chi" },
    { label: "Shop", href: SHOP_URL },
    { label: "Contact", href: "#contact" },
    { label: "Newsletter", href: "#tea-list" },
  ],
  menu: [
    { label: "About Ethan", href: "#about" },
    { label: "Two Ways to Book", href: "#book" },
    { label: "Tea Ceremony", href: "#tea-ceremony" },
    { label: "Tai Chi", href: "#tai-chi" },
    { label: "Tea + Tai Chi", href: "#yin-yang" },
    { label: "Shop the Tea", href: SHOP_URL },
    { label: "Contact", href: "#contact" },
    { label: "Newsletter", href: "#tea-list" },
  ],
  booking: {
    name: "The Tea Temple",
    cta: "Book an intimate session",
    note: "Tastings for 1-5 guests, and online sessions",
    url: "https://entertheteatemple.com/",
  },
  shopUrl: SHOP_URL,
  headerCta: { label: "Book a Session", href: "#contact" },
  contact: {
    email: "flyingdragontea@gmail.com",
    sms: "+14156991715",
  },
  seo: {
    title: "The Red Flying Dragon: Tea & Tai Chi by Ethan Holtzman",
    description:
      "Taiwanese gongfu tea and Yang-style Tai Chi with Ethan Holtzman, serving San Francisco, the Bay Area, and beyond. Private tea ceremonies, Tai Chi classes, and single-origin oolongs to take home.",
    url: "https://theredflyingdragon.com",
  },
};
