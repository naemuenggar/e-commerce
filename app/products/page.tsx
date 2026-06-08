// Product Listing page (Task 17.3)
// Source of truth: design.md "App Router Route Map" and "Product_Listing_Page".
//
// This route renders the interactive ProductListing client component. Because
// ProductListing relies on `useSearchParams` (to seed search/category state
// from the URL), it must be wrapped in a <Suspense> boundary — Next.js App
// Router requires this so the route can be statically rendered while the
// client reads the search params on the client side.
//
// The catalog is imported from data/products.json and handed to the listing as
// props (a Server Component supplying data to a Client Component).
//
// Requirements: 4.1, 4.2, 4.3, 5.1, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2,
// 7.3, 7.4.

import { Suspense } from "react";

import productsData from "@/data/products.json";
import type { Product } from "@/types";

import { ProductListing } from "@/components/product/ProductListing";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

const products = productsData as Product[];

/** Number of skeleton placeholders shown in the Suspense fallback. */
const SKELETON_COUNT = 8;

/** Suspense fallback mirroring the listing layout while search params resolve. */
function ProductListingFallback() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <p className="text-muted-foreground">
          Browse the full ShopEase catalog
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductListingFallback />}>
      <ProductListing products={products} />
    </Suspense>
  );
}
