import { describe, expect, it, vi } from "vitest";
import { SITE } from "@/content/site";
import { subscribe, signupBody } from "./subscribe";

const CONFIG = SITE.newsletter;

describe("subscribe (one Tea List, on The Tea Temple)", () => {
  it("posts the email to The Tea Temple's Netlify form", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response(null));
    const result = await subscribe({ email: " jane@example.com " }, CONFIG, fetchImpl);

    expect(result).toEqual({ ok: true });
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://entertheteatemple.com/");
    expect(init.mode).toBe("no-cors");
    expect(new URLSearchParams(init.body)).toEqual(
      new URLSearchParams({ "form-name": "tea-list", email: "jane@example.com", company: "" }),
    );
  });

  it("refuses a malformed email without sending anything", async () => {
    const fetchImpl = vi.fn();
    expect(await subscribe({ email: "not-an-email" }, CONFIG, fetchImpl)).toEqual({
      ok: false,
      reason: "invalid",
    });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("drops a bot silently", async () => {
    const fetchImpl = vi.fn();
    expect(await subscribe({ email: "a@b.co", honeypot: "Acme" }, CONFIG, fetchImpl)).toEqual({ ok: true });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("reports a network failure", async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError("offline"));
    expect(await subscribe({ email: "a@b.co" }, CONFIG, fetchImpl)).toEqual({
      ok: false,
      reason: "network",
    });
  });

  it("uses the field names the Tea Temple form registered", () => {
    expect([...new URLSearchParams(signupBody({ email: "a@b.co" }, "tea-list")).keys()]).toEqual([
      "form-name",
      "email",
      "company",
    ]);
  });
});
