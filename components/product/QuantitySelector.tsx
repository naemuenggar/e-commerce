"use client";

// QuantitySelector (Task 13.4)
// Source of truth: design.md "Reusable Component Inventory".
//
// A small stepper that constrains its value into the valid stock range via
// clampQuantity (Requirement 8.3). It is fully controlled: the parent owns the
// value and is notified of clamped changes through onChange.

import { Minus, Plus } from "lucide-react";
import { clampQuantity } from "../../lib/cart";

export interface QuantitySelectorProps {
  /** The current quantity (expected within [1, stock]). */
  value: number;
  /** Available stock; the upper bound of the selectable range. */
  stock: number;
  /** Called with the new, clamped quantity. */
  onChange: (quantity: number) => void;
}

/**
 * Controlled quantity stepper. Decrement/increment buttons and direct numeric
 * entry are all routed through clampQuantity so the emitted value never leaves
 * the inclusive range [1, stock] (Requirement 8.3).
 */
export function QuantitySelector({
  value,
  stock,
  onChange,
}: QuantitySelectorProps) {
  const commit = (next: number) => onChange(clampQuantity(next, stock));

  const atMin = value <= 1;
  const atMax = value >= stock;

  return (
    <div className="inline-flex items-center rounded-md border border-border bg-background">
      <button
        type="button"
        onClick={() => commit(value - 1)}
        disabled={atMin}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded-l-md text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>

      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={stock}
        value={value}
        onChange={(event) => {
          const parsed = Number.parseInt(event.target.value, 10);
          if (!Number.isNaN(parsed)) commit(parsed);
        }}
        aria-label="Quantity"
        className="h-9 w-12 border-x border-border bg-transparent text-center text-sm text-foreground focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={() => commit(value + 1)}
        disabled={atMax}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded-r-md text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export default QuantitySelector;
