import { describe, expect, it } from "vitest";
import { calendarEmbedUrl } from "./embedUrl";

describe("calendarEmbedUrl", () => {
  it("returns undefined while no calendar is configured (blocker B1)", () => {
    expect(calendarEmbedUrl()).toBeUndefined();
    expect(calendarEmbedUrl("")).toBeUndefined();
    expect(calendarEmbedUrl("   ")).toBeUndefined();
  });

  it("keeps a full embed URL as-is", () => {
    const url =
      "https://calendar.google.com/calendar/embed?src=abc%40group.calendar.google.com";
    expect(calendarEmbedUrl(url)).toBe(url);
  });

  it("builds the embed URL from a bare calendar id", () => {
    expect(calendarEmbedUrl("abc@group.calendar.google.com")).toBe(
      "https://calendar.google.com/calendar/embed?src=abc%40group.calendar.google.com",
    );
  });

  it("pulls the src out of a pasted iframe snippet", () => {
    expect(
      calendarEmbedUrl(
        '<iframe src="https://calendar.google.com/x" width="800"></iframe>',
      ),
    ).toBe("https://calendar.google.com/x");
  });

  it("returns undefined for an iframe snippet with no src", () => {
    expect(calendarEmbedUrl("<iframe width='800'></iframe>")).toBeUndefined();
  });
});
