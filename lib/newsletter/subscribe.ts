import { validateSignup, hasSignupErrors } from "./validateSignup";

/**
 * "Join the Tea List": one list for both sites (brief 2026-10-29). Signups
 * here go to The Tea Temple's Netlify form ("tea-list" on entertheteatemple.com),
 * the same list its own footer form fills. See SITE.newsletter.
 *
 * Netlify takes a plain urlencoded POST from any origin, but sends no CORS
 * headers, so the browser can't read the answer (mode "no-cors"): a request
 * that leaves is a signup sent; only a network failure is reported back.
 * Verified 2026-10-29: a signup sent this way from theredflyingdragon.com in a
 * normal browser lands in the list. (Headless test browsers are filtered out.)
 */

export interface SignupInput {
  email: string;
  /** Hidden field. Anything here means a bot filled the form. */
  honeypot?: string;
}

export interface NewsletterConfig {
  /** The Tea Temple's site root, where Netlify accepts the form. */
  url: string;
  /** The Netlify form's name. */
  formName: string;
}

export type SubscribeResult =
  | { ok: true }
  | { ok: false; reason: "invalid" | "network" };

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

/** The body Netlify expects; `company` is the shared honeypot field. */
export function signupBody(input: SignupInput, formName: string): string {
  return new URLSearchParams({
    "form-name": formName,
    email: input.email.trim(),
    company: input.honeypot ?? "",
  }).toString();
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
  if (hasSignupErrors(validateSignup({ email: input.email }))) {
    return { ok: false, reason: "invalid" };
  }

  try {
    await fetchImpl(config.url, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: signupBody(input, config.formName),
    });
    return { ok: true };
  } catch {
    return { ok: false, reason: "network" };
  }
}
