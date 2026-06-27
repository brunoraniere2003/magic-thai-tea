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
 * route handler stays thin and this is unit-tested). HTML is escaped - the
 * values come from an untrusted form.
 */
export function buildContactEmail(values: ContactValues): ContactEmail {
  const name = values.name.trim();
  const email = values.email.trim();
  const phone = values.phone.trim();

  const subject = `[TEMPORARY] New enquiry from ${name}`;
  const notice =
    "⚠️ Temporary inbox - please forward to Ethan (flyingdragontea@gmail.com).";
  const text = `${notice}\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`;
  const html = [
    `<p style="font-family:Arial,sans-serif;background:#fff3cd;color:#664d03;padding:10px 14px;border-radius:8px">${notice}</p>`,
    `<h2 style="font-family:Georgia,serif">New enquiry - The Red Flying Dragon</h2>`,
    `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(email)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`,
  ].join("");

  return { subject, text, html };
}
