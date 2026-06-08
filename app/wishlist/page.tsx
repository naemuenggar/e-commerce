"use client";

// Wishlist page (Task 17.6)
// Source of truth: design.md "Wishlist_Page".
// Requirements: 10.3, 10.5.
//
// Reads the wishlist from useWishlistStore. When empty, renders an EmptyState
// with a CTA back to the catalog (Requirement 10.5). Otherwise renders the list
// of WishlistItem rows (Requirement 10.3). Rendering is guarded until after
// mount so the persisted (localStorage) wishlist does not cause a hydration
// mismatch on first paint.

import { useEffect, useState } from "react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { WishlistItem } from "@/components/wishlist/WishlistItem";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function WishlistPage() {
  const items = useWishlistStore((state) => state.items);

  // Guard against hydration mismatch: persisted state is only available on the
  // client, so defer content until the component has mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Wishlist</h1>

      {!mounted ? null : items.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          message="Browse our catalog and save the items you love."
          action={
            <Link
              href="/products"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Continue Shopping
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col">
          {items.map((product) => (
            <WishlistItem key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
