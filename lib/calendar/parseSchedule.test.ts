import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  parseWeeklyClasses,
  isPublicClass,
  safePlace,
  formatDays,
} from "./parseSchedule";

// A real capture of Ethan's public calendar (2026-09-20). It genuinely
// contains his private bookings, an errand and his home address, which is the
// whole reason this parser exists.
const ICS = readFileSync(
  join(process.cwd(), "lib/calendar/__fixtures__/classes.ics"),
  "utf8",
);

describe("isPublicClass", () => {
  it("publishes the class formats", () => {
    expect(isPublicClass("Tai Chi Training")).toBe(true);
    expect(isPublicClass("Song Gong Training")).toBe(true);
    expect(isPublicClass("Tai Chi Training + Cultivation")).toBe(true);
    expect(isPublicClass("Daily 10 Series Tai Chi (Online Class)")).toBe(true);
  });

  it("refuses anything private, named or personal", () => {
    expect(isPublicClass("Private training with Wayne")).toBe(false);
    expect(isPublicClass("Tai Chi with Wayne")).toBe(false);
    expect(isPublicClass("Handyman comes to fix the locks")).toBe(false);
    expect(isPublicClass("Upload photos and videos to Google Drive")).toBe(
      false,
    );
    expect(isPublicClass("Dentist appointment")).toBe(false);
  });

  it("drops anything it does not recognise, rather than guessing", () => {
    expect(isPublicClass("Coffee")).toBe(false);
    expect(isPublicClass("")).toBe(false);
  });
});

describe("safePlace", () => {
  it("never publishes a street address", () => {
    expect(safePlace("1583 27th Ave\\, San Francisco\\, CA 94122")).toBe(
      "In person",
    );
    expect(safePlace("742 Evergreen Terrace")).toBe("In person");
  });

  it("calls a meeting link what it is", () => {
    expect(safePlace("https://us06web.zoom.us/j/123")).toBe("Online");
  });

  it("keeps a named public venue", () => {
    expect(safePlace("Sunset Recreation Center, San Francisco")).toBe(
      "Sunset Recreation Center",
    );
  });

  it("says in person when there is nothing to say", () => {
    expect(safePlace(undefined)).toBe("In person");
    expect(safePlace("  ")).toBe("In person");
  });
});

describe("parseWeeklyClasses", () => {
  const sessions = parseWeeklyClasses(ICS);

  it("finds the five weekly classes", () => {
    expect(sessions.map((s) => s.title).sort()).toEqual([
      "Daily 10 Series Tai Chi (Online Class)",
      "Song Gong Training",
      "Tai Chi Meditation Walking",
      "Tai Chi Training",
      "Tai Chi Training + Cultivation",
    ]);
  });

  it("leaks no client name, errand or address", () => {
    const dump = JSON.stringify(sessions);
    expect(dump).not.toMatch(/Wayne/i);
    expect(dump).not.toMatch(/handyman|locks/i);
    expect(dump).not.toMatch(/27th Ave|\d{4} \w+ Ave/i);
    expect(dump).not.toMatch(/zoom\.us/i);
  });

  it("reads the weekly pattern and the hour", () => {
    const training = sessions.find((s) => s.title === "Tai Chi Training");
    expect(training?.days).toEqual(["MO", "WE", "FR"]);
    expect(training?.time).toBe("9:00 am");
    expect(training?.place).toBe("In person");

    const online = sessions.find((s) => s.title.startsWith("Daily 10"));
    expect(online?.days).toEqual(["TU", "TH"]);
    expect(online?.time).toBe("7:00 pm");
    // It says "(Online Class)" in the title and carries no link: still online.
    expect(online?.place).toBe("Online");

    const songGong = sessions.find((s) => s.title === "Song Gong Training");
    expect(songGong?.place).toBe("Online");
  });

  it("sorts by weekday, then by hour", () => {
    const order = sessions.map((s) => s.days[0]);
    expect(order).toEqual([...order].sort((a, b) => "MOTUWETHFRSASU".indexOf(a) - "MOTUWETHFRSASU".indexOf(b)));
  });

  it("ignores one-off events entirely", () => {
    // The fixture has five one-off "Tai Chi Training" dates; a single entry on
    // a shared calendar is as likely to be an errand as a class.
    expect(sessions.filter((s) => s.title === "Tai Chi Training")).toHaveLength(
      1,
    );
  });

  it("survives an empty or broken feed without throwing", () => {
    expect(parseWeeklyClasses("")).toEqual([]);
    expect(parseWeeklyClasses("BEGIN:VEVENT\nSUMMARY:Tai Chi\nEND:VEVENT")).toEqual([]);
  });
});

describe("formatDays", () => {
  it("writes the week the way a poster would", () => {
    expect(formatDays(["MO", "WE", "FR"])).toBe("Mon · Wed · Fri");
    expect(formatDays(["SU"])).toBe("Sun");
  });
});
