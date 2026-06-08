"use client";

// ProductSort (Task 13.3)
// Source of truth: design.md "Reusable Component Inventory".
//
// Controlled sort select exposing the four catalog sort options. Emits the
// chosen `SortOption` via `onChange` to drive `applyCatalogQuery`.
//
// Requirements: 7.1, 7.2, 7.3, 7.4.

import type { SortOption } from "../../types";

export interface ProductSortProps {
  value: SortOption | null;
  onChange: (option: SortOption) => void;
}

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Lowest price" },
  { value: "price-desc", label: "Highest price" },
  { value: "rating-desc", label: "Highest rating" },
  { value: "newest", label: "Newest" },
];

/** Controlled select for the four supported sort options. */
export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="product-sort"
        className="text-sm font-medium text-foreground"
      >
        Sort by
      </label>
      <select
        id="product-sort"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value as SortOption)}
        aria-label="Sort products"
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      >
        <option value="" disabled>
          Select…
        </option>
        {OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductSort;
