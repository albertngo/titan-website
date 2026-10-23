"use client";

import { useSyncExternalStore } from "react";
import { HeartIcon } from "./icons";

// The live site's flow: pick flooring, add it to a wish-list, send it to Titan for a quote.
// The list lives in this browser only; nothing is sent until the visitor asks for a quote.

export type WishItem = { slug: string; name: string; sku: string };

const KEY = "tf-wishlist";
const EMPTY: WishItem[] = [];
const listeners = new Set<() => void>();
let cache: { raw: string | null; items: WishItem[] } = { raw: null, items: EMPTY };

function read(): WishItem[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    return EMPTY;
  }
  if (raw === cache.raw) return cache.items;
  let items: WishItem[] = EMPTY;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) items = parsed.filter((x): x is WishItem => typeof x?.slug === "string" && typeof x?.name === "string");
  } catch {
    items = EMPTY;
  }
  cache = { raw, items };
  return items;
}

function write(items: WishItem[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // Private mode or storage blocked: the list just doesn't persist.
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => e.key === KEY && cb();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useWishlist(): WishItem[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function removeFromWishlist(slug: string) {
  write(read().filter((i) => i.slug !== slug));
}

export function clearWishlist() {
  write([]);
}

export function WishlistButton({ item, compact = false }: { item: WishItem; compact?: boolean }) {
  const items = useWishlist();
  const saved = items.some((i) => i.slug === item.slug);
  return (
    <button
      type="button"
      className={`wish-btn${saved ? " saved" : ""}${compact ? " compact" : ""}`}
      aria-pressed={saved}
      onClick={(e) => {
        e.preventDefault();
        write(saved ? read().filter((i) => i.slug !== item.slug) : [...read(), item]);
      }}
    >
      <HeartIcon size={compact ? 18 : 20} />
      {saved ? "Saved" : "Add to wishlist"}
    </button>
  );
}
