// Wishlist domain logic — pure, framework-agnostic (Requirements 10.1, 10.2, 10.4).
// Source of truth: design.md "Domain Logic Interfaces".

import type { Product } from "../types";

/**
 * Toggle a product's membership in the wishlist.
 *
 * - If the product (matched by `id`) is absent, it is appended to the wishlist.
 * - If the product is already present, it is removed.
 *
 * The input array is never mutated; a new array is always returned.
 * Applying the toggle twice yields a wishlist with the same membership as the
 * original (involution over membership), which backs Property 14.
 *
 * @param wishlist The current wishlist.
 * @param product The product to add or remove.
 * @returns A new wishlist array reflecting the toggle.
 */
export function toggleWishlist(wishlist: Product[], product: Product): Product[] {
  const exists = wishlist.some((item) => item.id === product.id);

  if (exists) {
    return wishlist.filter((item) => item.id !== product.id);
  }

  return [...wishlist, product];
}
