import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";
import robots from "./robots";
import { GONGFU } from "@/content/gongfu";
import { SITE } from "@/content/site";

describe("search files", () => {
  it("lists the home page and the gongfu page, and nothing private", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toEqual([SITE.seo.url, `${SITE.seo.url}${GONGFU.path}`]);
  });

  it("points robots.txt at the sitemap and keeps /inner-room out", () => {
    const file = robots();
    expect(file.sitemap).toBe(`${SITE.seo.url}/sitemap.xml`);
    expect(JSON.stringify(file.rules)).toContain("/inner-room");
  });

  it("shows no price on the gongfu page copy (only SITE.gathering, added in the page)", () => {
    expect(JSON.stringify(GONGFU)).not.toMatch(/\$\s?\d/);
  });
});
