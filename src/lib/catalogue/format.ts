// Pure display helpers, safe to import from client components (no data access here).

const money = new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2 });

export function formatMoney(n: number): string {
  return money.format(n).replace("CA", "");
}

export function unitLabel(unit: "sf" | "piece"): string {
  return unit === "sf" ? "sq.ft" : "piece";
}
