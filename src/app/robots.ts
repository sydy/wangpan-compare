import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const BASE = getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE}/sitemap.xml`,
  };
}
