"use client";

// Checkout page (Task 17.7)
// Source of truth: design.md "Checkout_Page".
// Requirements: 11.2, 11.5, 11.6.
//
// Renders the CheckoutForm alongside an OrderSummary for the current cart. On a
// valid submission the cart is cleared (useCartStore.clear, Requirement 11.6)
// and an order-success message is shown in a Modal (Requirement 11.5) with a
// "Continue Shopping" link back to the catalog.

import { useEffect, useState } from "react";
import Link from "next/link";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Modal } from "@/components/ui/Modal";
import { useCartStore } from "@/store/useCartStore";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);

  const [orderPlaced, setOrderPlaced] = useState(false);

  // Guard against hydration mismatch from the persisted cart.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = () => {
    // On a valid CheckoutForm submission: clear the cart and show success.
    clearCart();
    setOrderPlaced(true);
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-foreground">Checkout</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_22rem]">
        <section aria-label="Shipping and payment details">
          <CheckoutForm onSubmit={handleSubmit} />
        </section>
        <aside aria-label="Order summary">
          <OrderSummary items={mounted ? items : []} />
        </aside>
      </div>

      <Modal
        open={orderPlaced}
        onClose={() => setOrderPlaced(false)}
        title="Order placed"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground">
            Your order has been placed successfully.
          </p>
          <Link
            href="/products"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Continue Shopping
          </Link>
        </div>
      </Modal>
    </main>
  );
}
