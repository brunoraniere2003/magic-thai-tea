import { describe, it, expect } from "vitest";
import { HOME } from "@/content/home";

/**
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

describe("HOME content", () => {
  // Deck order was swapped in af3d8a3 (Yin & Yang moved after Tai Chi); this
  // expectation had been stale ever since.
  it("has exactly the three cards (tea, tai chi, yin-yang) with drawn symbols", () => {
    expect(HOME.worlds).toHaveLength(3);
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

  it("has two practices, tea and tai chi, each with handoff copy and a real photo", () => {
    expect(HOME.practices).toHaveLength(2);
    expect(HOME.practices.map((p) => p.key)).toEqual(["tea", "taichi"]);
    expect(HOME.practices.map((p) => p.id)).toEqual([
      "tea-ceremony",
      "tai-chi",
    ]);
    for (const practice of HOME.practices) {
      expect(practice.title).toBeTruthy();
      expect(practice.short.length).toBeGreaterThan(40);
      expect(practice.body.length).toBeGreaterThan(40);
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

  it("carries the gongfu and Sifu Chen lines from the handoff verbatim", () => {
    const [tea, taichi] = HOME.practices;
    expect(tea.body).toContain("Gongfu cha is Taiwan's tradition");
    expect(taichi.body).toContain(
      "passed down by my teacher, Sifu Chen, in Taipei",
    );
  });

  it("combines both practices in the yin & yang block", () => {
    expect(HOME.yinYang.body).toContain("Tea slows you down");
    expect(HOME.yinYang.cta.href).toBe("#contact");
    // One photo per half, and the block quotes a tier that really exists.
    expect(HOME.yinYang.images).toHaveLength(2);
    for (const image of HOME.yinYang.images) {
      expect(image.src).toMatch(/^\/images\//);
      expect(image.alt).toBeTruthy();
    }
    expect(
      HOME.services.tiers.some((tier) => tier.id === HOME.yinYang.tierId),
    ).toBe(true);
  });

  it("prices the three service tiers with every column filled", () => {
    expect(HOME.services.tiers).toHaveLength(3);
    const ids = HOME.services.tiers.map((tier) => tier.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const tier of HOME.services.tiers) {
      expect(tier.name).toBeTruthy();
      expect(tier.included.length).toBeGreaterThan(20);
      expect(tier.groupSize).toBeTruthy();
      expect(tier.duration).toBeTruthy();
      expect(tier.price).toMatch(/\$/);
    }
    expect(HOME.services.addOns).toContain("travel fee");
  });

  it("states the deposit, cancellation and weather policy", () => {
    expect(HOME.bookingPolicy.items.map((item) => item.label)).toEqual([
      "Deposit",
      "Cancellation",
      "Weather (outdoor Tai Chi)",
    ]);
    expect(HOME.bookingPolicy.teaser).toBeTruthy();
    expect(HOME.bookingPolicy.items[0].text).toContain("50% non-refundable");
    expect(HOME.bookingPolicy.items[1].text).toContain("72+ hours");
  });

  it("tells Ethan's story in three paragraphs, magic first", () => {
    expect(HOME.about.paragraphs).toHaveLength(3);
    expect(HOME.about.paragraphs[0]).toContain("family of magicians");
    expect(HOME.about.paragraphs[2]).toContain("Three crafts, one thread");
  });

  it("brings magic back with its own compact price list (ADR 0012)", () => {
    expect(HOME.magic.title).toBe("Also: Wonder, on Request");
    expect(HOME.magic.cta.label).toBe("Inquire about magic");
    expect(HOME.magic.cta.href).toBe("#contact");
    expect(HOME.magic.offerings).toHaveLength(2);
    for (const offering of HOME.magic.offerings) {
      // The compact table has no group-size column.
      expect(offering.groupSize).toBeUndefined();
      expect(offering.price).toMatch(/\$/);
    }
  });

  it("links email, Instagram and the live podcast", () => {
    const byLabel = Object.fromEntries(
      HOME.connect.links.map((link) => [link.label, link]),
    );
    expect(byLabel.Email.href).toBe("mailto:flyingdragontea@gmail.com");
    expect(byLabel.Instagram.value).toBe("@theredflyingdragon");
    expect(byLabel.Podcast.href).toBe("https://www.youtube.com/@TheThirdSteep");
    for (const link of HOME.connect.links) {
      expect(link.href).toMatch(/^(https:\/\/|mailto:)/);
    }
  });

  it("labels the tea list form exactly as the handoff asks", () => {
    expect(HOME.teaList.title).toBe("Join the Tea List");
    expect(HOME.teaList.buttonLabel).toBe("Join the list");
    expect(HOME.teaList.nameLabel).toBe("Name");
    expect(HOME.teaList.emailLabel).toBe("Email");
  });

  it("names both calendars and gives each an accessible frame title", () => {
    expect(HOME.classesCalendar.title).toBe("Upcoming Tai Chi Sessions");
    expect(HOME.availabilityCalendar.title).toBe("See When I'm Free");
    expect(HOME.classesCalendar.frameTitle).toBeTruthy();
    expect(HOME.availabilityCalendar.frameTitle).toBeTruthy();
  });

  it("ships zero events at launch (blocker B5)", () => {
    expect(HOME.events.items).toHaveLength(0);
  });

  it("has at least five real, credited reviews", () => {
    expect(HOME.reviews.length).toBeGreaterThanOrEqual(5);
    for (const review of HOME.reviews) {
      expect(review.quote.length).toBeGreaterThan(20);
      expect(review.name).toBeTruthy();
    }
  });
});
