"use client";

import { useEffect } from "react";
import type { DeckCard } from "@/webgl/cards/FlippingCardsScene";

interface Props {
  card: DeckCard | null;
  onClose: () => void;
  onBook: () => void;
}

/**
 * The reveal overlay (spec 031): tapping a card's "Reveal" button fades this in
 * over the deck, the blurb appears word by word (ChatGPT style), then a "Book"
 * button. Click outside or press Esc to close. Reduced motion shows it instantly
 * (the global media query collapses the animations).
 */
export function CardDetailOverlay({ card, onClose, onBook }: Props) {
  useEffect(() => {
    if (!card) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [card, onClose]);

  if (!card) return null;

  const words = card.blurb.split(" ");
  // Book button appears just after the last word is written.
  const bookDelay = 220 + words.length * 55 + 200;

  return (
    <div
      className="overlay-in absolute inset-0 z-20 flex items-center justify-center bg-stage/85 px-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={card.title}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border-2 border-gold/50 bg-gradient-to-b from-crimson to-stage p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-3 font-sans text-2xl leading-none text-stone transition-colors hover:text-cream"
        >
          ×
        </button>

        <h3 className="word-in font-display text-3xl text-gold">{card.title}</h3>

        <p className="mt-5 font-sans text-base leading-relaxed text-cream/90">
          {words.map((word, i) => (
            <span
              key={i}
              className="word-in"
              style={{ animationDelay: `${220 + i * 55}ms` }}
            >
              {word}{" "}
            </span>
          ))}
        </p>

        <button
          type="button"
          onClick={onBook}
          className="word-in mt-7 rounded-full bg-gold px-8 py-2.5 font-sans text-sm font-medium uppercase tracking-[0.2em] text-crimson transition hover:brightness-110"
          style={{ animationDelay: `${bookDelay}ms` }}
        >
          Book
        </button>
      </div>
    </div>
  );
}
