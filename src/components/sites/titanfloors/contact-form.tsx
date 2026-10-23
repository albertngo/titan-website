"use client";

import { useState, type FormEvent } from "react";
import { contact } from "./site-data";

// The live form posts to WordPress. This rebuild has no form backend yet (GHL embed is
// the planned replacement), so submitting opens the visitor's email app with the
// message filled in rather than pretending to send it.
export function ContactForm() {
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = [
      `Name: ${f.get("name") ?? ""}`,
      `Phone: ${f.get("phone") ?? ""}`,
      `Email: ${f.get("email") ?? ""}`,
      "",
      `${f.get("message") ?? ""}`,
    ].join("\n");
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent("Website inquiry")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <input className="full" name="name" placeholder="Name" aria-label="Name" required />
      <input name="phone" type="tel" placeholder="Phone" aria-label="Phone" />
      <input name="email" type="email" placeholder="Email" aria-label="Email" />
      <textarea className="full" name="message" placeholder="Message" aria-label="Message" />
      <button className="full" type="submit">
        Submit
      </button>
      {sent && (
        <p className="contact-note" role="status">
          Your email app should have opened with your message. If it didn&apos;t, email {contact.email} or call{" "}
          {contact.phoneDisplay}.
        </p>
      )}
    </form>
  );
}
