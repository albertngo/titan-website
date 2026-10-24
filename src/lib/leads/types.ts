// What a website form sends to /api/lead. Shared by the forms (client) and the route (server).

export type LeadKind = "contact" | "wishlist" | "product";

/** The live wishlist form's "Next Steps" choices, word for word (titanfloors.ca/wishlist/, 2026-10-24). */
export const NEXT_STEPS = [
  "If stock is currently available or expected in the near future, I am ready to make a 10% deposit payment to reserve the requested amount of flooring. I realize that material will be held maximum for 45 days. Please email me Sales Order.",
  "If stock is currently available, I am ready to make a payment for the requested flooring material. Please email me an invoice. Flooring requested within 2-10 days.",
  "Please call me to discuss the best possible price of the requested flooring material and availability.",
  "Please send me price and availability.",
] as const;

export type LeadItem = { name: string; sku?: string; slug?: string };

export type Utm = { source?: string; medium?: string; campaign?: string };

export type LeadInput = {
  kind: LeadKind;
  name: string;
  phone?: string;
  email?: string;
  message?: string;
  /** Path of the page the form was on, e.g. "/wishlist/". */
  page: string;
  items?: LeadItem[];
  squareFeet?: string;
  nextStep?: string;
  specialsAccepted?: boolean;
  utm?: Utm;
  /** Honeypot: a field people never see. Anything in it means a bot. */
  website?: string;
  /** Milliseconds the form was open before it was sent. */
  elapsedMs?: number;
};

export type LeadResult = { ok: true } | { ok: false; error: string };
