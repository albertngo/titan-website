"use client";

import Image from "next/image";
import { useState } from "react";

export type GalleryImage = { src: string; full: string; thumb: string; alt: string };

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [i, setI] = useState(0);
  const cur = images[i] ?? images[0];
  if (!cur) return <div className="pp-gallery empty" />;
  return (
    <div className="pp-gallery">
      <div className="pp-main">
        <Image src={cur.src} alt={cur.alt} fill sizes="(max-width: 767px) 100vw, 565px" unoptimized priority />
        <a className="pp-zoom" href={cur.full} target="_blank" rel="noopener noreferrer" aria-label="Open full-size image">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m20 20-4.5-4.5" strokeLinecap="round" />
          </svg>
        </a>
      </div>
      {images.length > 1 && (
        <ul className="pp-thumbs">
          {images.map((im, n) => (
            <li key={im.src}>
              <button type="button" aria-label={`Show image ${n + 1}`} aria-current={n === i} onClick={() => setI(n)}>
                <Image src={im.thumb} alt="" fill sizes="80px" unoptimized />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
