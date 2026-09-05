import Image from "next/image";
import type { ReactNode } from "react";
import { Stagger } from "@/components/motion";
import { SectionHeading } from "@/components/shared";
import { TiltCard } from "@/components/shared/TiltCard";
import { HOME, type ConnectLink } from "@/content/home";

/**
 * "Find me elsewhere" (spec 033 / R8) as a bento grid.
 *
 * Sizes carry the hierarchy: Instagram is the tall tile because it is the feed
 * that actually moves, the podcast and the inbox are wide tiles beside it. Each
 * tile fills its cell (`auto-rows-fr` + `flex-1` media), so the row bottoms line
 * up instead of ending ragged, and the media letterboxes itself rather than
 * dictating the height.
 *
 * Instagram has no profile embed, so the tile embeds a real post; the podcast
 * player is a labelled placeholder until Ethan publishes (ADR 0015). Tiles lean
 * toward the cursor on mouse, stay flat on touch and reduced motion (§5).
 */

/** Bento placement per channel: which cell each tile takes at each breakpoint. */
const TILE_SPAN: Record<string, string> = {
  Instagram: "sm:row-span-2 lg:col-span-5",
  Podcast: "lg:col-span-7",
  Email: "lg:col-span-7",
};

export function Connect() {
  const { connect } = HOME;
  const ordered = [...connect.links].sort(
    (a, b) => ORDER.indexOf(a.label) - ORDER.indexOf(b.label),
  );

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
        className="grid min-w-0 gap-4 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[minmax(0,16rem)]"
        start="top 90%"
      >
        {ordered.map((link) => (
          <li
            key={link.label}
            className={`min-w-0 ${TILE_SPAN[link.label] ?? "lg:col-span-4"}`}
          >
            <ChannelCard link={link} />
          </li>
        ))}
      </Stagger>
    </section>
  );
}

/** Instagram first: it is the tile that spans two rows. */
const ORDER = ["Instagram", "Podcast", "Email"];

function ChannelCard({ link }: { link: ConnectLink }) {
  const external = link.href.startsWith("http");

  return (
    <TiltCard className="h-full" max={4}>
      <a
        href={link.href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone/20 bg-stage/40 transition-colors duration-300 hover:border-gold/50 focus-visible:border-gold/50 focus-visible:outline-none"
      >
        {link.embed ? <Embed link={link} /> : <Preview link={link} />}

        <div className="flex shrink-0 flex-col gap-1 p-5">
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
            <span className="font-sans text-sm leading-relaxed text-stone">
              {link.note}
            </span>
          ) : null}
        </div>
      </a>
    </TiltCard>
  );
}

/**
 * The media half of a tile. It grows into whatever the cell leaves over
 * (`flex-1`) with a floor on small screens, so nothing collapses when the grid
 * is a single column.
 */
const MEDIA = "relative min-h-56 w-full flex-1 overflow-hidden sm:min-h-0";

/**
 * A real third-party embed: lazy, and boxed by the tile rather than by its own
 * aspect ratio, so it can never push the grid out of line (§3).
 */
function Embed({ link }: { link: ConnectLink }) {
  const embed = link.embed;
  if (!embed) return null;

  const cropTop = embed.cropTop ?? 0;
  const cropBottom = embed.cropBottom ?? 0;

  return (
    <div className={`${MEDIA} bg-ink`}>
      <iframe
        src={embed.url}
        title={embed.frameTitle}
        loading="lazy"
        scrolling="no"
        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
        className="absolute inset-x-0 w-full"
        style={{
          top: -cropTop,
          height: `calc(100% + ${cropTop + cropBottom}px)`,
        }}
      />
      {embed.placeholder ? (
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-gold/50 bg-stage/85 px-3 py-1 font-sans text-[0.6rem] uppercase tracking-[0.2em] text-gold">
          Placeholder
        </span>
      ) : null}
    </div>
  );
}

/** Tiles with no embed: a drawn panel for the inbox, photos otherwise. */
function Preview({ link }: { link: ConnectLink }) {
  const { kind, images } = link.preview;
  const zoom =
    "object-cover opacity-75 transition-[transform,opacity] duration-500 group-hover:scale-105 group-hover:opacity-100 group-focus-visible:scale-105 group-focus-visible:opacity-100 motion-reduce:transform-none";

  if (kind === "letter") {
    return (
      <div
        className={`${MEDIA} flex items-center justify-center bg-[radial-gradient(70%_70%_at_50%_45%,rgba(224,160,64,0.14),transparent_70%)]`}
      >
        <svg
          aria-hidden
          viewBox="0 0 200 140"
          className="h-3/5 max-h-40 text-gold transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="34" y="34" width="132" height="86" rx="8" />
          <path d="M36 40l64 46 64-46" />
          <path d="M34 114l50-38M166 114l-50-38" />
          {/* The same red chop that stamps the Tea List panel. */}
          <rect x="86" y="6" width="28" height="28" rx="6" className="fill-crimson" />
          <path d="M93 16h14M100 12v16M95 26h10" />
        </svg>
      </div>
    );
  }

  if (kind === "grid") {
    return (
      <div className={`${MEDIA} grid grid-cols-3 gap-px bg-stone/10`}>
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
    <div className={MEDIA}>
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
