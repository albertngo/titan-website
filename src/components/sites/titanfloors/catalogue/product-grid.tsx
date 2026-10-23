"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import type { CardProduct } from "@/lib/catalogue/types";
import { ProductCard } from "./product-card";

const PER_PAGE = 16;

type Facets = CardProduct["facets"];
type Group = { key: string; label: string; values: (f: Facets) => string[]; order?: (a: string, b: string) => number };

const fmtNum = (n: number, unit: string) => `${Number.isInteger(n) ? n : n.toFixed(2).replace(/0+$/, "")}${unit}`;
const numOrder = (a: string, b: string) => parseFloat(a) - parseFloat(b);
const TONE_ORDER = ["Light", "Natural", "Medium", "Dark", "Grey", "White", "Multi"];

const GROUPS: Group[] = [
  { key: "type", label: "Type", values: (f) => (f.type ? [f.type] : []) },
  { key: "tone", label: "Colour", values: (f) => (f.tone ? [f.tone] : []), order: (a, b) => rank(TONE_ORDER, a) - rank(TONE_ORDER, b) },
  { key: "undertone", label: "Undertone", values: (f) => (f.undertone ? [f.undertone] : []) },
  { key: "style", label: "Style", values: (f) => f.style },
  { key: "texture", label: "Texture", values: (f) => (f.texture ? [f.texture] : []) },
  { key: "species", label: "Species", values: (f) => (f.species ? [f.species] : []) },
  { key: "finish", label: "Finish", values: (f) => (f.finish ? [f.finish] : []) },
  { key: "install", label: "Install method", values: (f) => (f.install ? [f.install] : []) },
  { key: "width", label: "Width", values: (f) => (f.width != null ? [fmtNum(f.width, "″")] : []), order: numOrder },
  { key: "thickness", label: "Thickness", values: (f) => (f.thickness != null ? [fmtNum(f.thickness, "mm")] : []), order: numOrder },
  {
    key: "features",
    label: "Features",
    values: (f) => [f.waterproof && "Waterproof", f.pet && "Pet friendly", f.radiant && "Radiant heat compatible"].filter((x): x is string => Boolean(x)),
  },
];

const SMALL = "(max-width: 1024px)";
function isSmall() {
  return window.matchMedia(SMALL).matches;
}
function subscribeSmall(cb: () => void) {
  const mq = window.matchMedia(SMALL);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function rank(order: string[], v: string) {
  const i = order.indexOf(v);
  return i < 0 ? order.length : i;
}

type Sort = "name" | "price-asc" | "price-desc";

export function ProductGrid({ products }: { products: CardProduct[] }) {
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [sort, setSort] = useState<Sort>("name");
  const [page, setPage] = useState(1);
  // Filters start open beside the grid on desktop, folded above it on smaller screens.
  const small = useSyncExternalStore(subscribeSmall, isSmall, () => false);
  const [filtersChoice, setFiltersChoice] = useState<boolean | null>(null);
  const filtersOpen = filtersChoice ?? !small;

  // Only offer a filter when it actually splits this category's products.
  const options = useMemo(
    () =>
      GROUPS.map((g) => {
        const counts = new Map<string, number>();
        for (const p of products) for (const v of g.values(p.facets)) counts.set(v, (counts.get(v) ?? 0) + 1);
        const choices = [...counts.keys()].sort(g.order ?? ((a, b) => a.localeCompare(b)));
        return { ...g, choices, counts };
      }).filter((g) => g.choices.length > 1 || (g.key === "features" && g.choices.length > 0)),
    [products],
  );

  const filtered = useMemo(() => {
    const active = options.filter((g) => selected[g.key]?.length);
    const rows = products.filter((p) => active.every((g) => g.values(p.facets).some((v) => selected[g.key].includes(v))));
    const priced = (p: CardProduct) => (p.price == null ? Number.POSITIVE_INFINITY : p.price);
    if (sort === "price-asc") rows.sort((a, b) => priced(a) - priced(b));
    if (sort === "price-desc") rows.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    return rows;
  }, [products, options, selected, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const activeCount = Object.values(selected).reduce((n, v) => n + v.length, 0);

  const toggle = (key: string, value: string) => {
    setSelected((s) => {
      const cur = s[key] ?? [];
      return { ...s, [key]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value] };
    });
    setPage(1);
  };

  const goTo = (n: number) => {
    setPage(n);
    document.getElementById("product-grid")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="pgrid-wrap">
      <details className="filters" open={filtersOpen} onToggle={(e) => setFiltersChoice(e.currentTarget.open)}>
        <summary className="filters-head serif" onClick={(e) => !small && e.preventDefault()}>
          Filter by:{activeCount > 0 && <span className="filters-count">{activeCount}</span>}
        </summary>
        {activeCount > 0 && (
          <button type="button" className="filters-clear" onClick={() => (setSelected({}), setPage(1))}>
            Clear all
          </button>
        )}
        {options.map((g) => (
          <fieldset key={g.key} className="filter-group">
            <legend>{g.label}</legend>
            {g.choices.map((v) => (
              <label key={v} className="filter-opt">
                <input type="checkbox" checked={selected[g.key]?.includes(v) ?? false} onChange={() => toggle(g.key, v)} />
                <span>{v}</span>
                <small>{g.counts.get(v)}</small>
              </label>
            ))}
          </fieldset>
        ))}
      </details>

      <div className="pgrid-main" id="product-grid">
        <div className="pgrid-bar">
          <p className="pgrid-count" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
          <label className="pgrid-sort">
            Sort
            <select value={sort} onChange={(e) => (setSort(e.target.value as Sort), setPage(1))}>
              <option value="name">Name</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
          {pages > 1 && <Pager pages={pages} current={current} onGo={goTo} />}
        </div>

        {shown.length ? (
          <div className="pgrid">
            {shown.map((p) => (
              <ProductCard key={p.slug} p={p} />
            ))}
          </div>
        ) : (
          <p className="pgrid-empty">No products match these filters. Try removing one.</p>
        )}

        {pages > 1 && (
          <div className="pgrid-bar bottom">
            <Pager pages={pages} current={current} onGo={goTo} />
          </div>
        )}
      </div>
    </div>
  );
}

function Pager({ pages, current, onGo }: { pages: number; current: number; onGo: (n: number) => void }) {
  const nums = new Set([1, pages, current - 1, current, current + 1].filter((n) => n >= 1 && n <= pages));
  const list = [...nums].sort((a, b) => a - b);
  return (
    <nav className="pager" aria-label="Pages">
      <button type="button" disabled={current === 1} onClick={() => onGo(current - 1)}>
        Previous
      </button>
      {list.map((n, i) => (
        <span key={n} className="pager-item">
          {i > 0 && n - list[i - 1] > 1 && <span className="pager-gap">…</span>}
          <button type="button" aria-current={n === current ? "page" : undefined} onClick={() => onGo(n)}>
            {n}
          </button>
        </span>
      ))}
      <button type="button" disabled={current === pages} onClick={() => onGo(current + 1)}>
        Next
      </button>
    </nav>
  );
}
