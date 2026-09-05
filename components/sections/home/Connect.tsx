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
        className="grid min-w-0 items-start gap-5 sm:grid-cols-3"
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
        {link.embed ? <Embed link={link} /> : <Preview link={link} />}

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

/**
 * A real third-party embed. Lazy and ratio-boxed, so it costs nothing until it
 * scrolls close and never shifts the layout (§3). A placeholder embed says so
 * on its face: it is somebody else's content, standing in until Ethan's exists.
 */
function Embed({ link }: { link: ConnectLink }) {
  const embed = link.embed;
  if (!embed) return null;

  const ratio = embed.ratio === "portrait" ? "aspect-[4/5]" : "aspect-[16/9]";
  const crop = embed.cropTop ?? 0;

  return (
    <div className={`relative ${ratio} w-full overflow-hidden bg-ink`}>
      <iframe
        src={embed.url}
        title={embed.frameTitle}
        loading="lazy"
        scrolling="no"
        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-x-0 w-full"
        style={{ top: -crop, height: `calc(100% + ${crop}px)` }}
      />
      {embed.placeholder ? (
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-gold/50 bg-stage/85 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-gold">
          Placeholder
        </span>
      ) : null}
    </div>
  );
}

/** The photo half of a card: always visible, since phones cannot hover. */
function Preview({ link }: { link: ConnectLink }) {
  const { kind, images } = link.preview;
  const zoom =
    "object-cover opacity-75 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-100 group-focus-visible:scale-105 group-focus-visible:opacity-100 motion-reduce:transform-none";

  if (kind === "letter") {
    return (
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[radial-gradient(70%_60%_at_50%_35%,rgba(224,160,64,0.14),transparent_70%)]">
        <svg
          aria-hidden
          viewBox="0 0 200 200"
          className="w-3/5 text-gold transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="30" y="62" width="140" height="92" rx="8" />
          <path d="M32 68l68 50 68-50" />
          <path d="M30 148l52-40M170 148l-52-40" />
          {/* The same red chop that stamps the Tea List panel. */}
          <rect
            x="84"
            y="22"
            width="32"
            height="32"
            rx="6"
            className="fill-crimson"
          />
          <path d="M92 32h16M100 32v14M94 44h12" />
        </svg>
        <Veil />
      </div>
    );
  }

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
  if (!image) return null;

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
