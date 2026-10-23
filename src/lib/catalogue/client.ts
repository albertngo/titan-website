import { readFile } from "node:fs/promises";
import type { PublicProduct } from "./types";

// Reads Titan Desk's public catalogue view over PostgREST with the anon key. The anon role can
// only see `api.catalogue_public` and the public search functions (titan-desk migration 001),
// so nothing staff-only can reach this site. Supabase Storage serves the images.

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// Local development and screenshots only; never set on Vercel.
const FIXTURE = process.env.CATALOGUE_FIXTURE;

/** Seconds a page may serve before re-reading; Titan Desk itself syncs every 30 minutes. */
export const REVALIDATE = 1800;
const PAGE = 1000;

export function catalogueConnected(): boolean {
  return Boolean(FIXTURE || (URL && KEY));
}

let fixtureRows: Promise<PublicProduct[]> | null = null;
function fixture(): Promise<PublicProduct[]> {
  fixtureRows ??= readFile(FIXTURE as string, "utf8").then((t) => JSON.parse(t) as PublicProduct[]);
  return fixtureRows;
}

async function rest<T>(path: string): Promise<T> {
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    headers: {
      apikey: KEY as string,
      "Accept-Profile": "api",
      // Legacy anon keys are JWTs and go in Authorization too; the newer sb_publishable_ keys
      // are not JWTs and must only be sent as `apikey`.
      ...(KEY?.startsWith("eyJ") ? { Authorization: `Bearer ${KEY}` } : {}),
    },
    next: { revalidate: REVALIDATE, tags: ["catalogue"] },
  });
  // Throwing keeps the last good page on a failed revalidation instead of publishing an empty one.
  if (!res.ok) throw new Error(`Catalogue read failed: ${res.status} ${await res.text()}`);
  return (await res.json()) as T;
}

/** Every public product that has a photo: the launch rule (Albert, 2026-10-23). */
export async function listListed(columns: string): Promise<PublicProduct[]> {
  if (!catalogueConnected()) return [];
  if (FIXTURE) return (await fixture()).filter((r) => r.hero);
  const rows: PublicProduct[] = [];
  for (let off = 0; ; off += PAGE) {
    const page = await rest<PublicProduct[]>(
      `catalogue_public?select=${columns}&hero=not.is.null&order=product_name.asc,sku.asc&limit=${PAGE}&offset=${off}`,
    );
    rows.push(...page);
    if (page.length < PAGE) return rows;
  }
}

export async function getBySku(sku: string): Promise<PublicProduct | null> {
  if (!catalogueConnected()) return null;
  if (FIXTURE) return (await fixture()).find((r) => r.sku === sku && r.hero) ?? null;
  const rows = await rest<PublicProduct[]>(`catalogue_public?select=*&sku=eq.${encodeURIComponent(sku)}&hero=not.is.null&limit=1`);
  return rows[0] ?? null;
}
