import Image from "next/image";
import type { ReactNode } from "react";
import { Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { TiltCard } from "@/components/shared/TiltCard";
import { HOME, type ConnectLink } from "@/content/home";

/**
 * "Find me elsewhere" (spec 033 / R8).
 *
 * The podcast is a real YouTube embed of the channel's uploads, so the section
 * plays Ethan's latest episode without anyone leaving the page. Instagram
 * cannot be embedded logged-out, so it gets a framed feed of his own photos
 * that links out. Cards lean toward the cursor on mouse, stay flat on touch
 * and under reduced motion (§5).
 */
export function Connect() {
  const { connect } = HOME;

  return (
    <section
      id="connect"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20 sm:py-28"
    >
      <SectionHeading
        eyebrow={connect.eyebrow}
        title={connect.title}
        align="center"
        className="mx-auto mb-12"
      />

      <Stagger
        as="ul"
        className="grid min-w-0 gap-5 sm:grid-cols-3"
        start="top 90%"
      >
        {connect.links.map((link) => (
          <li key={link.label} className="min-w-0">
            <ChannelCard link={link} />
          </li>
        ))}
      </Stagger>
    </section>
  );
}

function ChannelCard({ link }: { link: ConnectLink }) {
  const external = link.href.startsWith("http");

  return (
    <TiltCard className="h-full">
      <a
        href={link.href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone/20 bg-stage/40 transition-colors duration-300 hover:border-gold/50 focus-visible:border-gold/50 focus-visible:outline-none"
      >
        {link.embed ? (
          <div className="relative aspect-[16/9] w-full bg-ink">
            <iframe
              src={link.embed.url}
              title={link.embed.frameTitle}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        ) : (
          <Preview link={link} />
        )}

        <div className="flex flex-1 flex-col gap-2 p-5">
          <span className="flex items-center gap-2 text-gold">
            {ICONS[link.label] ?? ICONS.Email}
            <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-stone/70">
              {link.label}
            </span>
          </span>
          <span className="font-display text-lg leading-snug text-cream transition-colors [overflow-wrap:anywhere] group-hover:text-white">
            {link.value}
          </span>
          {link.note ? (
            <span className="mt-auto font-sans text-sm leading-relaxed text-stone">
              {link.note}
            </span>
          ) : null}
        </div>
      </a>
    </TiltCard>
  );
}

/** The photo half of a card: always visible, since phones cannot hover. */
function Preview({ link }: { link: ConnectLink }) {
  const { kind, images } = link.preview;
  const zoom =
    "object-cover opacity-75 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-100 group-focus-visible:scale-105 group-focus-visible:opacity-100 motion-reduce:transform-none";

  if (kind === "grid") {
    return (
      <div className="relative grid aspect-[16/9] grid-cols-3 gap-px bg-stone/10">
        {images.map((image) => (
          <div key={image.src} className="relative overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 1024px) 12vw, 33vw"
              className={`${zoom} ${
                image.position === "top" ? "object-top" : "object-center"
              }`}
            />
          </div>
        ))}
        <Veil />
      </div>
    );
  }

  const [image] = images;

  return (
    <div className="relative aspect-[16/9] overflow-hidden">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(min-width: 1024px) 25vw, 100vw"
        className={`${zoom} ${
          image.position === "top" ? "object-top" : "object-center"
        }`}
      />
      <Veil />
    </div>
  );
}

/** Keeps the photos sitting under the copy instead of shouting over it. */
function Veil() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stage via-stage/20 to-transparent"
    />
  );
}

const iconProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

/** Drawn in the same thin gold line art as the card faces in the hero. */
const ICONS: Record<string, ReactNode> = {
  Email: (
    <svg {...iconProps}>
      <rect x="3" y="7" width="26" height="18" rx="3" />
      <path d="M4 9l12 9 12-9" />
    </svg>
  ),
  Instagram: (
    <svg {...iconProps}>
      <rect x="4" y="4" width="24" height="24" rx="7" />
      <circle cx="16" cy="16" r="6" />
      <circle cx="23" cy="9" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  Podcast: (
    <svg {...iconProps}>
      <rect x="12" y="3" width="8" height="15" rx="4" />
      <path d="M7 15a9 9 0 0 0 18 0" />
      <path d="M16 24v5" />
      <path d="M11 29h10" />
    </svg>
  ),
};
