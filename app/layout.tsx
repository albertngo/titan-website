import type { Metadata } from "next";
import "./globals.css";
import { nap, nav } from "@/lib/site";

export const metadata: Metadata = {
  title: "Titan Flooring | Hardwood, Laminate, Vinyl & Tile in Mississauga",
  description:
    "Titan Flooring brings premium hardwood, laminate, vinyl and tile flooring to homes across the Greater Toronto Area. Your friendly flooring experts since 2012.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="site">
          <div className="shell site-header-row">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/wordmark.svg" alt="Titan Flooring" className="wordmark" />
            <nav className="main-nav" aria-label="Main">
              {nav.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
            <a className="header-cta" href={nap.phoneHref}>
              Call {nap.phone}
            </a>
          </div>
        </header>

        {children}

        <footer className="site">
          <div className="shell footer-grid">
            <div>
              <h4>{nap.name}</h4>
              <p>{nap.address}</p>
              <a href={nap.phoneHref}>{nap.phone}</a>
              <a href={`mailto:${nap.email}`}>{nap.email}</a>
            </div>
            <div>
              <h4>Hours</h4>
              {nap.hours.map((h) => (
                <p key={h.days}>
                  {h.days}: {h.time}
                </p>
              ))}
            </div>
            <div>
              <h4>Shop</h4>
              {nav.slice(0, 6).map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div className="shell footer-bottom">
            © {new Date().getFullYear()} {nap.name} — serving the Greater Toronto Area.
          </div>
        </footer>
      </body>
    </html>
  );
}
