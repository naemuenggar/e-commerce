"use client";

// ProductFilter (Task 13.3)
// Source of truth: design.md "Reusable Component Inventory".
//
// Controlled category + price-range filter. Emits the next filter state via
// `onChange` (so the parent can drive `applyCatalogQuery`) and exposes a Clear
// control to reset all filters.
//
// Requirements: 6.1, 6.2, 6.4.

import { CATEGORIES } from "../../lib/constants";
import { Button } from "../ui/Button";

export interface ProductFilterValues {
  category: string | null;
  priceMin: number;
  priceMax: number;
}

export interface ProductFilterProps {
  category: string | null;
  priceMin: number;
  priceMax: number;
  onChange: (next: ProductFilterValues) => void;
  onClear: () => void;
}

const ALL_VALUE = "__all__";

/** Controlled category select + price range inputs with a Clear action. */
export function ProductFilter({
  category,
  priceMin,
  priceMax,
  onChange,
  onClear,
}: ProductFilterProps) {
  const handleCategoryChange = (value: string) => {
    onChange({
      category: value === ALL_VALUE ? null : value,
      priceMin,
      priceMax,
    });
  };

  const handleMinChange = (value: string) => {
    const parsed = Number(value);
    onChange({
      category,
      priceMin: Number.isNaN(parsed) ? 0 : parsed,
      priceMax,
    });
  };

  const handleMaxChange = (value: string) => {
    const parsed = Number(value);
    onChange({
      category,
      priceMin,
      priceMax: Number.isNaN(parsed) ? 0 : parsed,
    });
  };

  const fieldClasses =
    "w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background";

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground">
      <div className="flex flex-col gap-1">
        <label
          htmlFor="filter-category"
          className="text-sm font-medium text-foreground"
        >
          Category
        </label>
        <select
          id="filter-category"
          value={category ?? ALL_VALUE}
          onChange={(event) => handleCategoryChange(event.target.value)}
          className={fieldClasses}
        >
          <option value={ALL_VALUE}>All</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-foreground">Price range</span>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={priceMin}
            onChange={(event) => handleMinChange(event.target.value)}
            aria-label="Minimum price"
            placeholder="Min"
            className={fieldClasses}
          />
          <span className="text-muted-foreground">–</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            value={priceMax}
            onChange={(event) => handleMaxChange(event.target.value)}
            aria-label="Maximum price"
            placeholder="Max"
            className={fieldClasses}
          />
        </div>
      </div>

      <Button type="button" variant="outline" size="sm" onClick={onClear}>
        Clear
      </Button>
    </div>
  );
}

export default ProductFilter;
