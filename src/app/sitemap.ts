import type { MetadataRoute } from "next";
import { CATEGORY_DEFS, getListed } from "@/lib/catalogue/catalogue";

export const revalidate = 1800;

const SITE = "https://titanfloors.ca";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { slugs } = await getListed();
  return [
    { url: `${SITE}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/shop/`, changeFrequency: "daily", priority: 0.8 },
    ...CATEGORY_DEFS.map((c) => ({ url: `${SITE}/product-category/${c.key}/`, changeFrequency: "daily" as const, priority: 0.8 })),
    ...[...slugs.values()].map((s) => ({ url: `${SITE}/product/${s}/`, changeFrequency: "weekly" as const, priority: 0.6 })),
  ];
}
