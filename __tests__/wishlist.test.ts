import { describe, it, expect } from "vitest";
import fc from "fast-check";

import { toggleWishlist } from "../lib/wishlist";
import type { Product } from "../types";
import { arbCatalog, arbProduct } from "./helpers/arbitraries";

// Property-based tests for the wishlist domain logic (Task 7.2).
// _Requirements: 10.1, 10.2_

/** The set of product ids contained in a wishlist. */
function idSet(wishlist: Product[]): Set<number> {
  return new Set(wishlist.map((item) => item.id));
}

describe("toggleWishlist", () => {
  // Feature: shopease, Property 14: Wishlist toggle is an involution — toggleWishlist adds if absent, removes if present; toggling twice restores original membership.
  it("adds when absent, removes when present, and toggling twice restores membership", () => {
    fc.assert(
      fc.property(arbCatalog, arbProduct, (wishlist, product) => {
        const wasPresent = wishlist.some((item) => item.id === product.id);

        const once = toggleWishlist(wishlist, product);
        const nowPresent = once.some((item) => item.id === product.id);

        // Single toggle flips membership for the toggled product.
        expect(nowPresent).toBe(!wasPresent);

        if (wasPresent) {
          // Removed: the product id is absent and the rest is unchanged.
          expect(once.some((item) => item.id === product.id)).toBe(false);
        } else {
          // Added: the product is appended.
          expect(once[once.length - 1].id).toBe(product.id);
        }

        // Double toggle restores the original membership (involution).
        const twice = toggleWishlist(once, product);
        expect(idSet(twice)).toEqual(idSet(wishlist));

        // Purity: the original input array is never mutated.
        expect(wishlist.some((item) => item.id === product.id)).toBe(wasPresent);
      }),
      { numRuns: 100 }
    );
  });
});
