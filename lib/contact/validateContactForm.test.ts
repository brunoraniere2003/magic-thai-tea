import { describe, it, expect } from "vitest";
import { validateContactForm, hasErrors } from "./validateContactForm";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(415) 699-1715",
  message: "I would love to book a tea tasting.",
};

describe("validateContactForm", () => {
  it("returns no errors for valid input", () => {
    expect(hasErrors(validateContactForm(valid))).toBe(false);
  });

  it("flags missing required fields", () => {
    const errors = validateContactForm({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.phone).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });

  it("flags an invalid email", () => {
    const errors = validateContactForm({ ...valid, email: "jane@" });
    expect(errors.email).toBeTruthy();
  });

  it("flags a phone with too few digits", () => {
    const errors = validateContactForm({ ...valid, phone: "12345" });
    expect(errors.phone).toBeTruthy();
  });

  it("accepts common US phone formats", () => {
    for (const phone of ["4156991715", "+1 415 699 1715", "(415) 699-1715"]) {
      expect(validateContactForm({ ...valid, phone }).phone).toBeFalsy();
    }
  });

  it("ignores surrounding whitespace", () => {
    const errors = validateContactForm({
      name: "   ",
      email: "  jane@example.com  ",
      phone: "  4156991715  ",
      message: "  hello  ",
    });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeFalsy();
    expect(errors.phone).toBeFalsy();
    expect(errors.message).toBeFalsy();
  });
});
