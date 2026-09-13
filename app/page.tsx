import { nap, taglines, coreValues, productFamilies, services } from "@/lib/site";

export default function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <span className="eyebrow">Serving Mississauga &amp; the GTA since 2012</span>
            <h1 className="hero-title">{taglines.hero}</h1>
            <p className="hero-sub">{taglines.sub}</p>
            <p className="hero-body">
              Titan Flooring brings premium hardwood, laminate, vinyl and tile to homes
              across the Greater Toronto Area — with clarity at every step, from your
              first visit to the last board installed.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href={nap.phoneHref}>
                Book a free estimate
              </a>
              <a className="btn secondary" href={`mailto:${nap.email}`}>
                Email us
              </a>
            </div>
          </div>
          <div className="hero-photo-placeholder">
            <span className="label">
              [ Placeholder — a real showroom or installation photo goes here. No stock
              photography is used as a stand-in for Titan&apos;s own work. ]
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="section-head">
            <h2>Why homeowners choose Titan</h2>
            <p>
              Over a decade of flooring homes across the GTA — in our own words, not a
              stock feature list.
            </p>
          </div>
          <div className="values-grid">
            {coreValues.map((v) => (
              <div className="value-card" key={v.name}>
                <h3>{v.name}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="section-head">
            <h2>Shop by material</h2>
            <p>Pick your flooring, and we&apos;ll help you get it right.</p>
          </div>
          <div className="tile-grid">
            {productFamilies.map((p) => (
              <a className="tile" href={p.href} key={p.href}>
                {p.name}
                <span className="arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="section-head">
            <h2>Installation &amp; refinishing</h2>
            <p>From a single room to a full home — our own crews, start to finish.</p>
          </div>
          <div className="tile-grid">
            {services.map((s) => (
              <a className="tile" href={s.href} key={s.href}>
                {s.name}
                <span className="arrow">→</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="shell">
          <div className="section-head">
            <h2>Visit our Mississauga showroom</h2>
            <p>
              {nap.address} — or call {nap.phone} to book a free in-home measure.
            </p>
          </div>
          <div className="hero-actions">
            <a className="btn primary" href={nap.phoneHref}>
              Call {nap.phone}
            </a>
            <a
              className="btn secondary"
              href="https://maps.app.goo.gl/ReVyciBQJryWVj8p8"
              target="_blank"
              rel="noreferrer"
            >
              Get directions
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
