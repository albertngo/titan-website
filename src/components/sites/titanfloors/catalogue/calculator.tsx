"use client";

import { useState } from "react";

const money = (n: number) => `$${n.toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Live widget: "Enter Required Sq.ft" -> Total Price, Total Boxes. Boxes round up, and the
// price is for the boxes actually carried out, since flooring isn't sold by the part-box.
export function Calculator({ price, unit, boxSf }: { price: number | null; unit: "sf" | "piece"; boxSf: number | null }) {
  const [raw, setRaw] = useState("");
  const qty = Math.max(0, Number(raw) || 0);
  const perPiece = unit === "piece";
  const boxes = !perPiece && boxSf ? Math.ceil(qty / boxSf) : null;
  const billed = perPiece ? Math.ceil(qty) : boxes != null && boxSf ? boxes * boxSf : qty;
  const total = price != null ? billed * price : null;

  return (
    <div className="pp-calc">
      <label htmlFor="pp-qty" className="serif">
        {perPiece ? "Enter quantity:" : "Enter Required Sq.ft:"}
      </label>
      <input
        id="pp-qty"
        inputMode="decimal"
        placeholder={perPiece ? "Enter quantity" : "Enter square feet"}
        value={raw}
        onChange={(e) => setRaw(e.target.value.replace(/[^\d.]/g, ""))}
      />
      {total != null && <p>Total Price: {money(total)}</p>}
      {!perPiece && <p>Total Boxes: {boxes ?? "—"}</p>}
      {!perPiece && boxSf != null && qty > 0 && (
        <p className="pp-calc-note">
          {boxes} {boxes === 1 ? "box" : "boxes"} × {boxSf} sq.ft = {Math.round(billed * 100) / 100} sq.ft. Ask us about extra for cuts and waste.
        </p>
      )}
    </div>
  );
}
