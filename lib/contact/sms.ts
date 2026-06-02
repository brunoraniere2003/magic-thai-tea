/**
 * Builds an SMS deep link that works on both iOS and Android. Americans text
 * (no WhatsApp), so "Text Ethan" is a first-class contact path.
 * Returns an empty string when there is no usable number.
 */
export function buildSmsHref(phone: string, body?: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");
  if (!cleaned || cleaned === "+") return "";

  const base = `sms:${cleaned}`;
  if (!body) return base;

  // `?&body=` is the cross-platform form (iOS uses `&`, Android uses `?`).
  return `${base}?&body=${encodeURIComponent(body)}`;
}
