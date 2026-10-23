import Image from "next/image";
import Link from "next/link";
import { formatMoney, unitLabel } from "@/lib/catalogue/format";
import type { CardProduct } from "@/lib/catalogue/types";
import { WishlistButton } from "../wishlist";

export function statusBadges(p: Pick<CardProduct, "promo" | "stock" | "comingSoon">): string[] {
  const out: string[] = [];
  if (p.promo) out.push("On sale");
  if (p.comingSoon) out.push("Coming soon");
  if (p.stock === "Clearance") out.push("Clearance");
  else if (p.stock === "Special order") out.push("Special order");
  else if (p.stock === "Low stock") out.push("Low stock");
  return out;
}

export function PriceTag({ price, unit, onRequest, large = false }: { price: number | null; unit: "sf" | "piece"; onRequest: boolean; large?: boolean }) {
  if (onRequest || price == null) return <p className={large ? "pp-price" : "pcard-price"}>Price on request</p>;
  return (
    <p className={large ? "pp-price" : "pcard-price"}>
      <b>{formatMoney(price)}</b>
      <span>/ {unitLabel(unit)}</span>
    </p>
  );
}

export function ProductCard({ p }: { p: CardProduct }) {
  const badges = statusBadges(p);
  return (
    <article className="pcard">
      <Link href={`/product/${p.slug}/`} className="pcard-link">
        <div className="pcard-img">
          {p.image && <Image src={p.image.src} alt={p.image.alt} fill sizes="(max-width: 767px) 50vw, 220px" unoptimized />}
          {badges.length > 0 && (
            <ul className="pcard-badges">
              {badges.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="pcard-body">
          <h3 className="pcard-name">{p.name}</h3>
          <PriceTag price={p.price} unit={p.priceUnit} onRequest={p.priceOnRequest} />
        </div>
      </Link>
      <div className="pcard-foot">
        <WishlistButton item={{ slug: p.slug, name: p.name, sku: p.sku }} compact />
      </div>
    </article>
  );
}
