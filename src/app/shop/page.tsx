import type { Metadata } from "next";
import { getListed, toCard } from "@/lib/catalogue/catalogue";
import { catalogueConnected } from "@/lib/catalogue/client";
import { CategoryView } from "@/components/sites/titanfloors/catalogue/category-view";
import { SiteShell } from "@/components/sites/titanfloors/sections";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "All Flooring | Titan Flooring, Mississauga",
  description: "Hardwood, laminate, vinyl, tile and accessories at Titan Flooring, 1060 Britannia Rd E, Mississauga.",
  alternates: { canonical: "/shop/" },
};

export default async function ShopPage() {
  const { rows, slugs } = await getListed();
  return (
    <SiteShell>
      <CategoryView
        title="All Products"
        crumb="All Products"
        intro={null}
        products={rows.map((r) => toCard(r, slugs.get(r.sku) as string))}
        connected={catalogueConnected()}
      />
    </SiteShell>
  );
}
