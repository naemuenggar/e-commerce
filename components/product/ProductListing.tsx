"use client";

// ProductListing (Task 17.3)
// Source of truth: design.md "Product_Listing_Page" and "Rendering Strategy".
//
// The interactive client surface of the Product_Listing_Page. It:
//  - seeds search/category state from the URL (?q=, ?category=) via
//    useSearchParams (Requirements 4.x, 6.1);
//  - holds the combined CatalogQuery state and renders the SearchBar,
//    ProductFilter, and ProductSort controls bound to it (Requirements 4.1,
//    6.1, 6.2, 6.4, 7.x);
//  - computes visible products with applyCatalogQuery (Requirements 4.1, 6.x,
//    7.x);
//  - shows a SkeletonCard grid briefly on initial load (Skeleton_State,
//    Requirement 5.4);
//  - shows the EmptyState when nothing matches (Requirements 4.3, 5.5);
//  - otherwise renders the ProductGrid (Requirement 5.1).
//
// Requirements: 4.1, 4.2, 4.3, 5.1, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2,
// 7.3, 7.4.

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { CatalogQuery, Product, SortOption } from "@/types";
import { applyCatalogQuery } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";
import { SearchBar } from "@/components/product/SearchBar";
import {
  ProductFilter,
  type ProductFilterValues,
} from "@/components/product/ProductFilter";
import { ProductSort } from "@/components/product/ProductSort";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";

/** How long the skeleton state is shown on initial load. */
const INITIAL_LOAD_MS = 400;
/** Number of skeleton placeholders to render while loading. */
const SKELETON_COUNT = 8;

export interface ProductListingProps {
  /** The full catalog to browse. */
  products: Product[];
}

/**
 * Compute the sensible default price bounds for the catalog: 0 to the highest
 * product price. Falls back to 0 when the catalog is empty.
 */
function defaultPriceBounds(products: Product[]): {
  min: number;
  max: number;
} {
  const max = products.reduce(
    (highest, product) => Math.max(highest, product.price),
    0
  );
  return { min: 0, max };
}

export function ProductListing({ products }: ProductListingProps) {
  const searchParams = useSearchParams();
  const bounds = useMemo(() => defaultPriceBounds(products), [products]);

  // Seed search + category state from the URL on first render.
  const [query, setQuery] = useState<CatalogQuery>(() => ({
    query: searchParams.get("q") ?? "",
    category: searchParams.get("category"),
    priceMin: bounds.min,
    priceMax: bounds.max,
    sort: null,
  }));

  // Brief skeleton state on initial load (Skeleton_State, Requirement 5.4).
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), INITIAL_LOAD_MS);
    return () => clearTimeout(timer);
  }, []);

  const visibleProducts = useMemo(
    () => applyCatalogQuery(products, query),
    [products, query]
  );

  const handleSearchChange = (value: string) => {
    setQuery((prev) => ({ ...prev, query: value }));
  };

  const handleFilterChange = (next: ProductFilterValues) => {
    setQuery((prev) => ({
      ...prev,
      category: next.category,
      priceMin: next.priceMin,
      priceMax: next.priceMax,
    }));
  };

  const handleFilterClear = () => {
    setQuery((prev) => ({
      ...prev,
      category: null,
      priceMin: bounds.min,
      priceMax: bounds.max,
    }));
  };

  const handleSortChange = (option: SortOption) => {
    setQuery((prev) => ({ ...prev, sort: option }));
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Browse the full ShopEase catalog
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        {/* Controls sidebar */}
        <aside className="flex flex-col gap-6">
          <SearchBar value={query.query} onChange={handleSearchChange} />
          <ProductFilter
            category={query.category}
            priceMin={query.priceMin}
            priceMax={query.priceMax}
            onChange={handleFilterChange}
            onClear={handleFilterClear}
          />
          <ProductSort value={query.sort} onChange={handleSortChange} />
        </aside>

        {/* Results */}
        <section>
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <EmptyState
              title="No products found"
              message="Try adjusting your search or filters to find what you're looking for."
            />
          ) : (
            <ProductGrid products={visibleProducts} />
          )}
        </section>
      </div>
    </div>
  );
}

export default ProductListing;
