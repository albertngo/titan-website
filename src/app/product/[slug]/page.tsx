import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { altText, categoryOf, displayName, getProductPage, splitName, unitLabel } from "@/lib/catalogue/catalogue";
import type { PublicProduct } from "@/lib/catalogue/types";
import { Calculator } from "@/components/sites/titanfloors/catalogue/calculator";
import { Gallery, type GalleryImage } from "@/components/sites/titanfloors/catalogue/gallery";
import { PriceTag, ProductCard, statusBadges } from "@/components/sites/titanfloors/catalogue/product-card";
import { ProductInquiry } from "@/components/sites/titanfloors/forms/product-inquiry";
import { SiteShell } from "@/components/sites/titanfloors/sections";
import { contact } from "@/components/sites/titanfloors/site-data";
import { WishlistButton } from "@/components/sites/titanfloors/wishlist";

export const revalidate = 1800;
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

// Built on first visit, then cached and refreshed every 30 minutes like the catalogue itself.
export function generateStaticParams() {
  return [];
}

const SITE = "https://titanfloors.ca";

function num(n: number | null, unit: string): string | null {
  if (n == null) return null;
  return `${Number.isInteger(n) ? n : String(Math.round(n * 100) / 100)}${unit}`;
}
const yes = (b: boolean) => (b ? "Yes" : null);

function specRows(p: PublicProduct): [string, string][] {
  const rows: [string, string | null][] = [
    ["Brand", p.brand],
    ["Collection", p.collection],
    ["Type", p.category],
    ["Species", p.species],
    ["Grade", p.grade],
    ["Colour", p.colour_tone],
    ["Width", num(p.width_in, "″")],
    ["Length", p.length],
    ["Thickness", num(p.thickness_mm, " mm")],
    ["Wear layer", num(p.wear_layer_mil, " mil")],
    ["Veneer", num(p.veneer_mm, " mm")],
    ["Veneer cut", p.veneer_cut_type],
    ["Tile size", p.tile_format],
    ["Pattern", p.layout_pattern],
    ["Finish", p.finish_type],
    ["AC rating", p.ac_rating],
    ["Install method", [p.install_profile, p.install_method].filter(Boolean).join(" · ") || null],
    ["Locking system", p.locking_system],
    ["Underpad", p.underpad_included ? p.underpad_type ?? "Attached" : null],
    ["IIC / STC", p.iic_rating || p.stc_rating ? [p.iic_rating && `IIC ${p.iic_rating}`, p.stc_rating && `STC ${p.stc_rating}`].filter(Boolean).join(" · ") : null],
    ["Box", p.box_size_sf ? `${num(p.box_size_sf, " sq.ft")}${p.pieces_per_box ? ` · ${p.pieces_per_box} pieces` : ""}` : null],
    ["Weight per piece", num(p.weight_per_piece_kg, " kg")],
    ["Certifications", p.certifications?.length ? p.certifications.join(", ") : null],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

function featureRows(p: PublicProduct): [string, string][] {
  const rows: [string, string | null][] = [
    ["Waterproof", yes(p.waterproof)],
    ["Pet friendly", yes(p.pet_friendly)],
    ["Radiant heat compatible", yes(p.radiant_heat_compatible)],
    ["Traffic rating", p.traffic_rating],
    ["Suitable rooms", p.suitable_rooms?.length ? p.suitable_rooms.join(", ") : null],
    ["Residential warranty", p.residential_warranty_yrs ? `${p.residential_warranty_yrs} years` : null],
    ["Commercial warranty", p.commercial_warranty_yrs ? `${p.commercial_warranty_yrs} years` : null],
    ["Undertone", p.undertone],
    ["Tone", p.tone_depth ? ["", "Very light", "Light", "Medium", "Dark", "Very dark"][p.tone_depth] ?? null : null],
    ["Texture", p.texture],
    ["Style", p.style?.length ? p.style.join(", ") : null],
    ["Pattern variation", p.busyness],
  ];
  return rows.filter((r): r is [string, string] => Boolean(r[1]));
}

/** One factual sentence from the record's own fields; no marketing copy is invented. */
function summary(p: PublicProduct): string {
  const n = splitName(p.product_name, p.brand);
  const bits = [
    p.category?.toLowerCase().replace("lvp", "luxury vinyl plank").replace("lvt", "luxury vinyl tile"),
    num(p.width_in, "-inch") && `${num(p.width_in, "-inch")} wide`,
    p.species,
    p.finish_type && `${p.finish_type.toLowerCase()} finish`,
    p.waterproof && "waterproof",
  ].filter(Boolean);
  return `${[n.line, n.colour].filter(Boolean).join(" ")}${bits.length ? `: ${bits.join(", ")}` : ""}. Available at Titan Flooring, 1060 Britannia Rd E, Mississauga.`;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const page = await getProductPage(slug);
  if (!page) return {};
  const { product: p } = page;
  const img = p.hero?.full ?? p.hero?.card;
  return {
    title: `${displayName(p)} | Titan Flooring`,
    description: summary(p),
    alternates: { canonical: `/product/${slug}/` },
    openGraph: { title: displayName(p), description: summary(p), images: img ? [{ url: img }] : undefined },
  };
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const page = await getProductPage(slug);
  if (!page) notFound();
  const { product: p, related, slugBySku } = page;
  const name = displayName(p);
  const cat = categoryOf(p);
  const n = splitName(p.product_name, p.brand);
  const priceOnRequest = p.price_on_request || p.retail_price == null;
  const badges = statusBadges({ promo: p.promo_active, stock: p.stock_status, comingSoon: p.coming_soon });

  const images: GalleryImage[] = (p.images ?? [])
    .filter((im) => im.card || im.full)
    .map((im) => ({ src: (im.full ?? im.card) as string, full: (im.full ?? im.card) as string, thumb: (im.thumb ?? im.card ?? im.full) as string, alt: altText(p, im.kind) }));

  const variants = (p.variants ?? []).filter((v) => slugBySku.has(v.sku));
  const pairs = (p.pairs_well_with ?? []).filter((v) => slugBySku.has(v.sku));
  const pageUrl = `${SITE}/product/${slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    sku: p.sku,
    brand: p.brand ? { "@type": "Brand", name: p.brand } : undefined,
    color: n.colour,
    material: p.species ?? undefined,
    category: p.category ?? undefined,
    description: summary(p),
    image: images.map((i) => i.full),
    url: pageUrl,
    offers: priceOnRequest
      ? undefined
      : {
          "@type": "Offer",
          price: p.retail_price,
          priceCurrency: "CAD",
          url: pageUrl,
          availability: p.stock_status === "Special order" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: p.retail_price,
            priceCurrency: "CAD",
            unitCode: p.price_unit === "sf" ? "FTK" : "C62",
            unitText: unitLabel(p.price_unit),
          },
          seller: { "@type": "Organization", name: "Titan Flooring" },
        },
  };

  return (
    <SiteShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="pp boxed">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link href="/">Home</Link> / {cat ? <Link href={`/product-category/${cat.key}/`}>{cat.crumb}</Link> : "Products"} / <span>{name}</span>
        </nav>
        <div className="pp-grid">
          <Gallery images={images} />
          <div className="pp-info">
            <h1 className="display pp-title">{name}</h1>
            <div className="pp-price-row">
              <PriceTag price={p.retail_price} unit={p.price_unit} onRequest={priceOnRequest} large />
              {badges.map((b) => (
                <span key={b} className="pp-badge">
                  {b}
                </span>
              ))}
            </div>

            <details className="pp-acc" open>
              <summary>Specifications</summary>
              <dl className="pp-specs">
                {specRows(p).map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            </details>
            {featureRows(p).length > 0 && (
              <details className="pp-acc">
                <summary>Features &amp; style</summary>
                <dl className="pp-specs">
                  {featureRows(p).map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </details>
            )}

            {variants.length > 0 && (
              <div className="pp-variants">
                <p className="serif">Also available in</p>
                <ul>
                  {variants.map((v) => (
                    <li key={v.sku}>
                      <Link href={`/product/${slugBySku.get(v.sku)}/`}>{v.variant_label ?? v.grade ?? v.product_name}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!priceOnRequest && <Calculator price={p.retail_price} unit={p.price_unit} boxSf={p.box_size_sf} />}

            <hr className="pp-rule" />
            <div className="pp-actions">
              <ProductInquiry item={{ name, sku: p.sku, slug }} />
              <WishlistButton item={{ slug, name, sku: p.sku }} />
            </div>
            <a className="pp-contact" href={`mailto:${contact.email}`}>
              Email: {contact.email}
            </a>
            <a className="pp-contact" href={contact.phoneHref}>
              Phone: {contact.phoneDisplay}
            </a>
          </div>
        </div>

        {pairs.length > 0 && (
          <div className="pp-variants pp-pairs">
            <p className="serif">Pairs well with</p>
            <ul>
              {pairs.map((v) => (
                <li key={v.sku}>
                  <Link href={`/product/${slugBySku.get(v.sku)}/`}>{v.product_name}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="pp-related boxed">
          <h2 className="display">Related Products</h2>
          <div className="pgrid related">
            {related.map((r) => (
              <ProductCard key={r.slug} p={r} />
            ))}
          </div>
        </section>
      )}
    </SiteShell>
  );
}
