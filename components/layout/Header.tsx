"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { SITE } from "@/content/site";
import { buildSmsHref } from "@/lib/contact/sms";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { scrollToAnchor, scrollToTop } from "@/lib/smoothScroll";

/** Every in-page section the header knows about, in page order. */
const SECTION_IDS = Array.from(
  new Set(
    [...SITE.menu, ...SITE.nav]
      .filter((item) => item.href.startsWith("#"))
      .map((item) => item.href.slice(1)),
  ),
);

/** Shop goes to The Tea Temple: open it in a new tab, like the booking link. */
const external = (href: string) =>
  href.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" };

/**
 * Which section the reader is in: the last one whose top has passed 40% of the
 * viewport. Empty above the first one (the hero and the cards).
 */
function currentSection(): string {
  const line = window.innerHeight * 0.4;
  const atBottom =
    window.innerHeight + window.scrollY >=
    document.documentElement.scrollHeight - 4;
  let current = "";
  let lastTop = -Infinity;
  let lastId = "";
  for (const id of SECTION_IDS) {
    const el = document.getElementById(id);
    if (!el) continue;
    const top = el.getBoundingClientRect().top;
    if (top <= line && top > lastTop) {
      current = id;
      lastTop = top;
    }
    lastId = id;
  }
  // The contact form is short: at the very bottom it is the place you are.
  return atBottom && lastId ? "contact" : current;
}

const BOOKING_LABEL = `${SITE.booking.cta} at ${SITE.booking.name} (opens in a new tab)`;

/**
 * Fixed top header. Transparent over the hero, then a solid stage background
 * once scrolled, with a gold hairline that fills as you read down the page.
 *
 * Desktop: six text links that light up for the section you are in, and the
 * "Book a Session" button, which glides to the contact form. Tablet: Shop, booking and the menu. Phone:
 * Shop and the menu, which opens a full-screen index of every section plus a
 * card for The Tea Temple. Shop opens the shop on The Tea Temple in a new tab.
 * Esc closes; body scroll locks while it is open.
 */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  const reducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const hasOpened = useRef(false);
  const smsHref = buildSmsHref(SITE.contact.sms);

  // Smoothly scroll to an in-page anchor; close the mobile menu.
  const onAnchorClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    setOpen(false);
    setActive(href.slice(1));
    scrollToAnchor(href);
  };

  // The brand glides the page back to the top instead of reloading "/".
  const onBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setOpen(false);
    scrollToTop();
  };

  // Background, reading progress and the active section, once per frame.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 64);
      setActive(currentSection());
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
          duration: 0.55,
          ease: "power3.inOut",
        })
        .from(
          links,
          {
            yPercent: 60,
            opacity: 0,
            duration: 0.45,
            stagger: 0.045,
            ease: "power3.out",
            // Don't pre-hide the links: if the timeline never reaches this tween,
            // they stay visible instead of getting stuck at opacity 0.
            immediateRender: false,
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
      duration: 0.4,
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

  const isActive = (href: string) => active !== "" && href === `#${active}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500 ${
        scrolled && !open
          ? "border-stone/10 bg-stage/95 backdrop-blur-md"
          : "border-transparent"
      }`}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4"
      >
        <Link
          href="/"
          data-brand
          className="relative z-50 -my-2 shrink-0 py-2 font-display text-base text-cream sm:text-lg"
          onClick={onBrandClick}
        >
          {SITE.name}
        </Link>

        {/* Desktop: the section links. */}
        <ul className="hidden items-center gap-7 lg:flex">
          {SITE.nav.map((item) => {
            const current = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  {...external(item.href)}
                  aria-current={current ? "location" : undefined}
                  onClick={(event) => onAnchorClick(event, item.href)}
                  className={`group relative -my-2 block py-2 font-sans text-sm tracking-wide transition-[color,letter-spacing] duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-cream hover:tracking-wider focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold ${
                    current ? "text-cream" : "text-stone"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute bottom-0.5 left-0 h-px bg-gold transition-all duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:w-full ${
                      current ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-5">
          {/* Shop stays one tap away on every screen below desktop. */}
          <a
            href={SITE.shopUrl}
            {...external(SITE.shopUrl)}
            className={`relative z-50 -my-2 py-2 font-sans text-sm text-stone transition-colors hover:text-cream lg:hidden ${
              open ? "invisible" : ""
            }`}
          >
            Shop
          </a>

          {/* Always in view: glides to the contact form (brief 2026-10-20). */}
          <a
            href={SITE.headerCta.href}
            onClick={(event) => onAnchorClick(event, SITE.headerCta.href)}
            className="btn-lux hidden whitespace-nowrap px-5 sm:inline-flex"
          >
            {SITE.headerCta.label}
          </a>

          {/* The only navigation control on a phone, so the tap area is padded
              out to 44px and pulled back with a negative margin. */}
          <button
            type="button"
            className="relative z-50 -m-3 p-3 font-sans text-sm text-cream lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* Reading progress: a gold hairline along the bottom of the header. */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 -bottom-px h-px overflow-hidden transition-opacity duration-500 ${
          scrolled && !open ? "opacity-100" : "opacity-0"
        }`}
      >
        <span
          ref={progressRef}
          className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-gold/30 via-gold/80 to-gold"
        />
      </span>

      <div
        ref={overlayRef}
        id="mobile-nav"
        className="invisible fixed inset-0 z-40 overflow-y-auto bg-stage/97 backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto flex min-h-full max-w-md flex-col px-6 pb-10 pt-24">
          <ul ref={itemsRef} className="flex flex-col">
            {SITE.menu.map((item, index) => {
              const current = isActive(item.href);
              return (
                <li
                  key={item.href}
                  className="overflow-hidden border-b border-stone/10"
                >
                  <Link
                    href={item.href}
                    {...external(item.href)}
                    aria-current={current ? "location" : undefined}
                    className="flex items-baseline gap-4 py-3.5"
                    onClick={(event) => onAnchorClick(event, item.href)}
                  >
                    <span className="w-6 font-sans text-[0.65rem] tracking-[0.2em] text-gold/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-display text-[1.7rem] leading-tight ${
                        current ? "text-gold" : "text-cream"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
            {/* The Tea Temple, as an invitation rather than one more row. */}
            <li className="mt-8 overflow-hidden">
              <a
                href={SITE.booking.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={BOOKING_LABEL}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(224,160,64,0.14),transparent_60%)] px-5 py-4"
              >
                <span className="flex flex-col">
                  <span className="font-display text-xl text-cream">
                    {SITE.booking.name}
                  </span>
                  <span className="mt-0.5 font-sans text-xs text-stone">
                    {SITE.booking.note}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-gold px-4 py-2 font-sans text-xs font-medium text-stage">
                  {SITE.booking.cta} <span aria-hidden>↗</span>
                </span>
              </a>
            </li>
          </ul>

          <div className="mt-auto flex items-center gap-6 pt-10 font-sans text-sm text-stone">
            {smsHref ? (
              <a href={smsHref} className="transition-colors hover:text-cream">
                Text Ethan
              </a>
            ) : null}
            <a
              href={`mailto:${SITE.contact.email}`}
              className="transition-colors hover:text-cream"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
