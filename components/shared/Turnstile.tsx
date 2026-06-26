"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (id?: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile widget (constitution §10 anti-spam). Renders only when a
 * site key is configured, so dev / pre-launch works without keys; the server
 * route enforces the token once `TURNSTILE_SECRET_KEY` is set. `onToken(null)`
 * on expiry/error so the form can require a fresh token.
 */
export function Turnstile({
  onToken,
}: {
  onToken: (token: string | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY || !ready || !ref.current || !window.turnstile) return;
    const id = window.turnstile.render(ref.current, {
      sitekey: SITE_KEY,
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
      theme: "dark",
    });
    return () => window.turnstile?.reset(id);
  }, [ready, onToken]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div ref={ref} className="flex justify-center" />
    </>
  );
}
