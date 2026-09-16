import type { MetadataRoute } from "next"
import { designs } from "@/lib/data/designs"

const base = process.env.NEXT_PUBLIC_APP_URL || "https://decore.et"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/flowers",
    "/designs",
    "/decorations",
    "/custom-design",
    "/booking",
    "/about",
    "/contact",
    "/faq",
    "/cart",
    "/login",
    "/register",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }))

  const designPages = designs.map((d) => ({
    url: `${base}/designs/${d.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...designPages]
}
