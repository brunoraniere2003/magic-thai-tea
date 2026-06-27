import { describe, it, expect } from "vitest";
import { buildContactEmail } from "./buildContactEmail";

const values = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "(415) 699-1715",
};

describe("buildContactEmail", () => {
  it("names the sender in the subject", () => {
    expect(buildContactEmail(values).subject).toContain("Jane Doe");
  });

  it("carries name, email and phone in the text body", () => {
    const { text } = buildContactEmail(values);
    expect(text).toContain("Jane Doe");
    expect(text).toContain("jane@example.com");
    expect(text).toContain("(415) 699-1715");
  });

  it("escapes HTML to prevent injection in the html body", () => {
    const { html } = buildContactEmail({
      ...values,
      name: "<script>alert(1)</script>",
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("trims surrounding whitespace", () => {
    const { text } = buildContactEmail({
      name: "  Jane  ",
      email: " jane@example.com ",
      phone: " 4156991715 ",
    });
    expect(text).toContain("Name: Jane\n");
  });

  it("marks the email as temporary (owner-inbox setup, spec 030)", () => {
    const { subject, text, html } = buildContactEmail(values);
    expect(subject).toContain("[TEMPORARY]");
    expect(text).toContain("forward to Ethan");
    expect(html).toContain("Temporary inbox");
  });
});
