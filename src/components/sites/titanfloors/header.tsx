"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { announcement, LIVE, nav } from "./site-data";
import { ChevronDown, HeartIcon, SearchIcon } from "./icons";
import { useWishlist } from "./wishlist";

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return href.startsWith("/") ? (
    <Link href={href} onClick={onClick}>
      {children}
    </Link>
  ) : (
    <a href={href}>{children}</a>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const count = useWishlist().length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header>
      <p className="topbar">{announcement}</p>
      <div className="hdr">
        <div className="hdr-row">
          <Link href="/" className="hdr-logo" aria-label="Titan Flooring home">
            <Image src="/sites/titanfloors/img/secondary_logo_2_-_blue.png" alt="Titan Flooring" width={400} height={127} loading="eager" />
          </Link>
          <form className="hdr-search" action={`${LIVE}/`} method="get" role="search">
            <SearchIcon />
            <input type="search" name="s" placeholder="Search" aria-label="Search products" />
            <input type="hidden" name="post_type" value="product" />
          </form>
          <a className="hdr-cta" href={`${LIVE}/contact/`}>
            Snag a free estimate
          </a>
          <div className="hdr-right">
            <Link className="hdr-heart" href="/wishlist/" aria-label={`Wishlist${count ? ` (${count})` : ""}`}>
              <HeartIcon />
              {count > 0 && <span className="hdr-count">{count}</span>}
            </Link>
            <button className="hdr-burger" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        <nav className="nav" aria-label="Main">
          <ul>
            {nav.map((item) => (
              <li key={item.label}>
                <NavLink href={item.href}>
                  {item.label}
                  {item.children && <ChevronDown />}
                </NavLink>
                {item.children && (
                  <ul className="sub">
                    {item.children.map((c) => (
                      <li key={c.label}>
                        <NavLink href={c.href}>{c.label}</NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {open && <div className="drawer-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <div className={`drawer${open ? " open" : ""}`} aria-hidden={!open} inert={!open}>
        <div className="drawer-top">
          <Image src="/sites/titanfloors/img/secondary_logo_2_-_blue.png" alt="Titan Flooring" width={142} height={45} />
          <button className="drawer-close" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>
        <ul>
          {nav.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    className="sub-toggle"
                    type="button"
                    aria-expanded={openSub === item.label}
                    onClick={() => setOpenSub(openSub === item.label ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown />
                  </button>
                  {openSub === item.label && (
                    <ul className="sub">
                      {item.children.map((c) => (
                        <li key={c.label}>
                          <NavLink href={c.href} onClick={() => setOpen(false)}>
                            {c.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <NavLink href={item.href} onClick={() => setOpen(false)}>
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
