// ProductGrid (Task 13.2)
// Source of truth: design.md "Reusable Component Inventory".
//
// Responsive wrapper that arranges ProductCards in a grid: 1 column on mobile,
// 2 on tablet (>= 640px), 3 on desktop (>= 1024px) and 4 on extra-large.
//
// Requirements: 5.1, 14.2, 14.3, 14.4.

import type { Product } from "@/types";
import { ProductCard } from "@/components/product/ProductCard";

export interface ProductGridProps {
  /** Products to render as cards. */
  products: Product[];
}

/**
 * Mobile-first responsive product grid. Column counts align with the
 * configured breakpoints (tablet 640px, desktop 1024px).
 */
export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default ProductGrid;
