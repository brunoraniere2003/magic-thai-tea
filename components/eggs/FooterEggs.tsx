"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { INNER_ROOM } from "@/components/eggs/Eggs";

/** About three minutes on the page: the third steep. */
const THIRD_STEEP_MS = 3 * 60 * 1000;

/**
 * The footer's quiet corner (brief 2026-10-20, section F): a tiny gong, a seal
 * that opens the family-and-friends door, and, after three minutes on the
 * page, a wisp of steam with "You stayed for the third steep."
 */
export function FooterEggs() {
  const [steeped, setSteeped] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSteeped(true), THIRD_STEEP_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
      <button
        type="button"
        aria-label="Strike the gong"
        onClick={() => {
          strikeGong();
          setSettled(true);
        }}
        className="-m-2 flex size-11 items-center justify-center rounded-full text-stone/80 transition-colors duration-[400ms] hover:text-gold focus-visible:outline-2 focus-visible:outline-gold"
      >
        <GongIcon />
      </button>

      <Link
        href={INNER_ROOM}
        aria-label="A door for family and friends"
        className="-m-2 flex size-11 items-center justify-center focus-visible:outline-2 focus-visible:outline-gold"
      >
        <span
          aria-hidden
          className="flex size-5 items-center justify-center rounded-[3px] border border-ember/40 font-display text-[0.6rem] leading-none text-ember/70 transition-colors duration-[400ms] hover:border-ember hover:text-ember"
        >
          龍
        </span>
      </Link>

      <p aria-live="polite" className="font-display text-sm italic text-gold/80">
        {settled ? <span className="egg-line">Settle in.</span> : null}
      </p>

      {steeped ? (
        <p className="egg-line flex items-end gap-2 font-display text-sm italic text-stone">
          <Steam />
          You stayed for the third steep.
        </p>
      ) : null}
    </div>
  );
}

/**
 * One soft gong, made in the browser (no recording, nothing to license): a few
 * inharmonic partials over a low fundamental, each fading on its own, kept
 * quiet. Plays only on the click.
 */
function strikeGong() {
  const AudioCtx =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0.06;
  master.connect(ctx.destination);

  const now = ctx.currentTime;
  const partials: [number, number, number][] = [
    // [frequency Hz, level, seconds to fade]
    [98, 1, 6],
    [146.7, 0.6, 5],
    [207.3, 0.45, 4.2],
    [272.1, 0.3, 3.4],
    [349.8, 0.2, 2.6],
    [438.5, 0.12, 2],
  ];
  for (const [frequency, level, fade] of partials) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    // A gong swells a hair sharp and settles: the shimmer.
    osc.frequency.setValueAtTime(frequency * 1.012, now);
    osc.frequency.exponentialRampToValueAtTime(frequency, now + 0.6);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(level, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + fade);
    osc.connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + fade + 0.1);
  }
  setTimeout(() => void ctx.close(), 7000);
}

function GongIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <path d="M3 4h18M6 4v16M18 4v16" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Steam() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 28"
      className="egg-steam h-7 w-5 text-stone/70"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    >
      <path d="M7 26c-3-4 3-7 0-11s3-7 0-11" />
      <path d="M13 26c-3-4 3-7 0-11s3-7 0-11" />
    </svg>
  );
}
