"use client";

// ProductCard (Task 13.1)
// Source of truth: design.md "Reusable Component Inventory".
//
// Presents a single product: image, name, category, formatted price, rating,
// an Add to Cart control (cart store + toast) and a wishlist toggle (wishlist
// store + toast). The card links to the product detail page at /product/{id}.
//
// Requirements: 1.5, 5.2, 8.4, 10.1.

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

import type { Product } from "@/types";
import { formatRupiah } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";

export interface ProductCardProps {
  /** The product to display. */
  product: Product;
}

/**
 * A themed, responsive product card with quick Add to Cart and wishlist
 * actions. The card body links to the detail page; action buttons stop
 * propagation so they don't trigger navigation.
 */
export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.add);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const inWishlist = useWishlistStore((state) => state.has(product.id));
  const showToast = useToastStore((state) => state.show);

  const handleAddToCart = () => {
    addToCart(product, 1);
    showToast(`${product.name} added to cart`, "success");
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
    showToast(
      inWishlist
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`,
      "success",
    );
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
            New
          </span>
        )}
        {product.isBestSeller && (
          <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
            Best Seller
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          {product.category}
        </p>
        <Link
          href={`/product/${product.id}`}
          className="line-clamp-2 font-medium transition-colors hover:text-primary"
        >
          {product.name}
        </Link>

        <Rating value={product.rating} />

        <p className="mt-auto text-lg font-semibold">
          {formatRupiah(product.price)}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <Button
            type="button"
            className="flex-1"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleToggleWishlist}
            aria-label={
              inWishlist
                ? `Remove ${product.name} from wishlist`
                : `Add ${product.name} to wishlist`
            }
            aria-pressed={inWishlist}
            className="px-3"
          >
            <Heart
              className={`h-4 w-4 ${inWishlist ? "fill-accent text-accent" : ""}`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
