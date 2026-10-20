import { SITE } from "@/content/site";
import {
  checkoutSessionParams,
  parseCartLines,
  toFormBody,
} from "@/lib/shop/checkout";

/**
 * POST /api/checkout: `{ items: [{ id, quantity }] }` -> `{ url }` of a Stripe
 * Checkout Session. Prices come from content/shop.ts on the server, never from
 * the request.
 *
 * STRIPE_SECRET_KEY lives in .env.local (dev) and in .env.production on the
 * server, never in the code. A test key (sk_test_/rk_test_) gives a test
 * checkout that takes Stripe's test cards and charges nothing.
 */

// Where Stripe may send the buyer back. Anything else falls back to the site.
const RETURN_ORIGINS = new Set([
  SITE.seo.url,
  "https://www.theredflyingdragon.com",
]);
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

export async function POST(request: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("checkout: STRIPE_SECRET_KEY is not set");
    return Response.json({ error: "unavailable" }, { status: 503 });
  }

  const lines = parseCartLines(await request.json().catch(() => null));
  if (!lines) return Response.json({ error: "bad cart" }, { status: 400 });

  const origin = request.headers.get("origin") ?? "";
  const baseUrl =
    RETURN_ORIGINS.has(origin) || LOCAL.test(origin) ? origin : SITE.seo.url;

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: toFormBody(checkoutSessionParams(lines, baseUrl)),
  }).catch(() => null);

  const session = (await response?.json().catch(() => null)) as {
    url?: string;
    error?: { message?: string };
  } | null;

  if (!response?.ok || typeof session?.url !== "string") {
    console.error(
      "checkout: Stripe refused the session",
      response?.status,
      session?.error?.message,
    );
    return Response.json({ error: "unavailable" }, { status: 502 });
  }

  return Response.json({ url: session.url });
}
