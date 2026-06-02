/**
 * Site-wide content and configuration.
 * Single source of truth for copy that lives outside components.
 * Values marked "placeholder" are swapped before launch (see docs/blueprint.md §12).
 */

export interface SiteNavItem {
  label: string;
  href: string;
}

export interface SiteContact {
  /** Email that receives contact-form leads (placeholder until provided). */
  email: string;
  /** Click-to-text number in E.164 format (placeholder — Google Voice TBD). */
  sms: string;
  /** Formspree form endpoint for the contact form (placeholder — form id TBD). */
  formspreeEndpoint: string;
}

export interface SiteSocial {
  instagram: string;
}

export interface SiteSeo {
  title: string;
  description: string;
  /** Canonical URL (placeholder until a domain is chosen). */
  url: string;
}

export interface Site {
  name: string;
  tagline: string;
  nav: SiteNavItem[];
  contact: SiteContact;
  social: SiteSocial;
  seo: SiteSeo;
}

export const SITE: Site = {
  name: "Ethan Holtzman",
  tagline: "Wonder, in three forms.",
  nav: [
    { label: "Magic", href: "/magic" },
    { label: "Tea", href: "/tea" },
    { label: "Tai Chi", href: "/tai-chi" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  contact: {
    email: "hello@ethanholtzman.example", // placeholder
    sms: "+10000000000", // placeholder
    formspreeEndpoint: "", // placeholder — Formspree form id TBD
  },
  social: {
    instagram: "https://instagram.com/", // placeholder
  },
  seo: {
    title: "Ethan Holtzman — Magic, Tea & Tai Chi",
    description:
      "Close-up magic, the Chinese art of tea, and the stillness of Tai Chi — performed by Ethan Holtzman.",
    url: "https://ethanholtzman.example", // placeholder
  },
};
