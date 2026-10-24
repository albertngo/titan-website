"use client";

import { useState } from "react";
import type { LeadItem } from "@/lib/leads/types";
import { LeadForm } from "./lead-form";

/** "Check price & availability" on a product page: opens the lead form in place. */
export function ProductInquiry({ item }: { item: LeadItem }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn pp-cta" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        Check price &amp; availability
      </button>
      {open && (
        <div className="pp-inquiry">
          <p className="serif">Tell us how to reach you and we&apos;ll confirm the price and stock for {item.name}.</p>
          <LeadForm kind="product" items={[item]} look="page" submitLabel="Send" />
        </div>
      )}
    </>
  );
}
