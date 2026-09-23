/**
 * Photo captions, keyed by image path (spec 033 / R6).
 *
 * House format from the handoff:
 *   [what's happening] — [where/context] — [technique or lineage note, optional]
 * One line, no closing period (captions are fragments, not sentences).
 *
 * Ethan keeps sending more captions in this same format: adding one is a data
 * edit here, never a component change. An image with no entry simply renders
 * without a `<figcaption>`.
 */

export interface Caption {
  /** What's happening. */
  subject: string;
  /** Where it happens, or the context around it. */
  context: string;
  /** Optional technique or lineage note. */
  note?: string;
}

const SEPARATOR = " — ";

function tidy(part: string): string {
  return part.replace(/\s+/g, " ").trim();
}

/** Joins a caption into its one-line house format, without a closing period. */
export function formatCaption(caption: Caption): string {
  const parts = [caption.subject, caption.context, caption.note]
    .map((part) => (part ? tidy(part) : ""))
    .filter(Boolean);

  return parts.join(SEPARATOR).replace(/\.$/, "");
}

/** Guard used by the tests: two or three parts, one line, no closing period. */
export function isWellFormedCaption(caption: string): boolean {
  if (/[\n\r]/.test(caption)) return false;
  if (caption.trim().endsWith(".")) return false;

  const parts = caption.split(SEPARATOR);
  return parts.length >= 2 && parts.length <= 3 && parts.every((p) => p.trim());
}

/** Starter set from the handoff (8/20/26). More arrive in the same shape. */
export const CAPTIONS: Record<string, Caption> = {
  "/images/tai-chi/master-and-ethan.jpg": {
    subject: "Master Sifu Chen in Taipei, Taiwan",
    context: "my Tai Chi and White Crane teacher",
  },
  "/images/tai-chi/tai-chi-teaching.jpg": {
    subject: "Single Whip",
    context: "one of the signature postures of the Yang-style form",
    note: "training full-body coordination through one continuous motion",
  },
  "/images/tai-chi/tai-chi-teaching-2.jpg": {
    subject: "White Crane Spreads Its Wings",
    context: "drawn from my training in Taipei",
    note: "opening the chest and stabilizing the stance in a single breath",
  },
  "/images/worlds/taichi.jpg": {
    subject: "Golden Rooster Stands on One Leg",
    context: "balance training disguised as elegance",
  },
  "/images/tea/tea-pouring-smiling.jpg": {
    subject: "Gongfu tea, poured",
    context: "the second steep of a high-mountain oolong",
    note: "where the leaf really starts to open up",
  },
  "/images/tea/tea-friends-smiling.jpg": {
    subject: "Guests at a private tasting",
    context: "six pours in, deep in conversation",
  },
};

/** The formatted caption for an image, or `undefined` when none exists yet. */
export function captionFor(src: string): string | undefined {
  const caption = CAPTIONS[src];
  return caption ? formatCaption(caption) : undefined;
}
