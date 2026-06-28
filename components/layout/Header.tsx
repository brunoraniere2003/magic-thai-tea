"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { SITE } from "@/content/site";
import { buttonClasses } from "@/components/ui/Button";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { scrollToAnchor, scrollToTop } from "@/lib/smoothScroll";

const CONTACT_HREF = "#contact";

/**
 * Fixed top header. Transparent over the Hero, then a blurred translucent
 * background once scrolled. In-page anchor links scroll smoothly. The "Talk to
 * Ethan" item is a pill CTA → the contact form. On mobile the menu is a
 * full-screen overlay that reveals (clip-path) with its links cascading in.
 * Reduced motion → instant toggle. Esc closes; body scroll locks while open.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const hasOpened = useRef(false);

  // Smoothly scroll to an in-page anchor; close the mobile menu.
  const onAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    setOpen(false);
    scrollToAnchor(href);
  };

  // The brand glides the page back to the top instead of reloading "/".
  const onBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    scrollToTop();
  };

  // Translucent background once the user scrolls past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Animate the overlay + items open/close.
  useEffect(() => {
    const overlay = overlayRef.current;
    const items = itemsRef.current;
    if (!overlay) return;

    document.body.style.overflow = open ? "hidden" : "";
    const links = items ? Array.from(items.querySelectorAll("a")) : [];

    if (reducedMotion) {
      gsap.set(overlay, { autoAlpha: open ? 1 : 0, clipPath: "none" });
      gsap.set(links, { clearProps: "all" });
      return;
    }

    if (open) {
      hasOpened.current = true;
      const tl = gsap.timeline();
      tl.set(overlay, { autoAlpha: 1, clipPath: "inset(0 0 100% 0)" })
        .to(overlay, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.6,
          ease: "power3.inOut",
        })
        .from(
          links,
          {
            yPercent: 120,
            opacity: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "power3.out",
          },
          "-=0.25",
        );
      return () => {
        tl.kill();
      };
    }

    if (!hasOpened.current) {
      gsap.set(overlay, { autoAlpha: 0, clipPath: "inset(0 0 100% 0)" });
      return;
    }

    const tl = gsap.timeline();
    tl.to(overlay, {
      clipPath: "inset(0 0 100% 0)",
      duration: 0.45,
      ease: "power3.inOut",
    }).set(overlay, { autoAlpha: 0 });
    return () => {
      tl.kill();
    };
  }, [open, reducedMotion]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Restore scroll on unmount.
  useEffect(
    () => () => {
      document.body.style.overflow = "";
    },
    [],
  );

  const links = SITE.nav.filter((item) => item.href !== CONTACT_HREF);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled && !open
          ? "border-stone/10 bg-stage"
          : "border-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5"
      >
        <Link
          href="/"
          className="relative z-50 font-display text-lg text-cream"
          onClick={onBrandClick}
        >
          {SITE.name}
        </Link>

        <div className="hidden items-center gap-8 sm:flex">
          <ul className="flex gap-8">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(event) => onAnchorClick(event, item.href)}
                  className="group relative font-sans text-sm tracking-wide text-stone transition-colors hover:text-cream"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-cream transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={CONTACT_HREF}
            onClick={(event) => onAnchorClick(event, CONTACT_HREF)}
            className={buttonClasses("primary", "px-5 py-2.5")}
          >
            Talk to Ethan
          </Link>
        </div>

        <button
          type="button"
          className="relative z-50 font-sans text-sm text-cream sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      <div
        ref={overlayRef}
        id="mobile-nav"
        className="invisible fixed inset-0 z-40 flex flex-col items-center justify-center bg-stage/95 backdrop-blur-xl sm:hidden"
      >
        <ul ref={itemsRef} className="flex flex-col items-center gap-7">
          {SITE.nav.map((item) => (
            <li key={item.href} className="overflow-hidden py-1">
              <Link
                href={item.href}
                className="font-display text-4xl text-cream"
                onClick={(event) => onAnchorClick(event, item.href)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
