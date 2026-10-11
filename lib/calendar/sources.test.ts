import { describe, expect, it } from "vitest";
import { CALENDAR_SOURCES } from "./sources";
import { calendarEmbedUrl } from "./embedUrl";

describe("CALENDAR_SOURCES", () => {
  it("wires both calendars, each to its own id", () => {
    const classes = calendarEmbedUrl(CALENDAR_SOURCES.classes);
    const availability = calendarEmbedUrl(CALENDAR_SOURCES.availability);
    expect(classes).toBeDefined();
    expect(availability).toBeDefined();
    expect(classes).not.toBe(availability);
  });

  it("asks Google for Ethan's timezone, so times do not shift", () => {
    for (const src of Object.values(CALENDAR_SOURCES)) {
      expect(src).toContain("America%2FLos_Angeles");
    }
  });

  it("points the class slot at the Tai Chi classes calendar", () => {
    // Verified by opening it: "TAI CHI ARMBRIDGE FAMILY CLASSES".
    expect(CALENDAR_SOURCES.classes).toContain("ce9beb1c270200f966");
    // And the availability slot at "RED FLYING DRAGON BUSINESS" (free/busy).
    expect(CALENDAR_SOURCES.availability).toContain("8c1caa628e064e72fa");
  });
});
