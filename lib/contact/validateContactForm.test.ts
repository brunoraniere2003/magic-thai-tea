import { describe, it, expect } from "vitest";
import { validateContactForm, hasErrors } from "./validateContactForm";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  message: "I would love to book a tea ceremony for an event.",
};

describe("validateContactForm", () => {
  it("returns no errors for valid input", () => {
    expect(hasErrors(validateContactForm(valid))).toBe(false);
  });

  it("flags missing required fields", () => {
    const errors = validateContactForm({ name: "", email: "", message: "" });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeTruthy();
    expect(errors.message).toBeTruthy();
  });

  it("flags an invalid email", () => {
    const errors = validateContactForm({ ...valid, email: "jane@" });
    expect(errors.email).toBeTruthy();
  });

  it("flags a message that is too short", () => {
    const errors = validateContactForm({ ...valid, message: "hi" });
    expect(errors.message).toBeTruthy();
  });

  it("ignores surrounding whitespace", () => {
    const errors = validateContactForm({
      name: "   ",
      email: "  jane@example.com  ",
      message: "   I want to book Ethan for a private show.   ",
    });
    expect(errors.name).toBeTruthy();
    expect(errors.email).toBeFalsy();
    expect(errors.message).toBeFalsy();
  });
});
