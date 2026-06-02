import Image from "next/image";

/**
 * Static background behind the Hero — and the default for reduced-motion /
 * low-tier devices and mobile. A placeholder atmospheric image, darkened for
 * legibility, with a warm glow. The reactive fluid (Camada B) layers on top.
 * Purely decorative → aria-hidden.
 */
export function HeroPoster() {
  return (
    <div aria-hidden className="absolute inset-0 bg-stage">
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-60"
      />
      {/* darken for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/55 to-stage/75" />
      {/* warm ember glow rising from the bottom */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_125%,rgba(255,94,26,0.16),transparent_60%)]" />
    </div>
  );
}
