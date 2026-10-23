import Link from "next/link";
import type { CardProduct } from "@/lib/catalogue/types";
import { contact } from "../site-data";
import { HowItWorks, InstallBanner, Reviews } from "../sections";
import { Faq } from "./faq";
import { ProductGrid } from "./product-grid";

type Props = {
  title: string;
  crumb: string;
  intro: string | null;
  products: CardProduct[];
  connected: boolean;
  faq?: { title: string | null; sub: string | null; items: { q: string; a: string }[] };
};

export function CategoryView({ title, crumb, intro, products, connected, faq }: Props) {
  return (
    <>
      <section className="cat-page boxed">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / <span>{crumb}</span>
        </nav>
        <h1 className="display cat-title">{title}</h1>
        {intro && <p className="cat-intro">{intro}</p>}
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <div className="cat-empty">
            <p className="serif">{connected ? "New photos are on the way for this collection." : "Our online catalogue is being updated."}</p>
            <p>
              Visit the showroom, call <a href={contact.phoneHref}>{contact.phoneDisplay}</a> or email{" "}
              <a href={`mailto:${contact.email}`}>{contact.email}</a> and we&apos;ll walk you through every option in store.
            </p>
          </div>
        )}
      </section>
      {faq?.title && faq.items.length > 0 && <Faq title={faq.title} sub={faq.sub} items={faq.items} />}
      <InstallBanner />
      <HowItWorks />
      <Reviews />
    </>
  );
}
