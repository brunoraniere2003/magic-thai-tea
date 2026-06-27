import { Resend } from "resend";
import {
  validateContactForm,
  hasErrors,
  type ContactValues,
} from "@/lib/contact/validateContactForm";
import { buildContactEmail } from "@/lib/contact/buildContactEmail";

// TEMPORARY setup (spec 030): the Resend account is the owner's, so leads land
// in the owner's own inbox (free tier delivers to the account address without
// domain verification). Every email is marked [TEMPORARY] to forward to Ethan.
const TO = "brunoraniere2003@gmail.com";
const FROM = "The Red Flying Dragon <onboarding@resend.dev>";

interface ContactPayload extends ContactValues {
  /** Honeypot — humans leave this empty; bots fill it. */
  company?: string;
  /** Cloudflare Turnstile token. */
  turnstileToken?: string;
}

/**
 * Verify the Turnstile token server-side (constitution §10). If the secret is
 * not configured yet (dev / pre-launch), we don't block — the honeypot still
 * applies and the gate activates the moment the keys are set in the env.
 */
async function passesTurnstile(
  token: string | undefined,
  ip: string | null,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ ok: false, error: "bad_request" }, { status: 400 });
  }

  // Honeypot: silently accept and drop (don't tip off the bot).
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const values: ContactValues = {
    name: String(payload.name ?? ""),
    email: String(payload.email ?? ""),
    phone: String(payload.phone ?? ""),
  };

  if (hasErrors(validateContactForm(values))) {
    return Response.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const ip = request.headers.get("x-forwarded-for");
  if (!(await passesTurnstile(payload.turnstileToken, ip))) {
    return Response.json({ ok: false, error: "captcha" }, { status: 403 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No server email account yet → tell the client to deliver the lead via a
    // pre-filled email (account-free fallback). Auto-upgrades to a silent send
    // the moment RESEND_API_KEY is set. Returns 200 so the browser logs no error.
    return Response.json({ ok: false, fallback: "mailto" });
  }

  const email = buildContactEmail(values);
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: values.email.trim(),
      subject: email.subject,
      text: email.text,
      html: email.html,
    });
    if (error) {
      console.error("contact: resend rejected the send"); // no PII
      return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
    }
    return Response.json({ ok: true });
  } catch {
    console.error("contact: unexpected send error"); // no PII
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }
}
