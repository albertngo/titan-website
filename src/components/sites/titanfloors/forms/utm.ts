"use client";

import { useEffect } from "react";
import type { Utm } from "@/lib/leads/types";

// First-touch attribution: the first visit that carried utm_* parameters is remembered for 90
// days and sent with every form, so a lead from an ad or a blog link keeps its source even if
// they come back later by typing the address.

const COOKIE = "tf_utm";

export function readUtm(): Utm {
  try {
    const raw = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
    return raw ? (JSON.parse(decodeURIComponent(raw.slice(COOKIE.length + 1))) as Utm) : {};
  } catch {
    return {};
  }
}

export function UtmCapture() {
  useEffect(() => {
    if (document.cookie.includes(`${COOKIE}=`)) return;
    const q = new URLSearchParams(window.location.search);
    const utm: Utm = {};
    for (const k of ["source", "medium", "campaign"] as const) {
      const v = q.get(`utm_${k}`);
      if (v) utm[k] = v.slice(0, 200);
    }
    if (!utm.source && !utm.medium && !utm.campaign) return;
    document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(utm))}; path=/; max-age=${90 * 86400}; samesite=lax; secure`;
  }, []);
  return null;
}
