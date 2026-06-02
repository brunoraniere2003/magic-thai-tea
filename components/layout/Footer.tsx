import Link from "next/link";
import { SITE } from "@/content/site";

/** Site footer: brand, navigation, social, legal, credit. */
export function Footer() {
  return (
    <footer className="relative z-10 border-t border-stone/15 bg-stage">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-2xl text-cream">{SITE.name}</p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-stone">
            {SITE.tagline}
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-col gap-2.5">
          {SITE.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-sans text-sm text-stone transition-colors hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2.5">
          <a
            href={SITE.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm text-stone transition-colors hover:text-cream"
          >
            Instagram
          </a>
          <Link
            href="/privacy"
            className="font-sans text-sm text-stone transition-colors hover:text-cream"
          >
            Privacy
          </Link>
        </div>
      </div>

      <div className="border-t border-stone/10">
        <p className="mx-auto max-w-7xl px-6 py-6 font-sans text-xs text-stone/60">
          © {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
