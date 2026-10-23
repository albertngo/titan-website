import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORY_DEFS, getCategory, type CategoryKey } from "@/lib/catalogue/catalogue";
import { catalogueConnected } from "@/lib/catalogue/client";
import { categoryCopy } from "@/components/sites/titanfloors/category-copy";
import { CategoryView } from "@/components/sites/titanfloors/catalogue/category-view";
import { SiteShell } from "@/components/sites/titanfloors/sections";

export const revalidate = 1800;
export const dynamicParams = false;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return CATEGORY_DEFS.map((c) => ({ slug: c.key }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const copy = categoryCopy[slug as CategoryKey];
  if (!copy) return {};
  return {
    title: `${copy.title.replace(/ Collections$/, "")} Flooring in Mississauga | Titan Flooring`,
    description: copy.intro ?? `Browse ${copy.title.toLowerCase()} at Titan Flooring, 1060 Britannia Rd E, Mississauga.`,
    alternates: { canonical: `/product-category/${slug}/` },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const def = CATEGORY_DEFS.find((c) => c.key === slug);
  if (!def) notFound();
  const copy = categoryCopy[def.key];
  const products = await getCategory(def.key);
  return (
    <SiteShell>
      <CategoryView
        title={copy.title}
        crumb={def.crumb}
        intro={copy.intro}
        products={products}
        connected={catalogueConnected()}
        faq={{ title: copy.faqTitle, sub: copy.faqSub, items: copy.faq }}
      />
    </SiteShell>
  );
}
