import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseBusyBlocks, mergeBusy, formatClock, dayKey } from "./parseBusy";
import { isPublicClass } from "./parseSchedule";

const fixture = (name: string) =>
  readFileSync(join(process.cwd(), "lib/calendar/__fixtures__", name), "utf8");

const CLASSES = fixture("classes.ics");
const BUSINESS = fixture("business.ics");

// A Thursday, so the weekly "Private training with Wayne" (11:00) applies.
const THURSDAY = new Date(2026, 8, 24, 8, 0, 0);

describe("parseBusyBlocks", () => {
  it("keeps only day, start and end — never who or where", () => {
    const blocks = parseBusyBlocks([CLASSES], { from: THURSDAY, days: 7 });
    expect(blocks.length).toBeGreaterThan(0);
    for (const block of blocks) {
      expect(Object.keys(block).sort()).toEqual(["day", "end", "start"]);
    }
    const dump = JSON.stringify(blocks);
    expect(dump).not.toMatch(/Wayne|Handyman|Ave|zoom/i);
  });

  it("counts the private booking that lives on the class calendar", () => {
    const blocks = parseBusyBlocks([CLASSES], {
      from: THURSDAY,
      days: 1,
      isOpen: isPublicClass,
    });
    // "Private training with Wayne", weekly on Thursday at 11:00.
    const morning = blocks.find((b) => b.start === 11 * 60);
    expect(morning).toBeDefined();
    expect(morning?.day).toBe(dayKey(THURSDAY));
  });

  it("does not mark an open class as busy", () => {
    const from = new Date(2026, 8, 21, 6, 0, 0); // a Monday
    const withClasses = parseBusyBlocks([CLASSES], { from, days: 1 });
    const withoutClasses = parseBusyBlocks([CLASSES], {
      from,
      days: 1,
      isOpen: isPublicClass,
    });
    // Monday has "Tai Chi Training" at 9:00: busy without the filter, free with.
    expect(withClasses.some((b) => b.start === 9 * 60)).toBe(true);
    expect(withoutClasses.some((b) => b.start === 9 * 60)).toBe(false);
  });

  it("honours cancelled instances (EXDATE)", () => {
    // 2026-06-19 is an EXDATE of the 09:00 weekly training.
    const from = new Date(2026, 5, 19, 0, 0, 0);
    const blocks = parseBusyBlocks([CLASSES], { from, days: 1 });
    expect(blocks.some((b) => b.start === 9 * 60)).toBe(false);
  });

  it("reads several feeds at once", () => {
    const from = new Date(2026, 8, 19, 0, 0, 0);
    const blocks = parseBusyBlocks([CLASSES, BUSINESS], { from, days: 1 });
    // business.ics has a UTC block on 2026-09-19 16:30Z.
    expect(blocks.length).toBeGreaterThan(0);
  });

  it("returns nothing for an empty or broken feed", () => {
    expect(parseBusyBlocks([""], { from: THURSDAY, days: 7 })).toEqual([]);
    expect(
      parseBusyBlocks(["BEGIN:VEVENT\nSUMMARY:x\nEND:VEVENT"], {
        from: THURSDAY,
        days: 7,
      }),
    ).toEqual([]);
  });
});

describe("mergeBusy", () => {
  it("joins overlapping and touching blocks of the same day", () => {
    expect(
      mergeBusy([
        { day: "2026-09-24", start: 540, end: 600 },
        { day: "2026-09-24", start: 590, end: 660 },
        { day: "2026-09-24", start: 660, end: 700 },
        { day: "2026-09-25", start: 540, end: 600 },
      ]),
    ).toEqual([
      { day: "2026-09-24", start: 540, end: 700 },
      { day: "2026-09-25", start: 540, end: 600 },
    ]);
  });

  it("leaves a gap alone", () => {
    const blocks = [
      { day: "2026-09-24", start: 540, end: 600 },
      { day: "2026-09-24", start: 700, end: 760 },
    ];
    expect(mergeBusy(blocks)).toHaveLength(2);
  });
});

describe("formatClock", () => {
  it("writes the hour the way a person says it", () => {
    expect(formatClock(0)).toBe("12:00 am");
    expect(formatClock(540)).toBe("9:00 am");
    expect(formatClock(725)).toBe("12:05 pm");
    expect(formatClock(1095)).toBe("6:15 pm");
  });
});
