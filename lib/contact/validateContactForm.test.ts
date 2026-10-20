import { describe, it, expect } from "vitest";
import { validateContactForm, hasErrors, type ContactValues } from "./validateContactForm";

const valid: ContactValues = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "",
  eventType: "",
  location: "Presidio, San Francisco",
  guests: "",
  date: "",
  message: "",
};

describe("validateContactForm", () => {
  it("needs only name, email and location", () => {
    expect(hasErrors(validateContactForm(valid))).toBe(false);
  });

  it("flags the missing required fields, and only those", () => {
    const errors = validateContactForm({ ...valid, name: " ", email: "", location: "" });
    expect(Object.keys(errors).sort()).toEqual(["email", "location", "name"]);
  });

  it("flags an invalid email", () => {
    expect(validateContactForm({ ...valid, email: "jane@" }).email).toBeTruthy();
  });

  it("takes a phone when it is a real number, and no phone at all", () => {
    expect(validateContactForm({ ...valid, phone: "12345" }).phone).toBeTruthy();
    for (const phone of ["", "4156991715", "+1 415 699 1715", "(415) 699-1715"]) {
      expect(validateContactForm({ ...valid, phone }).phone).toBeFalsy();
    }
  });

  it("takes a whole guest count, or none", () => {
    expect(validateContactForm({ ...valid, guests: "about 40" }).guests).toBeTruthy();
    expect(validateContactForm({ ...valid, guests: "40" }).guests).toBeFalsy();
    expect(validateContactForm({ ...valid, guests: "" }).guests).toBeFalsy();
  });
});
