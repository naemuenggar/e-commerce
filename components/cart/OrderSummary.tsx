"use client";

// OrderSummary component (Task 15.1)
// Source of truth: design.md "Reusable Component Inventory".
//
// Displays the order totals — subtotal, shipping, discount, and total — derived
// from the cart via the pure computeTotals reducer (Requirements 9.5, 9.6).
// Items default to the live cart store, and shipping/discount default to the
// configured constants. Optionally renders a Checkout call-to-action linking to
// /checkout.

import Link from "next/link";
import type { CartItem } from "../../types";
import { formatRupiah } from "../../lib/format";
import { computeTotals } from "../../lib/cart";
import { SHIPPING_FLAT, DISCOUNT_DEFAULT } from "../../lib/constants";
import { useCartStore } from "../../store/useCartStore";

export interface OrderSummaryProps {
  /** Cart lines to summarize. Defaults to the live cart store contents. */
  items?: CartItem[];
  /** Flat shipping amount. Defaults to SHIPPING_FLAT. */
  shipping?: number;
  /** Discount amount. Defaults to DISCOUNT_DEFAULT. */
  discount?: number;
  /** Whether to render the Checkout button. Defaults to false. */
  showCheckoutButton?: boolean;
}

/** A single labeled amount row within the summary. */
function SummaryRow({
  label,
  value,
  emphasize = false,
}: {
  label: string;
  value: string;
  emphasize?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between ${
        emphasize
          ? "border-t border-border pt-3 text-base font-semibold text-foreground"
          : "text-sm text-muted-foreground"
      }`}
    >
      <span>{label}</span>
      <span className={emphasize ? "" : "text-foreground"}>{value}</span>
    </div>
  );
}

/**
 * The Order_Summary panel (Requirements 9.5, 9.6).
 */
export function OrderSummary({
  items,
  shipping = SHIPPING_FLAT,
  discount = DISCOUNT_DEFAULT,
  showCheckoutButton = false,
}: OrderSummaryProps) {
  const storeItems = useCartStore((state) => state.items);
  const cartItems = items ?? storeItems;

  const totals = computeTotals(cartItems, shipping, discount);

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-card-foreground">
      <h2 className="mb-4 text-lg font-semibold text-foreground">
        Order Summary
      </h2>

      <div className="space-y-3">
        <SummaryRow label="Subtotal" value={formatRupiah(totals.subtotal)} />
        <SummaryRow label="Shipping" value={formatRupiah(totals.shipping)} />
        <SummaryRow label="Discount" value={`- ${formatRupiah(totals.discount)}`} />
        <SummaryRow
          label="Total"
          value={formatRupiah(totals.total)}
          emphasize
        />
      </div>

      {showCheckoutButton ? (
        <Link
          href="/checkout"
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-md bg-primary px-6 text-base font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Checkout
        </Link>
      ) : null}
    </div>
  );
}

export default OrderSummary;
