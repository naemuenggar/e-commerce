"use client";

// CartItem component (Task 15.1)
// Source of truth: design.md "Reusable Component Inventory".
//
// Renders a single cart line: product image, name (linking to the detail page),
// unit price, a quantity selector wired to the cart store, the line subtotal,
// and a remove control (Requirement 9.1). Quantity changes and removal are
// delegated to useCartStore, whose mutations run through the pure lib/cart
// reducers.

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "../../types";
import { formatRupiah } from "../../lib/format";
import { lineSubtotal } from "../../lib/cart";
import { useCartStore } from "../../store/useCartStore";
import { QuantitySelector } from "../product/QuantitySelector";

export interface CartItemProps {
  /** The cart line to render. */
  item: CartItemType;
}

/**
 * A single row in the Cart_Page list (Requirement 9.1).
 */
export function CartItem({ item }: CartItemProps) {
  const updateQty = useCartStore((state) => state.updateQty);
  const remove = useCartStore((state) => state.remove);

  const { product, quantity } = item;
  const subtotal = lineSubtotal(item);

  return (
    <div className="flex gap-4 border-b border-border py-4">
      <Link
        href={`/product/${product.id}`}
        className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Link
              href={`/product/${product.id}`}
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              {product.name}
            </Link>
            <p className="mt-1 text-sm text-muted-foreground">
              {formatRupiah(product.price)}
            </p>
          </div>

          <button
            type="button"
            onClick={() => remove(product.id)}
            aria-label={`Remove ${product.name} from cart`}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4">
          <QuantitySelector
            value={quantity}
            stock={product.stock}
            onChange={(qty) => updateQty(product.id, qty)}
          />
          <span className="font-semibold text-foreground">
            {formatRupiah(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
