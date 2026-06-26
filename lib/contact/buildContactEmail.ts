import type { ContactValues } from "./validateContactForm";

export interface ContactEmail {
  subject: string;
  text: string;
  html: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build the lead email sent to Ethan from the contact form values (pure, so the
 * route handler stays thin and this is unit-tested). HTML is escaped — the
 * values come from an untrusted form.
 */
export function buildContactEmail(values: ContactValues): ContactEmail {
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();

  const subject = `New enquiry from ${name}`;
  const text = `Name: ${name}\nEmail: ${email}\nPhone: ${phone}`;
  const html = [
    `<h2 style="font-family:Georgia,serif">New enquiry — The Red Flying Dragon</h2>`,
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`,
  ].join("");

  return { subject, text, html };
}
