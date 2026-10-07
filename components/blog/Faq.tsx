import type { FaqItem } from "@/lib/blog";

export default function Faq({ items }: { items: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section className="post-faq" aria-labelledby="faq-heading">
      <h2 id="faq-heading">Frequently asked questions</h2>
      {items.map((f) => (
        <details key={f.q} open>
          <summary>
            <h3>{f.q}</h3>
          </summary>
          <p>{f.a}</p>
        </details>
      ))}
    </section>
  );
}
