// Property-based tests for the ShopEase cart domain logic (lib/cart.ts).
//
// Each property below maps to a named property in the ShopEase design's
// Testing Strategy. All assertions run with fast-check using numRuns >= 100.
//
// _Requirements: 2.5, 8.3, 8.4, 9.2, 9.3, 9.4, 9.6, 10.4_

import { describe, it } from "vitest";
import fc from "fast-check";

import {
  addToCart,
  cartItemCount,
  clampQuantity,
  computeTotals,
  removeFromCart,
} from "../lib/cart";
import {
  arbCart,
  arbProduct,
  arbValidQuantity,
  arbAnyQuantity,
  arbStock,
} from "./helpers/arbitraries";

const RUNS = { numRuns: 100 };

describe("cart domain logic — property tests", () => {
  // Feature: shopease, Property 2: Cart total item count equals the sum of quantities
  it("cartItemCount equals the sum of all item quantities", () => {
    fc.assert(
      fc.property(arbCart, (cart) => {
        const expected = cart.reduce((sum, item) => sum + item.quantity, 0);
        return cartItemCount(cart) === expected;
      }),
      RUNS
    );
  });

  // Feature: shopease, Property 9: Quantity is clamped to the valid stock range [1, stock]; in-range values returned unchanged
  it("clampQuantity returns a value within [1, stock] and leaves in-range values unchanged", () => {
    fc.assert(
      fc.property(
        arbAnyQuantity,
        // stock must be at least 1 for the range [1, stock] to be valid
        arbStock.map((s) => s + 1),
        (quantity, stock) => {
          const result = clampQuantity(quantity, stock);

          // Always within the inclusive range [1, stock].
          if (result < 1 || result > stock) return false;

          // A request already within range is returned unchanged.
          if (quantity >= 1 && quantity <= stock) {
            return result === quantity;
          }

          return true;
        }
      ),
      RUNS
    );
  });

  // Feature: shopease, Property 11: Adding an existing product merges quantities — no duplicate line item; new product appends one entry; other items unchanged
  it("addToCart merges quantities for an existing product without duplicating the line item", () => {
    fc.assert(
      fc.property(
        arbCart.filter((cart) => cart.length > 0),
        arbValidQuantity,
        (cart, addQty) => {
          // Pick an existing product from the cart to add again.
          const target = cart[0];
          const result = addToCart(cart, target.product, addQty);

          // No new distinct line item is created.
          if (result.length !== cart.length) return false;

          const updated = result.find(
            (item) => item.product.id === target.product.id
          );
          if (!updated) return false;

          // The target line item's quantity increased by exactly addQty.
          if (updated.quantity !== target.quantity + addQty) return false;

          // Every other item is unchanged.
          return cart
            .filter((item) => item.product.id !== target.product.id)
            .every((original) => {
              const after = result.find(
                (item) => item.product.id === original.product.id
              );
              return (
                after !== undefined &&
                after.quantity === original.quantity &&
                after.product.id === original.product.id
              );
            });
        }
      ),
      RUNS
    );
  });

  // Feature: shopease, Property 11: Adding an existing product merges quantities — no duplicate line item; new product appends one entry; other items unchanged
  it("addToCart appends exactly one new line item for a product not present, leaving others unchanged", () => {
    fc.assert(
      fc.property(arbCart, arbProduct, arbValidQuantity, (cart, product, addQty) => {
        // Ensure the product is not already in the cart.
        const absentCart = cart.filter(
          (item) => item.product.id !== product.id
        );
        const result = addToCart(absentCart, product, addQty);

        // Exactly one new entry appended.
        if (result.length !== absentCart.length + 1) return false;

        const appended = result.find((item) => item.product.id === product.id);
        if (!appended || appended.quantity !== addQty) return false;

        // All pre-existing items remain unchanged.
        return absentCart.every((original) => {
          const after = result.find(
            (item) => item.product.id === original.product.id
          );
          return after !== undefined && after.quantity === original.quantity;
        });
      }),
      RUNS
    );
  });

  // Feature: shopease, Property 12: Removing a product leaves it absent; other items unchanged
  it("removeFromCart deletes only the target item, leaving every other item unchanged", () => {
    fc.assert(
      fc.property(
        arbCart.filter((cart) => cart.length > 0),
        (cart) => {
          const targetId = cart[0].product.id;
          const result = removeFromCart(cart, targetId);

          // The removed product is absent.
          if (result.some((item) => item.product.id === targetId)) return false;

          // Every other original item remains unchanged.
          return cart
            .filter((item) => item.product.id !== targetId)
            .every((original) => {
              const after = result.find(
                (item) => item.product.id === original.product.id
              );
              return (
                after !== undefined && after.quantity === original.quantity
              );
            });
        }
      ),
      RUNS
    );
  });

  // Feature: shopease, Property 13: Order summary arithmetic is consistent — subtotal = Σ price*qty; total = subtotal + shipping - discount
  it("computeTotals yields subtotal = Σ price*qty and total = subtotal + shipping - discount", () => {
    fc.assert(
      fc.property(
        arbCart,
        fc.integer({ min: 0, max: 1_000_000 }),
        fc.integer({ min: 0, max: 1_000_000 }),
        (cart, shipping, discount) => {
          const totals = computeTotals(cart, shipping, discount);

          const expectedSubtotal = cart.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
          );

          return (
            totals.subtotal === expectedSubtotal &&
            totals.shipping === shipping &&
            totals.discount === discount &&
            totals.total === expectedSubtotal + shipping - discount
          );
        }
      ),
      RUNS
    );
  });
});
