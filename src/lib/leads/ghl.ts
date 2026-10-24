import type { CleanLead } from "./validate";

// Builds the three GHL request bodies the Make scenario "Website → GHL (titan-website forms)"
// (4997514) sends with Make's own GHL connection: upsert the contact, add tags, add a note.
// The site never holds a GHL token. Ids, not secrets (same values as titan-desk quote/src/lib/ghl/ids.ts
// and the content engine's UTM field ids).

const SITE = "https://titanfloors.ca";
export const GHL_LOCATION_ID = "4BwjVRlyDCR4ZRdcSrFR";

/** Contact custom fields for first-touch UTM. */
const UTM_FIELDS = {
  campaign: "BOUMRUjWjZ69sYv9cOyv",
  source: "k4fFeKkVGkSKNIDfVjRI",
  medium: "i08d5Zu8o5dUhgHQLkU4",
} as const;

const FORM_LABEL = { contact: "Contact form", wishlist: "Wishlist quote request", product: "Product price & availability" } as const;

/** `website` is the tag the old Outlook → GHL scenario (4696767) set, so GHL workflows keyed on it keep firing. */
export const leadTags = (lead: CleanLead) => ["website", `website-${lead.kind}`];

function splitName(name: string): { firstName: string; lastName?: string } {
  const [first, ...rest] = name.split(" ");
  return rest.length ? { firstName: first, lastName: rest.join(" ") } : { firstName: first };
}

export function contactBody(lead: CleanLead): Record<string, unknown> {
  const customFields = (Object.keys(UTM_FIELDS) as (keyof typeof UTM_FIELDS)[])
    .filter((k) => lead.utm?.[k])
    .map((k) => ({ id: UTM_FIELDS[k], field_value: lead.utm?.[k] }));
  return {
    locationId: GHL_LOCATION_ID,
    ...splitName(lead.name),
    ...(lead.email ? { email: lead.email } : {}),
    ...(lead.phone ? { phone: lead.phone } : {}),
    source: "website",
    ...(customFields.length ? { customFields } : {}),
  };
}

export function noteText(lead: CleanLead): string {
  const lines = [`Website Inquiry: ${lead.message || "(no message)"}`, "", `Form: ${FORM_LABEL[lead.kind]}`, `Page: ${SITE}${lead.page}`];
  if (lead.squareFeet) lines.push(`Square footage: ${lead.squareFeet}`);
  if (lead.nextStep) lines.push(`Next step: ${lead.nextStep}`);
  if (lead.specialsAccepted) lines.push("Understands Monthly Specials and Clearance prices are non-negotiable: yes");
  if (lead.items?.length) {
    lines.push("", lead.kind === "wishlist" ? "Wishlist:" : "Product:");
    for (const i of lead.items) lines.push(`- ${i.name}${i.sku ? ` (item ${i.sku})` : ""}${i.slug ? ` ${SITE}/product/${i.slug}/` : ""}`);
  }
  const u = lead.utm ?? {};
  if (u.source || u.medium || u.campaign) lines.push("", `First visit from: ${[u.source, u.medium, u.campaign].filter(Boolean).join(" / ")}`);
  lines.push("", `Name: ${lead.name}`, `Phone: ${lead.phone || "-"}`, `Email: ${lead.email || "-"}`);
  return lines.join("\n");
}

/** The webhook payload, minus the key. Each body is a JSON string Make passes to GHL unchanged. */
export function makePayload(lead: CleanLead) {
  return {
    kind: lead.kind,
    contactBody: JSON.stringify(contactBody(lead)),
    tagsBody: JSON.stringify({ tags: leadTags(lead) }),
    noteBody: JSON.stringify({ body: noteText(lead) }),
  };
}
