import Link from "next/link";
import { SITE } from "@/content/site";
import { buildSmsHref } from "@/lib/contact/sms";

/** Site footer: brand, every section, the Tea Temple, direct contact. */
export function Footer() {
  const smsHref = buildSmsHref(SITE.contact.sms);

  return (
    <footer className="relative z-10 border-t border-stone/15 bg-stage">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div className="max-w-xs">
          <p className="font-display text-2xl text-cream">{SITE.name}</p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-stone">
            {SITE.tagline}
          </p>
          <a
            href={SITE.booking.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 font-sans text-sm text-cream transition-colors hover:border-gold hover:bg-gold hover:text-stage"
          >
            Enter {SITE.booking.name}
            <span aria-hidden className="text-xs">
              ↗
            </span>
          </a>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 gap-y-2.5 sm:grid-cols-1">
            {SITE.menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="font-sans text-sm text-stone transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col gap-2.5">
          <a
            href={`mailto:${SITE.contact.email}`}
            className="font-sans text-sm text-stone transition-colors [overflow-wrap:anywhere] hover:text-cream"
          >
            {SITE.contact.email}
          </a>
          {smsHref ? (
            <a
              href={smsHref}
              className="font-sans text-sm text-stone transition-colors hover:text-cream"
            >
              Text Ethan
            </a>
          ) : null}
        </div>
      </div>

      <div className="border-t border-stone/10">
        <p className="mx-auto max-w-7xl px-6 py-6 font-sans text-xs text-stone/80">
          © {new Date().getFullYear()} {SITE.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
