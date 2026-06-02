"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { SITE } from "@/content/site";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";

/**
 * Fixed top header. Transparent over the Hero, then a blurred translucent
 * background once scrolled. On mobile, the menu is a full-screen overlay that
 * reveals (clip-path) with its links cascading in. Reduced motion → instant
 * toggle, no animation. Esc closes; body scroll locks while open.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const hasOpened = useRef(false);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled && !open
          ? "border-stone/10 bg-stage/70 backdrop-blur-md"
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
          onClick={() => setOpen(false)}
        >
          {SITE.name}
        </Link>

        <ul className="hidden gap-8 sm:flex">
          {SITE.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="group relative font-sans text-sm tracking-wide text-stone transition-colors hover:text-cream"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-cream transition-all duration-300 group-hover:w-full" />
              </Link>
            </li>
          ))}
        </ul>

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
                onClick={() => setOpen(false)}
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
