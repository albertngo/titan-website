import type { NextRequest } from "next/server";
import { leadsConfigured, sendLead } from "@/lib/leads/make";
import type { LeadResult } from "@/lib/leads/types";
import { looksLikeBot, validateLead } from "@/lib/leads/validate";

// Every website form posts here. The visitor sees "sent" only when Make confirms GHL has the lead.

const FALLBACK = "We couldn't send your message just now. Please call 905-282-1881 or email info@titanfloors.ca.";

// Best effort: each server instance remembers the last few minutes of submissions per address.
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function tooMany(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) recent.clear();
  return hits.length > MAX_PER_WINDOW;
}

const reply = (r: LeadResult, status = 200) => Response.json(r, { status });

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) return reply({ ok: false, error: FALLBACK }, 403);

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: FALLBACK }, 400);
  }

  if (looksLikeBot(body)) return reply({ ok: true });

  const checked = validateLead(body);
  if ("error" in checked) return reply({ ok: false, error: checked.error }, 422);

  // Counted after validation, so a visitor fixing a typo isn't locked out.
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(ip)) return reply({ ok: false, error: "You've sent a few messages already. Please call us at 905-282-1881." }, 429);

  if (!leadsConfigured()) return reply({ ok: false, error: FALLBACK }, 503);
  try {
    await sendLead(checked.lead);
    return reply({ ok: true });
  } catch (e) {
    console.error("lead not delivered", e instanceof Error ? e.message : e);
    return reply({ ok: false, error: FALLBACK }, 502);
  }
}

/** Setup check: says whether this deployment can see each Make setting (never their values). */
export function GET() {
  return Response.json({ hook: Boolean(process.env.LEAD_MAKE_HOOK), key: Boolean(process.env.LEAD_MAKE_KEY), env: process.env.VERCEL_ENV ?? null });
}
