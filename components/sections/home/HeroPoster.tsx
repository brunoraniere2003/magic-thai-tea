/**
 * Static, beautiful fallback behind the Hero — and the default for
 * reduced-motion / low-tier devices. Purely decorative, so aria-hidden.
 * (The reactive fluid in Camada B layers on top of this same look.)
 */
export function HeroPoster() {
  return (
    <div aria-hidden className="absolute inset-0 bg-stage">
      {/* warm ember glow rising from the bottom (magic) */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_125%,rgba(255,94,26,0.20),transparent_60%)]" />
      {/* soft gold halo from the top */}
      <div className="absolute inset-0 bg-[radial-gradient(85%_60%_at_50%_-10%,rgba(224,160,64,0.12),transparent_55%)]" />
      {/* deep vignette to seat the stage */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_50%,transparent_55%,rgba(0,0,0,0.55))]" />
    </div>
  );
}
