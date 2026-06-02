import { describe, it, expect } from "vitest";
import {
  getBookingHref,
  isBookingConfigured,
  type BookingConfig,
} from "./config";

const wired: BookingConfig = {
  calLinks: { magic: "ethan/magic", tea: "", "tai-chi": "" },
  fallbackHref: "#contact",
};

describe("isBookingConfigured", () => {
  it("is false when the world has no Cal.com link", () => {
    expect(isBookingConfigured("tea", wired)).toBe(false);
  });

  it("is true when the world has a Cal.com link", () => {
    expect(isBookingConfigured("magic", wired)).toBe(true);
  });

  it("treats whitespace-only links as not configured", () => {
    expect(
      isBookingConfigured("magic", {
        calLinks: { magic: "   ", tea: "", "tai-chi": "" },
        fallbackHref: "#contact",
      }),
    ).toBe(false);
  });
});

describe("getBookingHref", () => {
  it("returns the Cal.com URL when configured", () => {
    expect(getBookingHref("magic", wired)).toBe("https://cal.com/ethan/magic");
  });

  it("returns the fallback when not configured", () => {
    expect(getBookingHref("tea", wired)).toBe("#contact");
  });
});
