import { validateSignup, hasSignupErrors } from "./validateSignup";

/**
 * "Join the Tea List" transport (spec 033 / R7, blocker B4).
 *
 * The email service (Mailchimp / ConvertKit / …) is not chosen yet, so the
 * destination lives behind one swappable endpoint:
 *   - `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` set → post straight to that provider;
 *   - not set → fall back to the owner's inbox through FormSubmit, the same
 *     transport the contact form already uses (ADR 0013), so signups are never
 *     lost while the decision is pending.
 *
 * Picking a provider is an env change. No component is touched.
 */

export interface SignupInput {
  name: string;
  email: string;
  /** Hidden field. Anything here means a bot filled the form. */
  honeypot?: string;
}

export interface NewsletterConfig {
  /** Inbox used by the fallback transport. */
  fallbackEmail: string;
  /** Hosted provider endpoint, once one is chosen. */
  endpoint?: string;
}

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "network" | "rejected" };

export interface ResolvedEndpoint {
  url: string;
  kind: "hosted" | "fallback";
}

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** Where a signup goes right now, and whether that is the real provider. */
export function resolveEndpoint(config: NewsletterConfig): ResolvedEndpoint {
  const endpoint = config.endpoint?.trim();
  if (endpoint) {
    return { url: endpoint, kind: "hosted" };
  }
  return {
    url: `https://formsubmit.co/ajax/${config.fallbackEmail}`,
    kind: "fallback",
  };
}

function fallbackBody(input: SignupInput): string {
  return JSON.stringify({
    Name: input.name.trim(),
    Email: input.email.trim(),
    _replyto: input.email.trim(),
    _subject: "New Tea List signup (The Red Flying Dragon)",
    _template: "table",
    _captcha: "false",
  });
}

function hostedBody(input: SignupInput): string {
  return JSON.stringify({ name: input.name.trim(), email: input.email.trim() });
}

/**
 * Validates, then posts the signup. Never throws: every failure comes back as
 * a typed reason so the form can speak plainly to the visitor.
 */
export async function subscribe(
  input: SignupInput,
  config: NewsletterConfig,
  fetchImpl: FetchLike = fetch,
): Promise<SubscribeResult> {
  if (input.honeypot?.trim()) {
    // Drop it silently: a bot that sees "success" stops retrying.
    return { ok: true };
  }

  const errors = validateSignup({ name: input.name, email: input.email });
  if (hasSignupErrors(errors)) {
    return { ok: false, reason: "invalid" };
  }

  const target = resolveEndpoint(config);

  try {
    const response = await fetchImpl(target.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body:
        target.kind === "fallback" ? fallbackBody(input) : hostedBody(input),
    });

    if (!response.ok) {
      return { ok: false, reason: "rejected" };
    }

    if (target.kind === "fallback") {
      // FormSubmit answers 200 with its own envelope; anything else is a miss.
      const data = (await response.json().catch(() => ({}))) as {
        success?: string;
      };
      return data.success === "true"
        ? { ok: true }
        : { ok: false, reason: "rejected" };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  }
}
