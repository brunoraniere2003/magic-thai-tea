import type { Metadata } from "next";
import Link from "next/link";

// The family-and-friends door (brief 2026-10-20, section F). Unlisted and kept
// out of search, but not secret: never put anything sensitive here, and no
// names or photos of anyone without their consent.
export const metadata: Metadata = {
  title: "The inner room",
  robots: { index: false, follow: false },
};

/** Full screen over the site's header and footer: a quiet room of its own. */
export default function InnerRoom() {
  return (
    <main className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-y-auto bg-stage px-6 text-center [background:radial-gradient(60%_50%_at_50%_45%,rgba(58,14,8,0.6),transparent_75%),var(--color-stage)]">
      <span
        aria-hidden
        className="flex size-12 items-center justify-center rounded-md border border-ember/50 font-display text-xl text-ember/80"
      >
        龍
      </span>
      <p className="mt-8 font-sans text-xs uppercase tracking-[0.3em] text-gold/80">
        For family and friends
      </p>
      <p className="mt-6 max-w-xl text-balance font-display text-3xl leading-snug text-cream sm:text-4xl">
        I love you. Thank you for believing in me. I am honored to know you.
      </p>
      <p className="mt-6 font-display text-lg italic text-stone">Ethan</p>
      <Link href="/" className="link-lux mt-12">
        Back to the tea
      </Link>
    </main>
  );
}
