import type { MetadataRoute } from "next";
import { getAllPosts, postPath } from "@/lib/blog";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((p) => ({
    url: `${siteUrl}${postPath(p.slug)}`,
    lastModified: p.updatedDate ?? p.publishDate,
  }));
  return [{ url: `${siteUrl}/` }, { url: `${siteUrl}/blog/` }, ...posts];
}
