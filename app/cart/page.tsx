"use client";

// Cart page (Task 17.5)
// Source of truth: design.md "Route Map" and Requirement 9.
//
// Client Component reading the persisted cart store. When the cart is empty it
// shows an EmptyState with a "Continue shopping" CTA to /products; otherwise it
// lists the CartItems alongside the OrderSummary (with the Checkout button).
//
// Because the cart store is hydrated from localStorage, the first client render
// must match the server render (an empty store) to avoid a hydration mismatch.
// We therefore gate the store-driven UI behind a `mounted` flag and render a
// stable placeholder until after mount.
//
// Requirements: 9.1, 9.5, 9.7.

import { useEffect, useState } from "react";
import Link from "next/link";

import { useCartStore } from "@/store/useCartStore";
import { CartItem } from "@/components/cart/CartItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const items = useCartStore((state) => state.items);

  // Guard against hydration mismatch from the persisted store: render the
  // store-driven content only after the component has mounted on the client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Your Cart</h1>

      {!mounted ? (
        // Stable placeholder matching the server-rendered (empty store) output.
        <div className="h-40" aria-hidden="true" />
      ) : items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Browse the catalog to find something you like."
          action={
            <Link href="/products">
              <Button>Continue shopping</Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ul className="flex flex-col">
              {items.map((item) => (
                <li key={item.product.id}>
                  <CartItem item={item} />
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-1">
            <OrderSummary items={items} showCheckoutButton />
          </div>
        </div>
      )}
    </div>
  );
}
