"use client";

import { useEffect, useRef, useState } from "react";
import { reviews } from "./site-data";

// Live widget: 1 slide, autoplay 5000ms, 500ms slide, infinite, pauses on hover/interaction.
// Starts on the second slide, as the live page does.
const slides = [...reviews, reviews[0]];

export function ReviewsCarousel() {
  const [index, setIndex] = useState(1);
  const [instant, setInstant] = useState(false);
  const paused = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const measure = () => {
      const first = trackRef.current?.firstElementChild as HTMLElement | null;
      if (first) setStep(first.offsetWidth + 10);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => {
      if (!paused.current) {
        setInstant(false);
        setIndex((i) => i + 1);
      }
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const onTransitionEnd = () => {
    if (index === slides.length - 1) {
      setInstant(true);
      setIndex(0);
    }
  };

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
    >
      <div
        ref={trackRef}
        className={`carousel-track${instant ? " instant" : ""}`}
        style={{ transform: `translateX(-${index * step}px)` }}
        onTransitionEnd={onTransitionEnd}
      >
        {slides.map((r, i) => (
          <figure key={i} className="review" aria-hidden={i !== index} style={{ margin: 0 }}>
            <blockquote className="display">{r.quote}</blockquote>
            <div className="review-text">
              <p>{r.body}</p>
              <figcaption className="serif review-author">{r.author}</figcaption>
            </div>
          </figure>
        ))}
      </div>
    </div>
  );
}
