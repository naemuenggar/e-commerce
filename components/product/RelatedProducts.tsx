// RelatedProducts (Task 13.4)
// Source of truth: design.md "Reusable Component Inventory".
//
// Renders products related to the selected product (same category, excluding
// itself) using the pure `relatedProducts` selector and the responsive
// ProductGrid. Renders nothing when there are no related products.
//
// Requirements: 8.5.

import type { Product } from "../../types";
import { relatedProducts } from "../../lib/catalog";
import { ProductGrid } from "./ProductGrid";

export interface RelatedProductsProps {
  products: Product[];
  selected: Product;
}

/** Section showing other products in the same category as `selected`. */
export function RelatedProducts({ products, selected }: RelatedProductsProps) {
  const related = relatedProducts(products, selected);

  if (related.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold text-foreground">
        Related Products
      </h2>
      <ProductGrid products={related} />
    </section>
  );
}

export default RelatedProducts;
