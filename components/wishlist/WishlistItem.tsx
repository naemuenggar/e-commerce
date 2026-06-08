"use client";

// WishlistItem component (Task 15.2)
// Source of truth: design.md "Reusable Component Inventory".
//
// Renders a single wishlist row: product image, name (linking to the detail
// page), price, an "Add to Cart" control, and a remove control
// (Requirements 10.3, 10.4). Adding to the cart delegates to useCartStore and
// surfaces feedback through the toast store; removal delegates to
// useWishlistStore.

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingCart } from "lucide-react";
import type { Product } from "../../types";
import { formatRupiah } from "../../lib/format";
import { useCartStore } from "../../store/useCartStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import { useToastStore } from "../../store/useToastStore";
import { Button } from "../ui/Button";

export interface WishlistItemProps {
  /** The wishlisted product to render. */
  product: Product;
}

/**
 * A single row in the Wishlist_Page list (Requirements 10.3, 10.4).
 */
export function WishlistItem({ product }: WishlistItemProps) {
  const addToCart = useCartStore((state) => state.add);
  const removeFromWishlist = useWishlistStore((state) => state.remove);
  const showToast = useToastStore((state) => state.show);

  const handleAddToCart = () => {
    addToCart(product, 1);
    showToast(`${product.name} added to cart`, "success");
  };

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
            onClick={() => removeFromWishlist(product.id)}
            aria-label={`Remove ${product.name} from wishlist`}
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3">
          <Button onClick={handleAddToCart} size="sm">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WishlistItem;
