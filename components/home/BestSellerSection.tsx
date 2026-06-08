// BestSellerSection (Task 14.1)
// Source of truth: design.md "Home Page" section.
//
// Renders only the products flagged as best sellers (via the pure
// `bestSellers` selector) inside a responsive ProductGrid, under a section
// heading.
//
// Requirements: 3.1, 3.4.

import type { Product } from "@/types";
import { bestSellers } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/ProductGrid";

export interface BestSellerSectionProps {
  /** The full catalog; only best sellers are displayed. */
  products: Product[];
}

/**
 * Section showcasing best-selling products. Filters the supplied catalog down
 * to best sellers and renders them in the shared ProductGrid.
 */
export function BestSellerSection({ products }: BestSellerSectionProps) {
  const featured = bestSellers(products);

  if (featured.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Best Sellers</h2>
        <p className="text-muted-foreground">
          The products our customers love most
        </p>
      </div>

      <ProductGrid products={featured} />
    </section>
  );
}

export default BestSellerSection;
