import { NEXT_STEPS, type LeadInput, type LeadItem, type LeadKind, type Utm } from "./types";

// Turns whatever arrived at /api/lead into a clean lead, or says what is wrong in words a
// visitor can act on. Pure: no network, no env, so it can be tested on its own.

const KINDS: readonly LeadKind[] = ["contact", "wishlist", "product"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type CleanLead = Omit<LeadInput, "website" | "elapsedMs"> & { phone: string; email: string; message: string };

const str = (v: unknown, max: number): string => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const text = (v: unknown, max: number): string => (typeof v === "string" ? v.replace(/\r\n?/g, "\n").trim().slice(0, max) : "");

/** Ten-digit North American numbers become +1XXXXXXXXXX; anything else keeps its digits and a leading +. */
export function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length >= 7 && digits.length <= 15) return raw.trim().startsWith("+") ? `+${digits}` : digits;
  return "";
}

function items(v: unknown): LeadItem[] {
  if (!Array.isArray(v)) return [];
  return v.slice(0, 50).flatMap((i): LeadItem[] => {
    if (!i || typeof i !== "object") return [];
    const o = i as Record<string, unknown>;
    const name = str(o.name, 200);
    if (!name) return [];
    const sku = str(o.sku, 60);
    const slug = str(o.slug, 200);
    return [{ name, ...(sku ? { sku } : {}), ...(/^[a-z0-9-]+$/.test(slug) ? { slug } : {}) }];
  });
}

function utm(v: unknown): Utm {
  if (!v || typeof v !== "object") return {};
  const o = v as Record<string, unknown>;
  const out: Utm = {};
  for (const k of ["source", "medium", "campaign"] as const) {
    const s = str(o[k], 200);
    if (s) out[k] = s;
  }
  return out;
}

/** Bots fill the hidden field or submit faster than a person can type. They get a quiet "thanks". */
export function looksLikeBot(body: Record<string, unknown>): boolean {
  if (typeof body.website === "string" && body.website.trim() !== "") return true;
  const elapsed = typeof body.elapsedMs === "number" ? body.elapsedMs : 0;
  return elapsed < 1200;
}

export function validateLead(body: Record<string, unknown>): { lead: CleanLead } | { error: string } {
  const kind = KINDS.find((k) => k === body.kind);
  if (!kind) return { error: "Something went wrong with this form. Please call or email us instead." };
  const name = str(body.name, 100);
  if (!name) return { error: "Please tell us your name." };
  const rawPhone = str(body.phone, 40);
  const phone = rawPhone ? normalisePhone(rawPhone) : "";
  if (rawPhone && !phone) return { error: "That phone number doesn't look right." };
  const email = str(body.email, 200).toLowerCase();
  if (email && !EMAIL.test(email)) return { error: "That email address doesn't look right." };
  if (!phone && !email) return { error: "Please leave a phone number or an email so we can reply." };
  const page = str(body.page, 300);

  const lead: CleanLead = {
    kind,
    name,
    phone,
    email,
    message: text(body.message, 4000),
    page: page.startsWith("/") ? page : "/",
    utm: utm(body.utm),
  };

  if (kind === "wishlist" || kind === "product") {
    lead.items = items(body.items);
    if (lead.items.length === 0) return { error: "Your list is empty. Add a floor first." };
  }
  if (kind === "wishlist") {
    const sf = str(body.squareFeet, 40);
    if (!sf) return { error: "Please tell us roughly how many square feet you need." };
    lead.squareFeet = sf;
    const step = NEXT_STEPS.find((s) => s === body.nextStep);
    if (!step) return { error: "Please choose a next step." };
    lead.nextStep = step;
    if (body.specialsAccepted !== true) return { error: "Please tick the box about Monthly Specials and Clearance prices." };
    lead.specialsAccepted = true;
  } else if (kind === "product") {
    const sf = str(body.squareFeet, 40);
    if (sf) lead.squareFeet = sf;
  }
  return { lead };
}
