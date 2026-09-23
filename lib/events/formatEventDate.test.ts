import { describe, expect, it } from "vitest";
import { formatEventDate } from "./formatEventDate";

describe("formatEventDate", () => {
  it("formats an ISO day in the site's US voice", () => {
    expect(formatEventDate("2026-10-04")).toBe("Sun, October 4, 2026");
  });

  it("does not shift the day across timezones", () => {
    expect(formatEventDate("2026-01-01")).toContain("January 1, 2026");
  });

  it("returns the raw value when the date is not a plain ISO day", () => {
    expect(formatEventDate("next spring")).toBe("next spring");
    expect(formatEventDate("2026-13-45")).toBe("2026-13-45");
  });
});
