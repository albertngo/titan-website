"use client";

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";

type FadeInProps = {
  as?: ElementType;
  className?: string;
  slow?: boolean;
  delay?: number;
  style?: CSSProperties;
  children: ReactNode;
};

export function FadeIn({ as: Tag = "div", className = "", slow = false, delay = 0, style, children }: FadeInProps) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`fade${slow ? " slow" : ""}${shown ? " in" : ""} ${className}`}
      style={delay ? { ...style, animationDelay: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}
