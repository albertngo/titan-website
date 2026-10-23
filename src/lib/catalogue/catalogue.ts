import { getBySku, listListed } from "./client";
import type { CardProduct, ImageVariant, PublicProduct } from "./types";

// ---------- Names ----------
// Catalogue naming rule: "Line — Colour (grade)" for flooring, "Series — Colour — Size (finish)"
// for tile. Same split as titan-desk web/src/lib/card.ts, so both apps read names alike.

const DASH = " — ";
const TRAILING_PAREN = /^(.*\S)\s*\(([^()]*)\)\s*$/;

export type SplitName = { line: string | null; colour: string; badge: string | null; detail: string | null };

export function splitName(name: string | null, brand: string | null): SplitName {
  const full = (name ?? "").trim();
  const parts = full.split(DASH).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return { line: null, colour: full || "Flooring", badge: null, detail: null };
  let line = parts[0];
  if (brand && !line.toLowerCase().includes(brand.toLowerCase())) line = `${brand} ${line}`;
  let colour = parts[1];
  let badge: string | null = null;
  const m = TRAILING_PAREN.exec(colour);
  if (m) {
    colour = m[1];
    badge = m[2];
  }
  return { line, colour, badge, detail: parts.length > 2 ? parts.slice(2).join(DASH) : null };
}

export function displayName(p: Pick<PublicProduct, "product_name" | "brand">): string {
  const n = splitName(p.product_name, p.brand);
  return [n.line, [n.colour, n.badge && `(${n.badge})`].filter(Boolean).join(" "), n.detail].filter(Boolean).join(DASH);
}

export function collectionLine(name: string | null): string | null {
  if (!name || !name.includes(DASH)) return null;
  const line = name.split(DASH)[0].trim();
  return line || null;
}

// ---------- Addresses ----------
// /product/<slug>/ like the live site. Built from the name, never the internal SKU (vault
// 2026-09-29: no shopper searches it). Collisions get -2, -3 in SKU order.

function slugify(s: string): string {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/(\d)\.(\d)/g, "$1-$2")
    .replace(/["″”]/g, "in")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90)
    .replace(/-+$/g, "");
}

function assignSlugs<T extends Pick<PublicProduct, "sku" | "product_name" | "brand">>(rows: T[]): Map<string, string> {
  const bySku = new Map<string, string>();
  const used = new Map<string, number>();
  for (const r of [...rows].sort((a, b) => a.sku.localeCompare(b.sku))) {
    const base = slugify(displayName(r)) || "flooring";
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    bySku.set(r.sku, n === 1 ? base : `${base}-${n}`);
  }
  return bySku;
}

// ---------- Categories ----------

export type CategoryKey = "solid-hardwood" | "engineered-hardwood" | "laminate" | "vinyl" | "tile" | "accessories";

export const CATEGORY_DEFS: { key: CategoryKey; label: string; crumb: string; match: (p: Pick<PublicProduct, "category" | "product_type">) => boolean }[] = [
  { key: "solid-hardwood", label: "Solid Hardwood", crumb: "Solid Hardwood", match: (p) => isFlooring(p) && p.category === "Solid hardwood" },
  { key: "engineered-hardwood", label: "Engineered Hardwood", crumb: "Engineered Hardwood", match: (p) => isFlooring(p) && p.category === "Engineered hardwood" },
  { key: "laminate", label: "Laminate", crumb: "Laminate", match: (p) => isFlooring(p) && p.category === "Laminate" },
  { key: "vinyl", label: "Vinyl", crumb: "Vinyl", match: (p) => isFlooring(p) && (p.category === "LVP" || p.category === "LVT") },
  { key: "tile", label: "Tile", crumb: "Tile", match: (p) => p.category === "Tile / Stone" || p.category === "STONE" },
  { key: "accessories", label: "Accessories", crumb: "Accessories", match: (p) => !isFlooring(p) && p.category !== "Tile / Stone" && p.category !== "STONE" },
];

function isFlooring(p: Pick<PublicProduct, "product_type">): boolean {
  return !p.product_type || p.product_type === "Flooring";
}

export function categoryOf(p: Pick<PublicProduct, "category" | "product_type">) {
  return CATEGORY_DEFS.find((c) => c.match(p)) ?? null;
}

// ---------- Display helpers ----------

export { formatMoney, unitLabel } from "./format";

function inches(n: number | null): string | null {
  if (n == null) return null;
  return `${Number.isInteger(n) ? n : n.toFixed(2).replace(/0+$/, "")}-inch`;
}

const KIND_WORDS: Record<ImageVariant["kind"], string> = { swatch: "swatch", room: "installed in a room", detail: "close-up" };

/** Alt text per bert-airtable-schema "Product images": the product's own fields, as words. */
export function altText(p: PublicProduct, kind: ImageVariant["kind"]): string {
  const n = splitName(p.product_name, p.brand);
  const head = [n.line, n.colour].filter(Boolean).join(" ");
  const facts = [p.category && p.category.toLowerCase().replace("lvp", "luxury vinyl plank").replace("lvt", "luxury vinyl tile"), inches(p.width_in), p.species, p.grade && `${p.grade} grade`]
    .filter(Boolean)
    .join(", ");
  return `${head}${facts ? `, ${facts}` : ""} — ${KIND_WORDS[kind]}`;
}

// ---------- Data access ----------

const CARD_COLUMNS = [
  "sku", "product_name", "brand", "category", "product_type", "colour_tone", "width_in", "thickness_mm", "finish_type",
  "install_profile", "species", "grade", "undertone", "texture", "style", "waterproof", "pet_friendly", "radiant_heat_compatible",
  "retail_price", "price_on_request", "price_unit", "promo_active", "stock_status", "coming_soon", "hero",
].join(",");

export type Listed = { rows: PublicProduct[]; slugs: Map<string, string>; skuBySlug: Map<string, string> };

export async function getListed(): Promise<Listed> {
  const rows = await listListed(CARD_COLUMNS);
  const slugs = assignSlugs(rows);
  const skuBySlug = new Map([...slugs].map(([sku, slug]) => [slug, sku]));
  return { rows, slugs, skuBySlug };
}

export function toCard(p: PublicProduct, slug: string): CardProduct {
  const n = splitName(p.product_name, p.brand);
  const img = p.hero?.card ?? p.hero?.full ?? null;
  return {
    slug,
    sku: p.sku,
    name: displayName(p),
    line: n.line,
    colour: n.colour,
    badge: n.badge,
    category: p.category,
    image: img ? { src: img, alt: altText(p, p.hero?.kind ?? "swatch"), blurhash: p.hero?.blurhash ?? null } : null,
    price: p.price_on_request ? null : p.retail_price,
    priceUnit: p.price_unit,
    priceOnRequest: p.price_on_request || p.retail_price == null,
    promo: p.promo_active,
    stock: p.stock_status,
    comingSoon: p.coming_soon,
    facets: {
      type: categoryOf(p)?.label ?? null,
      tone: p.colour_tone,
      width: p.width_in,
      thickness: p.thickness_mm,
      finish: p.finish_type,
      install: p.install_profile,
      species: p.species,
      undertone: p.undertone,
      texture: p.texture,
      style: p.style ?? [],
      waterproof: p.waterproof,
      pet: p.pet_friendly,
      radiant: p.radiant_heat_compatible,
    },
  };
}

export async function getCategory(key: CategoryKey): Promise<CardProduct[]> {
  const def = CATEGORY_DEFS.find((c) => c.key === key);
  if (!def) return [];
  const { rows, slugs } = await getListed();
  return rows.filter(def.match).map((r) => toCard(r, slugs.get(r.sku) as string));
}

export type ProductPage = {
  product: PublicProduct;
  slug: string;
  related: CardProduct[];
  slugBySku: Map<string, string>;
};

const RELATED_LIMIT = 5;

export async function getProductPage(slug: string): Promise<ProductPage | null> {
  const listed = await getListed();
  const sku = listed.skuBySlug.get(slug);
  if (!sku) return null;
  const product = await getBySku(sku);
  if (!product) return null;
  const line = collectionLine(product.product_name);
  const cat = categoryOf(product);
  const sameLine = listed.rows.filter((r) => r.sku !== sku && line && collectionLine(r.product_name) === line && r.brand === product.brand);
  const sameCat = listed.rows.filter((r) => r.sku !== sku && cat?.match(r) && !sameLine.includes(r));
  const related = [...sameLine, ...sameCat].slice(0, RELATED_LIMIT).map((r) => toCard(r, listed.slugs.get(r.sku) as string));
  return { product, slug, related, slugBySku: listed.slugs };
}
