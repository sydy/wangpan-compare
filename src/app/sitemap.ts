import type { MetadataRoute } from "next";
import { DRIVES } from "@/data/drives";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/compare", "/scenarios"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const driveRoutes = DRIVES.map((d) => ({
    url: `${BASE}/drive/${d.id}`,
    lastModified: new Date(d.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...driveRoutes];
}
