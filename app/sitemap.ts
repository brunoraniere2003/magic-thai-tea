import type { MetadataRoute } from "next";
import { SITE } from "@/content/site";
import { GONGFU } from "@/content/gongfu";

/** Public pages only: /inner-room and /dev stay out of search. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE.seo.url, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.seo.url}${GONGFU.path}`, changeFrequency: "monthly", priority: 0.8 },
  ];
}
