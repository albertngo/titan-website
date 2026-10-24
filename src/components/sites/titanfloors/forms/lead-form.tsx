"use client";

import { useRef, useState, type FormEvent } from "react";
import { NEXT_STEPS, type LeadInput, type LeadItem, type LeadKind, type LeadResult } from "@/lib/leads/types";
import { contact } from "../site-data";
import { readUtm } from "./utm";

// The one form behind every lead on the site: the footer card and contact page ("contact"),
// the wishlist quote request ("wishlist", the live form's fields) and a product's
// "Check price & availability" ("product"). It posts to /api/lead and says "sent" only when
// the server confirms GHL has it.

type Props = {
  kind: LeadKind;
  items?: LeadItem[];
  /** "card" is the navy footer card; "page" sits on the cream page background. */
  look?: "card" | "page";
  submitLabel?: string;
  onSent?: () => void;
};

type State = { status: "idle" | "sending" | "sent" } | { status: "error"; error: string };

export function LeadForm({ kind, items, look = "card", submitLabel = "Submit", onSent }: Props) {
  const [state, setState] = useState<State>({ status: "idle" });
  const opened = useRef<number | null>(null);
  const markOpened = () => {
    opened.current ??= Date.now();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "");
    const input: LeadInput = {
      kind,
      name: get("name"),
      phone: get("phone"),
      email: get("email"),
      message: get("message"),
      page: window.location.pathname,
      items,
      squareFeet: get("squareFeet") || undefined,
      nextStep: get("nextStep") || undefined,
      specialsAccepted: f.get("specials") === "on",
      utm: readUtm(),
      website: get("website"),
      elapsedMs: opened.current ? Date.now() - opened.current : 0,
    };
    setState({ status: "sending" });
    try {
      const res = await fetch("/api/lead/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const r = (await res.json()) as LeadResult;
      if (r.ok) {
        setState({ status: "sent" });
        onSent?.();
      } else setState({ status: "error", error: r.error });
    } catch {
      setState({ status: "error", error: `We couldn't send your message just now. Please call ${contact.phoneDisplay} or email ${contact.email}.` });
    }
  };

  if (state.status === "sent") {
    return (
      <div className={look === "card" ? "contact-form" : "lead-form"}>
        <p className="lead-sent full" role="status">
          Thanks! We&apos;ve got your message and will get back to you shortly. Need us sooner? Call{" "}
          <a href={contact.phoneHref}>{contact.phoneDisplay}</a>.
        </p>
      </div>
    );
  }

  const wishlist = kind === "wishlist";
  return (
    <form className={look === "card" ? "contact-form" : "lead-form"} onSubmit={onSubmit} onFocus={markOpened} onPointerDown={markOpened}>
      <input className="full" name="name" placeholder={wishlist ? "Your Name *" : "Name"} aria-label="Name" autoComplete="name" required />
      <input name="phone" type="tel" placeholder={wishlist ? "Phone Number *" : "Phone"} aria-label="Phone" autoComplete="tel" required={wishlist} />
      <input name="email" type="email" placeholder={wishlist ? "Email Address *" : "Email"} aria-label="Email" autoComplete="email" required={wishlist} />
      {kind !== "contact" && (
        <input
          className="full"
          name="squareFeet"
          inputMode="decimal"
          placeholder={wishlist ? "Square Footage *" : "Square footage (if you know it)"}
          aria-label="Square footage"
          required={wishlist}
        />
      )}
      {wishlist && (
        <fieldset className="full lead-steps">
          <legend>Next Steps:</legend>
          {NEXT_STEPS.map((s) => (
            <label key={s} className="lead-opt">
              <input type="radio" name="nextStep" value={s} required />
              <span>{s}</span>
            </label>
          ))}
        </fieldset>
      )}
      {wishlist && (
        <label className="full lead-opt">
          <input type="checkbox" name="specials" required />
          <span>I understand that Monthly Specials and Clearance Sales prices are non-negotiable.</span>
        </label>
      )}
      <textarea
        className="full"
        name="message"
        placeholder={wishlist ? "Comments" : "Message"}
        aria-label={wishlist ? "Additional information" : "Message"}
        rows={wishlist ? 3 : undefined}
      />
      {/* Hidden from people; bots fill it in. */}
      <input className="lead-hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="full" type="submit" disabled={state.status === "sending"}>
        {state.status === "sending" ? "Sending…" : submitLabel}
      </button>
      {state.status === "error" && (
        <p className="contact-note lead-error" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
