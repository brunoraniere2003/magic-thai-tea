import Link from "next/link";
import { SITE } from "@/content/site";
import { buildSmsHref } from "@/lib/contact/sms";
import { FooterEggs } from "@/components/eggs/FooterEggs";

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
            aria-label={`Enter ${SITE.booking.name} (opens in a new tab)`}
            className="btn-lux mt-6 px-5"
          >
            Enter {SITE.booking.name}
            <span aria-hidden className="text-xs">
              ↗
            </span>
          </a>
        </div>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-x-8 sm:grid-cols-1">
            {SITE.menu.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center font-sans text-sm text-stone transition-colors duration-[400ms] hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col">
          <a
            href={`mailto:${SITE.contact.email}`}
            className="inline-flex min-h-11 items-center font-sans text-sm text-stone transition-colors duration-[400ms] [overflow-wrap:anywhere] hover:text-cream"
          >
            {SITE.contact.email}
          </a>
          {smsHref ? (
            <a
              href={smsHref}
              className="inline-flex min-h-11 items-center font-sans text-sm text-stone transition-colors duration-[400ms] hover:text-cream"
            >
              Text Ethan
            </a>
          ) : null}
        </div>
      </div>

      <div className="border-t border-stone/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <p className="font-sans text-xs text-stone">
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <FooterEggs />
        </div>
      </div>
    </footer>
  );
}
