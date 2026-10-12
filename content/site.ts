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
  /** The header's text links (desktop). Keep it short: five at most. */
  nav: SiteNavItem[];
  /** Every section worth jumping to, in page order: phone menu and footer. */
  menu: SiteNavItem[];
  booking: SiteBooking;
  contact: SiteContact;
  seo: SiteSeo;
}

export const SITE: Site = {
  name: "The Red Flying Dragon",
  tagline: "The Chinese arts of tea and tai chi, by Ethan Holtzman.",
  nav: [
    { label: "Tea", href: "#tea-ceremony" },
    { label: "Tai Chi", href: "#tai-chi" },
    { label: "Shop", href: "#shop" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  menu: [
    { label: "Tea Ceremony", href: "#tea-ceremony" },
    { label: "Tai Chi", href: "#tai-chi" },
    { label: "Tea + Tai Chi", href: "#yin-yang" },
    { label: "Private Sessions", href: "#book" },
    { label: "Shop the Tea", href: "#shop" },
    { label: "About Ethan", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  booking: {
    name: "The Tea Temple",
    cta: "Book a Session",
    note: "Private tea sessions in San Francisco",
    url: "https://entertheteatemple.com/",
  },
  contact: {
    email: "flyingdragontea@gmail.com",
    sms: "+14156991715",
  },
  seo: {
    title: "The Red Flying Dragon: Tea & Tai Chi by Ethan Holtzman",
    description:
      "Taiwanese gongfu tea and Yang-style Tai Chi with Ethan Holtzman in San Francisco. Private tea ceremonies, Tai Chi classes, and single-origin oolongs to take home.",
    url: "https://theredflyingdragon.com",
  },
};
