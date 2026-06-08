// Product Detail page (Task 17.4)
// Source of truth: design.md "Route Map" and Requirement 8.
//
// Server Component: resolves the numeric `id` route param against the static
// product catalog. Unknown ids trigger Next.js `notFound()` (404). The matched
// product and the full catalog are handed to the client `ProductDetail`
// component, which owns the interactive surface (quantity, add to cart,
// wishlist, related products).
//
// Requirements: 8.1, 8.2, 8.3, 8.4, 8.5.

import { notFound } from "next/navigation";

import type { Product } from "@/types";
import productsData from "@/data/products.json";
import { ProductDetail } from "@/components/product/ProductDetail";

const catalog = productsData as Product[];

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number.parseInt(params.id, 10);

  const product = Number.isNaN(id)
    ? undefined
    : catalog.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetail product={product} catalog={catalog} />
    </div>
  );
}
