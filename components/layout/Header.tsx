"use client";

import Link from "next/link";
import { useState } from "react";
import { SITE } from "@/content/site";

/** Fixed top header over the Hero: brand + nav (desktop inline / mobile menu). */
export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"
      >
        <Link
          href="/"
          className="font-display text-lg text-cream"
          onClick={() => setOpen(false)}
        >
          {SITE.name}
        </Link>

        <ul className="hidden gap-8 sm:flex">
          {SITE.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="font-sans text-sm tracking-wide text-stone transition-colors hover:text-cream"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="font-sans text-sm text-cream sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open ? (
        <ul
          id="mobile-nav"
          className="flex flex-col gap-1 bg-stage/95 px-6 pb-6 backdrop-blur-sm sm:hidden"
        >
          {SITE.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block py-2 font-sans text-base text-cream"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
