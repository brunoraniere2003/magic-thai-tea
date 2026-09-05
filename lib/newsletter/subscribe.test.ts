import { describe, expect, it, vi } from "vitest";
import { validateSignup, hasSignupErrors } from "./validateSignup";
import { resolveEndpoint, subscribe, type NewsletterConfig } from "./subscribe";

const FALLBACK: NewsletterConfig = {
  fallbackEmail: "flyingdragontea@gmail.com",
};
const HOSTED: NewsletterConfig = {
  fallbackEmail: "flyingdragontea@gmail.com",
  endpoint: "https://example.test/subscribe",
};

function okFetch() {
  return vi.fn(
    async () =>
      new Response(JSON.stringify({ success: "true" }), { status: 200 }),
  );
}

describe("validateSignup", () => {
  it("requires an email", () => {
    expect(validateSignup({ name: "", email: "" }).email).toBe(
      "Please enter your email.",
    );
  });

  it("rejects a malformed email", () => {
    expect(validateSignup({ name: "", email: "nope" }).email).toBe(
      "Please enter a valid email.",
    );
  });

  it("treats the name as optional", () => {
    const errors = validateSignup({ name: "", email: "jane@example.com" });
    expect(hasSignupErrors(errors)).toBe(false);
  });
});

describe("resolveEndpoint", () => {
  it("uses the hosted provider endpoint when one is configured", () => {
    expect(resolveEndpoint(HOSTED)).toEqual({
      url: "https://example.test/subscribe",
      kind: "hosted",
    });
  });

  it("falls back to the owner inbox when no provider is chosen yet", () => {
    expect(resolveEndpoint(FALLBACK)).toEqual({
      url: "https://formsubmit.co/ajax/flyingdragontea@gmail.com",
      kind: "fallback",
    });
  });
});

describe("subscribe", () => {
  it("posts a valid signup and reports success", async () => {
    const fetchImpl = okFetch();
    const result = await subscribe(
      { name: "Jane", email: "jane@example.com" },
      FALLBACK,
      fetchImpl,
    );

    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledOnce();
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [
      string,
      RequestInit,
    ];
    expect(url).toContain("formsubmit.co");
    expect(String(init.body)).toContain("jane@example.com");
  });

  it("never posts an invalid signup", async () => {
    const fetchImpl = okFetch();
    const result = await subscribe(
      { name: "", email: "nope" },
      FALLBACK,
      fetchImpl,
    );

    expect(result).toEqual({ ok: false, reason: "invalid" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("silently drops a honeypot hit and reports success to the bot", async () => {
    const fetchImpl = okFetch();
    const result = await subscribe(
      { name: "Jane", email: "jane@example.com", honeypot: "bot" },
      FALLBACK,
      fetchImpl,
    );

    expect(result).toEqual({ ok: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("reports a network failure instead of throwing", async () => {
    const fetchImpl = vi.fn(async () => {
      throw new Error("offline");
    });
    const result = await subscribe(
      { name: "Jane", email: "jane@example.com" },
      FALLBACK,
      fetchImpl,
    );

    expect(result).toEqual({ ok: false, reason: "network" });
  });

  it("reports a rejected response", async () => {
    const fetchImpl = vi.fn(async () => new Response("nope", { status: 500 }));
    const result = await subscribe(
      { name: "Jane", email: "jane@example.com" },
      FALLBACK,
      fetchImpl,
    );

    expect(result).toEqual({ ok: false, reason: "rejected" });
  });

  it("accepts a plain 200 from a hosted provider (no FormSubmit envelope)", async () => {
    const fetchImpl = vi.fn(async () => new Response("", { status: 200 }));
    const result = await subscribe(
      { name: "Jane", email: "jane@example.com" },
      HOSTED,
      fetchImpl,
    );

    expect(result).toEqual({ ok: true });
  });
});
