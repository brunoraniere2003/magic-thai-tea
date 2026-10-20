"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Easter eggs that live page-wide (brief 2026-10-20, section F). None of them
 * blocks the page, a form or the checkout: no popups, nothing focusable,
 * nothing tracked.
 *
 * - The dragon: five clicks on the site name in the header, and a thin
 *   ink-brush dragon crosses the screen once.
 * - The family-and-friends door: typing "gongfu" anywhere outside a form field
 *   opens the unlisted page (app/inner-room). The footer seal opens it too.
 * - Under the lid: a small teapot in the developer console.
 *
 * The rest (the third steep, the gong, the seal) live in FooterEggs.
 */

export const INNER_ROOM = "/inner-room";
const SECRET_WORD = "gongfu";
const DRAGON_CLICKS = 5;

const TEAPOT = String.raw`
        _
     __/ \__      ~
    (       )====(_)
     \_____/
`;

/** A keystroke typed into a field belongs to the field, not to the egg. */
function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

export function Eggs() {
  const router = useRouter();
  const [flights, setFlights] = useState(0);

  // Under the lid.
  useEffect(() => {
    console.log(
      `%c${TEAPOT}\nYou looked under the lid. Say hi.`,
      "color:#e0a040;font-family:monospace",
    );
  }, []);

  // The secret word, typed anywhere but inside a field.
  useEffect(() => {
    let typed = "";
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isEditable(event.target) || event.key.length !== 1) return;
      typed = (typed + event.key.toLowerCase()).slice(-SECRET_WORD.length);
      if (typed === SECRET_WORD) {
        typed = "";
        router.push(INNER_ROOM);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  // Five clicks on the name, close together.
  useEffect(() => {
    let clicks = 0;
    let last = 0;
    const onClick = (event: MouseEvent) => {
      if (!(event.target as HTMLElement | null)?.closest?.("[data-brand]")) return;
      const now = Date.now();
      clicks = now - last < 2500 ? clicks + 1 : 1;
      last = now;
      if (clicks >= DRAGON_CLICKS) {
        clicks = 0;
        setFlights((n) => n + 1);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return flights > 0 ? <FlyingDragon key={flights} /> : null;
}

/** One pass of the ink dragon, then it is gone. */
function FlyingDragon() {
  const reducedMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), reducedMotion ? 1800 : 4200);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  if (done) return null;
  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-[22%] z-[70] ${
        reducedMotion ? "egg-dragon-still" : "egg-dragon-fly"
      }`}
    >
      <InkDragon className="h-auto w-[min(70vw,560px)] text-gold" />
    </div>
  );
}

/** A thin ink-brush dragon: one sinuous stroke, a head, two whiskers. */
function InkDragon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 180" className={className} fill="none">
      <defs>
        <filter id="ink-brush">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="3" />
        </filter>
      </defs>
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ink-brush)"
      >
        {/* Body: thick near the head, thinning to the tail. */}
        <path
          d="M470 78 C430 30 380 30 350 78 S270 128 230 82 S150 36 110 84 S40 120 8 96"
          strokeWidth="7"
          strokeOpacity="0.9"
        />
        <path
          d="M350 78 S270 128 230 82 S150 36 110 84 S40 120 8 96"
          strokeWidth="3"
          strokeOpacity="0.5"
          transform="translate(0 6)"
        />
        {/* Spine flicks. */}
        <path d="M402 44 l6 -14 M372 52 l2 -15 M262 112 l-4 14 M182 62 l3 -14 M120 78 l-2 -13" strokeWidth="2.5" />
        {/* Legs, mid-stride. */}
        <path d="M392 64 c4 16 -2 24 -12 30 M276 106 c-2 16 6 24 16 28 M160 64 c-6 -14 -2 -22 6 -28" strokeWidth="3" />
        {/* Head: snout, jaw, horn, eye. */}
        <path
          d="M470 78 C488 66 512 62 534 70 C548 75 556 82 562 86 C548 90 530 92 514 98 C500 103 486 98 470 78 Z"
          strokeWidth="4"
          fill="currentColor"
          fillOpacity="0.15"
        />
        <path d="M486 68 c4 -18 18 -30 36 -34 M500 66 c8 -12 20 -18 34 -18" strokeWidth="2.5" />
        <circle cx="518" cy="76" r="2.5" fill="currentColor" stroke="none" />
        {/* Whiskers, trailing. */}
        <path d="M560 84 c18 -2 30 -14 36 -30 M556 90 c16 8 26 22 28 40" strokeWidth="1.5" strokeOpacity="0.8" />
      </g>
    </svg>
  );
}
