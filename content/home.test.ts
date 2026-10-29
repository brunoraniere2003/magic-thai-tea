import { describe, it, expect } from "vitest";
import { HOME } from "@/content/home";
import { SITE } from "@/content/site";

/**
 * What these tests guard is structure, safety and the house rules, not wording:
 * since 2026-10-11 Ethan edits his own copy, prices and lists (spec 036).
 *
 * Copy we authored ourselves. The handoff copy (practices, yin & yang, about,
 * booking policy, connect, tea list, calendars) is Ethan's own writing and
 * keeps his punctuation verbatim (ADR 0014).
 */
const AUTHORED = JSON.stringify([
  HOME.hero,
  HOME.reviewsHeading,
  HOME.reviews,
  HOME.contact,
  HOME.doors,
  HOME.events.eyebrow,
  HOME.events.title,
  HOME.practices.map((practice) => [practice.eyebrow, practice.cta.label]),
  HOME.yinYang.cta.label,
  HOME.teaList.successMessage,
  HOME.teaList.errorMessage,
]);

/** On-page anchors every CTA may point at, or the booking site. */
const ANCHORS = new Set(SITE.menu.map((item) => item.href));
const isBookingTarget = (href: string) =>
  ANCHORS.has(href) || href === SITE.booking.url || href === SITE.shopUrl;

describe("HOME content", () => {
  it("leads the hero with team events, then a private tasting on the Tea Temple", () => {
    expect(HOME.hero.cta.href).toBe("#corporate");
    expect(ANCHORS.has(HOME.hero.cta.href)).toBe(true);
    expect(HOME.hero.secondaryCta.href).toBe(SITE.tastingUrl);
    expect(HOME.corporate.cta.href).toBe("#contact");
  });

  it("features two reviews that exist, beside the team-event offer", () => {
    const names = HOME.reviews.map((review) => review.name);
    for (const name of HOME.corporate.featuredReviews) expect(names).toContain(name);
  });

  // The site is tea and tai chi (2026-10-11): no magic, and no prices at all:
  // the shop and every price live on The Tea Temple (2026-10-27).
  it("carries no magic and no service prices", () => {
    const all = JSON.stringify(HOME);
    expect(all).not.toMatch(/magic|sleight|magician/i);
    expect(all).not.toMatch(/\$\s?\d/);
  });

  it("offers two doors: gatherings to the contact form, intimate sessions to the Tea Temple", () => {
    expect(SITE.booking.url).toBe("https://entertheteatemple.com/");
    expect(HOME.doors.doors.map((door) => door.cta.href)).toEqual([
      "#contact",
      SITE.booking.url,
    ]);
    expect(SITE.headerCta.href).toBe("#contact");
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
      expect(isBookingTarget(practice.cta.href)).toBe(true);
      for (const photo of practice.gallery) {
        expect(photo.src).toMatch(/^\/images\//);
        expect(photo.alt).toBeTruthy();
      }
    }
  });

  it("gives the yin & yang block two captioned photos", () => {
    expect(HOME.yinYang.body).toBeTruthy();
    expect(HOME.yinYang.cta.href).toBe("#contact");
    expect(HOME.yinYang.images).toHaveLength(2);
    for (const image of HOME.yinYang.images) {
      expect(image.src).toMatch(/^\/images\//);
      expect(image.alt).toBeTruthy();
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
    expect(HOME.teaList.emailLabel).toBeTruthy();
    expect(HOME.teaList.successMessage).toBeTruthy();
  });

  it("names the class calendar and gives it an accessible frame title", () => {
    expect(HOME.classesCalendar.title).toBeTruthy();
    expect(HOME.classesCalendar.frameTitle).toBeTruthy();
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
