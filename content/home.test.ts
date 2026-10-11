import { describe, it, expect } from "vitest";
import { HOME } from "@/content/home";

/**
 * What these tests guard is structure, safety and the house rules, not wording:
 * since 2026-10-11 Ethan edits his own copy, prices and lists (spec 036).
 *
 * Copy we authored ourselves. The handoff copy (practices, yin & yang, about,
 * magic, services rows, booking policy, connect, tea list, calendars) is
 * Ethan's own writing and keeps his punctuation verbatim (ADR 0014).
 */
const AUTHORED = JSON.stringify([
  HOME.hero,
  HOME.worldsHeading,
  HOME.worlds,
  HOME.reviewsHeading,
  HOME.reviews,
  HOME.contact,
  HOME.services.intro,
  HOME.events.eyebrow,
  HOME.events.title,
  HOME.practices.map((practice) => [practice.eyebrow, practice.cta.label]),
  HOME.magic.cta.label,
  HOME.yinYang.cta.label,
  HOME.teaList.successMessage,
  HOME.teaList.errorMessage,
]);

/** "$150" or "$150–$350" (en dash), commas allowed: "$400–$1,200". */
const PRICE = /^\$[\d,]+(–\$[\d,]+)?$/;

describe("HOME content", () => {
  // Deck order was swapped in af3d8a3 (Yin & Yang moved after Tai Chi); this
  // expectation had been stale ever since.
  // The 3D deck is built for exactly these three cards and symbols.
  it("has exactly the three cards (tea, tai chi, yin-yang) with drawn symbols", () => {
    expect(HOME.worlds.map((w) => w.key)).toEqual(["tea", "taichi", "yinyang"]);
    for (const world of HOME.worlds) {
      expect(world.title).toBeTruthy();
      expect(world.essence).toBeTruthy();
      expect(["tea", "yinyang", "taichi"]).toContain(world.symbol);
    }
  });

  it("points the hero CTAs at on-page anchors that exist in the layout", () => {
    expect(HOME.hero.primaryCta.href).toBe("#worlds");
    expect(HOME.hero.secondaryCta.href).toBe("#contact");
  });

  it("keeps our own copy free of em dashes (spec 031 R2, narrowed by ADR 0014)", () => {
    expect(AUTHORED).not.toContain("—");
  });

  it("has two practices, tea and tai chi, each with copy and a real photo", () => {
    expect(HOME.practices.map((p) => p.id)).toEqual(["tea-ceremony", "tai-chi"]);
    for (const practice of HOME.practices) {
      expect(practice.title).toBeTruthy();
      expect(practice.short).toBeTruthy();
      expect(practice.body).toBeTruthy();
      expect(practice.formats.length).toBeGreaterThan(0);
      expect(practice.image.src).toMatch(/^\/images\//);
      expect(practice.image.alt).toBeTruthy();
      expect(practice.cta.href).toBe("#contact");
      for (const photo of practice.gallery) {
        expect(photo.src).toMatch(/^\/images\//);
        expect(photo.alt).toBeTruthy();
      }
    }
  });

  it("gives the yin & yang block two captioned photos and a tier that exists", () => {
    expect(HOME.yinYang.body).toBeTruthy();
    expect(HOME.yinYang.cta.href).toBe("#contact");
    expect(HOME.yinYang.images).toHaveLength(2);
    for (const image of HOME.yinYang.images) {
      expect(image.src).toMatch(/^\/images\//);
      expect(image.alt).toBeTruthy();
    }
    expect(
      HOME.services.tiers.some((tier) => tier.id === HOME.yinYang.tierId),
    ).toBe(true);
  });

  // Ethan owns the wording, the number of rows and the prices. The tests only
  // keep the table well formed: a name, a readable price, a unique id.
  it("prices every service tier in a readable range", () => {
    expect(HOME.services.tiers.length).toBeGreaterThan(0);
    const ids = HOME.services.tiers.map((tier) => tier.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const tier of HOME.services.tiers) {
      expect(tier.name).toBeTruthy();
      expect(tier.price).toMatch(PRICE);
    }
  });

  it("keeps the booking policy visible and filled in", () => {
    expect(HOME.bookingPolicy.teaser).toBeTruthy();
    expect(HOME.bookingPolicy.items.length).toBeGreaterThan(0);
    for (const item of HOME.bookingPolicy.items) {
      expect(item.label).toBeTruthy();
      expect(item.text).toBeTruthy();
    }
  });

  it("tells Ethan's story in at least one paragraph", () => {
    expect(HOME.about.paragraphs.length).toBeGreaterThan(0);
    for (const paragraph of HOME.about.paragraphs) {
      expect(paragraph.trim()).toBeTruthy();
    }
  });

  it("gives magic a price list and an inquiry that goes to the contact form", () => {
    expect(HOME.magic.title).toBeTruthy();
    expect(HOME.magic.cta.label).toBeTruthy();
    // Services are closed in a conversation, never on a checkout (ADR 0017).
    expect(HOME.magic.cta.href).toBe("#contact");
    expect(HOME.magic.offerings.length).toBeGreaterThan(0);
    for (const offering of HOME.magic.offerings) {
      expect(offering.name).toBeTruthy();
      expect(offering.price).toMatch(PRICE);
    }
  });

  it("links every connect card to a real address", () => {
    expect(HOME.connect.links.length).toBeGreaterThan(0);
    for (const link of HOME.connect.links) {
      expect(link.label).toBeTruthy();
      expect(link.href).toMatch(/^(https:\/\/|mailto:\S+@\S+\.\S+)/);
    }
  });

  it("labels every field of the tea list form", () => {
    expect(HOME.teaList.title).toBeTruthy();
    expect(HOME.teaList.buttonLabel).toBeTruthy();
    expect(HOME.teaList.nameLabel).toBeTruthy();
    expect(HOME.teaList.emailLabel).toBeTruthy();
    expect(HOME.teaList.successMessage).toBeTruthy();
  });

  it("names both calendars and gives each an accessible frame title", () => {
    expect(HOME.classesCalendar.title).toBeTruthy();
    expect(HOME.availabilityCalendar.title).toBeTruthy();
    expect(HOME.classesCalendar.frameTitle).toBeTruthy();
    expect(HOME.availabilityCalendar.frameTitle).toBeTruthy();
  });

  it("never sends a service CTA to a checkout", () => {
    // book.stripe.com links are sent by Ethan after a conversation (ADR 0017).
    expect(JSON.stringify(HOME)).not.toContain("book.stripe.com");
  });

  it("gives every event a title, a place and an ISO date", () => {
    for (const event of HOME.events.items) {
      expect(event.title).toBeTruthy();
      expect(event.location).toBeTruthy();
      // YYYY-MM-DD, so the list can sort and format it.
      expect(event.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("credits every review", () => {
    for (const review of HOME.reviews) {
      expect(review.quote.trim()).toBeTruthy();
      expect(review.name).toBeTruthy();
    }
  });
});
