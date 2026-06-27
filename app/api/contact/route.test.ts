import { describe, it, expect, vi, beforeEach } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send } })),
}));

import { POST } from "./route";

function req(body: unknown) {
  return new Request("http://localhost/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const valid = { name: "Jane", email: "jane@example.com", phone: "4156991715" };

beforeEach(() => {
  send.mockReset();
  send.mockResolvedValue({ data: { id: "1" }, error: null });
  delete process.env.RESEND_API_KEY;
  delete process.env.TURNSTILE_SECRET_KEY;
});

describe("POST /api/contact", () => {
  it("drops honeypot submissions but reports ok (no send)", async () => {
    const res = await POST(req({ ...valid, company: "spam-co" }));
    expect(res.status).toBe(200);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects invalid input with 422", async () => {
    const res = await POST(req({ name: "", email: "x", phone: "" }));
    expect(res.status).toBe(422);
    expect(send).not.toHaveBeenCalled();
  });

  it("falls back to mailto when Resend is not configured (no send)", async () => {
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    const body = (await res.json()) as { fallback?: string };
    expect(body.fallback).toBe("mailto");
    expect(send).not.toHaveBeenCalled();
  });

  it("sends the lead via Resend when configured (turnstile off)", async () => {
    process.env.RESEND_API_KEY = "re_test";
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledOnce();
    const arg = send.mock.calls[0][0] as { to: string; subject: string };
    expect(arg.to).toBe("brunoraniere2003@gmail.com");
    expect(arg.subject).toContain("Jane");
  });

  it("blocks with 403 when Turnstile is required but no token is sent", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.TURNSTILE_SECRET_KEY = "secret";
    const res = await POST(req(valid));
    expect(res.status).toBe(403);
    expect(send).not.toHaveBeenCalled();
  });
});
