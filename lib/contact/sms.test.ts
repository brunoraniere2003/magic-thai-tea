import { describe, it, expect } from "vitest";
import { buildSmsHref } from "./sms";

describe("buildSmsHref", () => {
  it("builds a plain sms: link from an E.164 number", () => {
    expect(buildSmsHref("+15551234567")).toBe("sms:+15551234567");
  });

  it("strips formatting characters from the number", () => {
    expect(buildSmsHref("+1 (555) 123-4567")).toBe("sms:+15551234567");
  });

  it("appends an encoded body in the cross-platform form", () => {
    expect(buildSmsHref("+15551234567", "Hi Ethan!")).toBe(
      "sms:+15551234567?&body=Hi%20Ethan!",
    );
  });

  it("returns an empty string when there is no usable number", () => {
    expect(buildSmsHref("")).toBe("");
    expect(buildSmsHref("not-a-number")).toBe("");
  });
});
