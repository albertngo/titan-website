"use client";

import { useState } from "react";

// Live widget: ElementsKit accordion, first item open, one open at a time.
export function Faq({ title, sub, items }: { title: string; sub: string | null; items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq boxed" aria-label={title}>
      <div className="faq-head">
        <h2 className="display">{title}</h2>
        {sub && <p>{sub}</p>}
      </div>
      <div className="faq-list">
        {items.map((it, i) => (
          <div key={it.q} className={`faq-item${open === i ? " open" : ""}`}>
            <h3>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
                <span>{it.q}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                  {open === i ? <path d="M12 20V4m-6 6 6-6 6 6" /> : <path d="M4 12h16m-6-6 6 6-6 6" />}
                </svg>
              </button>
            </h3>
            {open === i && <p className="faq-a">{it.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
