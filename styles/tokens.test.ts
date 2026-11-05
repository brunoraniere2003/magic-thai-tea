import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

describe("design tokens - single source of truth", () => {
  it("defines the stage (base) colors", () => {
    // Shared with entertheteatemple.com (HANDOFF.md, Design Direction)
    expect(css).toMatch(/--color-stage:\s*#14100d/i);
    expect(css).toMatch(/--color-cream:/i);
  });

  it("defines the brand and accent color tokens", () => {
    expect(css).toMatch(/--color-seal:\s*#a3261b/i); // cinnabar seal
    expect(css).toMatch(/--color-gold:\s*#d9a253/i); // brass, same as the Temple's --liquor
    expect(css).toMatch(/--color-tea:/i); // tea
    expect(css).toMatch(/--color-mist:/i); // tai chi
  });

  it("binds the display and sans font tokens", () => {
    expect(css).toMatch(/--font-display:/i);
    expect(css).toMatch(/--font-sans:/i);
    expect(css).toMatch(/--font-mono:/i);
  });
});
