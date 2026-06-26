import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const css = readFileSync(join(process.cwd(), "app/globals.css"), "utf8");

describe("design tokens — single source of truth", () => {
  it("defines the stage (base) colors", () => {
    expect(css).toMatch(/--color-stage:\s*#0b0a09/i);
    expect(css).toMatch(/--color-cream:/i);
  });

  it("defines the brand and accent color tokens", () => {
    expect(css).toMatch(/--color-ember:/i); // brand fire (the dragon)
    expect(css).toMatch(/--color-gold:/i); // brand gold
    expect(css).toMatch(/--color-tea:/i); // tea
    expect(css).toMatch(/--color-mist:/i); // tai chi
  });

  it("binds the display and sans font tokens", () => {
    expect(css).toMatch(/--font-display:/i);
    expect(css).toMatch(/--font-sans:/i);
  });
});
