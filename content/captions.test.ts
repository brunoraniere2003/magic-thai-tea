import { describe, expect, it } from "vitest";
import {
  CAPTIONS,
  captionFor,
  formatCaption,
  isWellFormedCaption,
  type Caption,
} from "./captions";

describe("formatCaption", () => {
  it("joins subject, context and note with an em dash separator", () => {
    const caption: Caption = {
      subject: "Single Whip",
      context: "one of the signature postures of the Yang-style form",
      note: "training full-body coordination through one continuous motion",
    };
    expect(formatCaption(caption)).toBe(
      "Single Whip — one of the signature postures of the Yang-style form — training full-body coordination through one continuous motion",
    );
  });

  it("omits the optional note", () => {
    expect(
      formatCaption({
        subject: "Gongfu tea, poured",
        context: "the second steep",
      }),
    ).toBe("Gongfu tea, poured — the second steep");
  });

  it("drops a trailing period (captions are fragments, not sentences)", () => {
    expect(
      formatCaption({ subject: "Master Sifu Chen", context: "my teacher." }),
    ).toBe("Master Sifu Chen — my teacher");
  });

  it("collapses whitespace so a caption is always a single line", () => {
    expect(
      formatCaption({
        subject: " Guests \n at a tasting ",
        context: "six pours in",
      }),
    ).toBe("Guests at a tasting — six pours in");
  });
});

describe("isWellFormedCaption", () => {
  it("accepts a two- or three-part fragment", () => {
    expect(isWellFormedCaption("Single Whip — a posture")).toBe(true);
    expect(isWellFormedCaption("Single Whip — a posture — a note")).toBe(true);
  });

  it("rejects a caption with no separator, a trailing period, or a line break", () => {
    expect(isWellFormedCaption("Single Whip")).toBe(false);
    expect(isWellFormedCaption("Single Whip — a posture.")).toBe(false);
    expect(isWellFormedCaption("Single Whip — a\nposture")).toBe(false);
  });
});

describe("CAPTIONS", () => {
  it("ships the starter set from the handoff, all well formed", () => {
    const entries = Object.values(CAPTIONS);
    expect(entries.length).toBeGreaterThanOrEqual(6);
    for (const caption of entries) {
      expect(isWellFormedCaption(formatCaption(caption))).toBe(true);
    }
  });

  it("is keyed by image path so new captions are data, not code", () => {
    for (const key of Object.keys(CAPTIONS)) {
      expect(key).toMatch(/^\/images\//);
    }
  });

  it("returns undefined for an image that has no caption yet", () => {
    expect(captionFor("/images/does-not-exist.jpg")).toBeUndefined();
  });

  it("captions the master photo with the Sifu Chen lineage note", () => {
    expect(captionFor("/images/tai-chi/master-and-ethan.jpg")).toContain(
      "Sifu Chen",
    );
  });
});
