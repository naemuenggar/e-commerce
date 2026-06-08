"use client";

// ProductDetail (Task 17.4)
// Source of truth: design.md "Route Map" and Requirement 8.
//
// Client detail surface for a single product: large image, name, formatted
// price, rating, description, stock and shipping info, a quantity selector
// constrained to [1, stock], an Add to Cart control (cart store + toast), an
// Add to Wishlist control (wishlist store + toast), and a related products
// section drawn from the full catalog.
//
// Requirements: 8.1, 8.2, 8.3, 8.4, 8.5.

import { useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, Truck } from "lucide-react";

import type { Product } from "@/types";
import { formatRupiah } from "@/lib/format";
import { SHIPPING_FLAT } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useToastStore } from "@/store/useToastStore";

export interface ProductDetailProps {
  /** The product being viewed. */
  product: Product;
  /** The full catalog, used to derive related products. */
  catalog: Product[];
}

/**
 * Interactive product detail view (Requirement 8).
 */
export function ProductDetail({ product, catalog }: ProductDetailProps) {
  const inStock = product.stock > 0;
  const [quantity, setQuantity] = useState(inStock ? 1 : 0);

  const addToCart = useCartStore((state) => state.add);
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const inWishlist = useWishlistStore((state) => state.has(product.id));
  const showToast = useToastStore((state) => state.show);

  const handleAddToCart = () => {
    if (!inStock) return;
    addToCart(product, quantity);
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
    <div className="flex flex-col gap-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Large product image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            priority
          />
          {product.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
              New
            </span>
          )}
          {product.isBestSeller && (
            <span className="absolute right-3 top-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground">
              Best Seller
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {product.category}
          </p>

          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <Rating value={product.rating} />
            <span className="text-sm text-muted-foreground">
              {product.rating.toFixed(1)} out of 5
            </span>
          </div>

          <p className="text-3xl font-semibold text-foreground">
            {formatRupiah(product.price)}
          </p>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {/* Stock info */}
          <p className="text-sm">
            {inStock ? (
              <span className="font-medium text-foreground">
                In stock:{" "}
                <span className="text-muted-foreground">
                  {product.stock} available
                </span>
              </span>
            ) : (
              <span className="font-medium text-red-600 dark:text-red-400">
                Out of stock
              </span>
            )}
          </p>

          {/* Shipping info */}
          <div className="flex items-center gap-2 rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">
            <Truck className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
            <span>
              {SHIPPING_FLAT > 0
                ? `Flat shipping ${formatRupiah(SHIPPING_FLAT)} nationwide`
                : "Free shipping"}
            </span>
          </div>

          {/* Quantity + actions */}
          {inStock && (
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <QuantitySelector
                value={quantity}
                stock={product.stock}
                onChange={setQuantity}
              />
              <Button
                type="button"
                onClick={handleAddToCart}
                aria-label={`Add ${product.name} to cart`}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleToggleWishlist}
                aria-pressed={inWishlist}
                aria-label={
                  inWishlist
                    ? `Remove ${product.name} from wishlist`
                    : `Add ${product.name} to wishlist`
                }
              >
                <Heart
                  className={`h-4 w-4 ${inWishlist ? "fill-accent text-accent" : ""}`}
                />
                {inWishlist ? "In Wishlist" : "Add to Wishlist"}
              </Button>
            </div>
          )}

          {!inStock && (
            <Button
              type="button"
              variant="outline"
              onClick={handleToggleWishlist}
              aria-pressed={inWishlist}
              className="mt-2 self-start"
              aria-label={
                inWishlist
                  ? `Remove ${product.name} from wishlist`
                  : `Add ${product.name} to wishlist`
              }
            >
              <Heart
                className={`h-4 w-4 ${inWishlist ? "fill-accent text-accent" : ""}`}
              />
              {inWishlist ? "In Wishlist" : "Add to Wishlist"}
            </Button>
          )}
        </div>
      </div>

      {/* Related products (Requirement 8.5) */}
      <RelatedProducts products={catalog} selected={product} />
    </div>
  );
}

export default ProductDetail;
