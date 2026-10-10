import type { MetadataRoute } from "next";
import { nav, SITE_URL } from "@/data/site";
import { teas } from "@/data/teas";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["/", ...nav.map((item) => item.href), ...teas.map((tea) => `/teas/${tea.slug}`)];
  return paths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
