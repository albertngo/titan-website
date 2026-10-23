"use client";

import Link from "next/link";
import { contact } from "../site-data";
import { clearWishlist, removeFromWishlist, useWishlist } from "../wishlist";

export function WishlistView() {
  const items = useWishlist();
  const body = [
    "Hi Titan Flooring,",
    "",
    "I'd like a quote for these floors:",
    ...items.map((i) => `- ${i.name}${i.sku ? ` (item ${i.sku})` : ""}`),
    "",
    "Square footage: ",
    "City: ",
    "Installation needed? ",
    "",
    "Thanks!",
  ].join("\n");
  const quoteHref = `mailto:${contact.email}?subject=${encodeURIComponent("Quote request from my wishlist")}&body=${encodeURIComponent(body)}`;

  return (
    <section className="wish boxed">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link> / <span>Wishlist</span>
      </nav>
      <h1 className="display cat-title">Your Wishlist</h1>
      {items.length === 0 ? (
        <div className="cat-empty">
          <p className="serif">Your wishlist is empty.</p>
          <p>
            Tap <b>Add to wishlist</b> on any floor you like, then send us the list for a quote. <Link href="/shop/">Browse all flooring</Link>.
          </p>
        </div>
      ) : (
        <>
          <p className="cat-intro">Send us your list and we&apos;ll get back to you with the best rates and availability.</p>
          <ul className="wish-list">
            {items.map((i) => (
              <li key={i.slug}>
                <Link href={`/product/${i.slug}/`} className="serif">
                  {i.name}
                </Link>
                <button type="button" onClick={() => removeFromWishlist(i.slug)}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="pp-actions">
            <a className="btn" href={quoteHref}>
              Request a quote
            </a>
            <button type="button" className="wish-clear" onClick={clearWishlist}>
              Clear list
            </button>
          </div>
          <p className="wish-note">
            Prefer to talk? Call <a href={contact.phoneHref}>{contact.phoneDisplay}</a> or visit us at {contact.addressShort}, Mississauga.
          </p>
        </>
      )}
    </section>
  );
}
