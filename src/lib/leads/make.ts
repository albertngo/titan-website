import { makePayload } from "./ghl";
import type { CleanLead } from "./validate";

// The ONLY file in this repo that sends anything to Make, and the only reader of LEAD_MAKE_HOOK
// and LEAD_MAKE_KEY (server-only env vars; never NEXT_PUBLIC_). Imported only by
// src/app/api/lead/route.ts.
//
// Switched off until both are set, and they are set only after the scenario is switched on:
// a request to a scenario that is off waits in Make's queue and runs later.

export const leadsConfigured = () => Boolean(process.env.LEAD_MAKE_HOOK && process.env.LEAD_MAKE_KEY);

const GHL_ID = /^[A-Za-z0-9]{6,40}$/;

/** Resolves with GHL's contact id. Throws unless Make confirms every GHL step. */
export async function sendLead(lead: CleanLead): Promise<string> {
  const url = process.env.LEAD_MAKE_HOOK;
  const key = process.env.LEAD_MAKE_KEY;
  if (!url || !key) throw new Error("Lead forms aren't switched on for this deployment.");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, ...makePayload(lead) }),
    cache: "no-store",
    signal: AbortSignal.timeout(30_000),
  });
  const body = await res.text().catch(() => "");
  let d: Record<string, unknown> = {};
  try {
    d = JSON.parse(body) as Record<string, unknown>;
  } catch {
    // "Accepted" (scenario off, or the key didn't match) or an error page: not a confirmation.
  }
  const contactId = typeof d.contactId === "string" ? d.contactId : "";
  if (!res.ok || d.ok !== true || !GHL_ID.test(contactId)) {
    throw new Error(`Make didn't confirm the lead (${res.status}: ${body.slice(0, 120)})`);
  }
  return contactId;
}
