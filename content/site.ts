/**
 * Site-wide content and configuration — The Red Flying Dragon (spec 028).
 * Single source of truth for copy that lives outside components.
 */

export interface SiteNavItem {
  label: string;
  href: string;
}

export interface SiteContact {
  /** Inbox that receives contact-form leads (via Resend — ADR 0010). */
  email: string;
  /** Click-to-text number in E.164 format. */
  sms: string;
}

export interface SiteSeo {
  title: string;
  description: string;
  url: string;
}

export interface Site {
  name: string;
  tagline: string;
  nav: SiteNavItem[];
  contact: SiteContact;
  seo: SiteSeo;
}

export const SITE: Site = {
  name: "The Red Flying Dragon",
  tagline: "The Chinese arts of tea and tai chi, by Ethan Holtzman.",
  nav: [
    { label: "The practice", href: "#worlds" },
    { label: "Talk to Ethan", href: "#contact" },
  ],
  contact: {
    email: "flyingdragontea@gmail.com",
    sms: "+14156991715",
  },
  seo: {
    title: "The Red Flying Dragon — Tea & Tai Chi by Ethan Holtzman",
    description:
      "The Chinese art of tea and the moving meditation of tai chi, performed and taught by Ethan Holtzman. A ceremony that slows the whole room down.",
    url: "https://theredflyingdragon.com",
  },
};
