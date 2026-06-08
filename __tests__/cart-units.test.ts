// Example-based unit tests for the ShopEase cart domain logic (Task 6.7).
//
// These cover concrete scenarios that complement the property tests:
// updating to a new quantity, zero/negative handling, lineSubtotal edge
// cases, and behaviour on an empty cart.
//
// _Requirements: 9.3_

import { describe, it, expect } from "vitest";

import {
  cartItemCount,
  clampQuantity,
  computeTotals,
  lineSubtotal,
  removeFromCart,
  updateQuantity,
} from "../lib/cart";
import type { CartItem, Product } from "../types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: "Test Product",
    category: "Electronics",
    price: 10000,
    rating: 4,
    stock: 50,
    image: "https://example.com/image.png",
    description: "A product used in tests.",
    isNew: false,
    isBestSeller: false,
    ...overrides,
  };
}

describe("updateQuantity", () => {
  it("updates the matching item to a new quantity", () => {
    const cart: CartItem[] = [
      { product: makeProduct({ id: 1 }), quantity: 2 },
      { product: makeProduct({ id: 2 }), quantity: 5 },
    ];

    const result = updateQuantity(cart, 1, 7);

    expect(result.find((i) => i.product.id === 1)?.quantity).toBe(7);
    // Other items untouched.
    expect(result.find((i) => i.product.id === 2)?.quantity).toBe(5);
  });

  it("leaves the cart effectively unchanged when no item matches", () => {
    const cart: CartItem[] = [{ product: makeProduct({ id: 1 }), quantity: 2 }];

    const result = updateQuantity(cart, 999, 10);

    expect(result).toEqual(cart);
  });

  it("does not mutate the original cart array or its items", () => {
    const cart: CartItem[] = [{ product: makeProduct({ id: 1 }), quantity: 2 }];

    updateQuantity(cart, 1, 9);

    expect(cart[0].quantity).toBe(2);
  });

  it("applies a zero quantity verbatim (callers are expected to clamp first)", () => {
    const cart: CartItem[] = [{ product: makeProduct({ id: 1 }), quantity: 3 }];

    const result = updateQuantity(cart, 1, 0);

    expect(result[0].quantity).toBe(0);
  });

  it("applies a negative quantity verbatim (callers are expected to clamp first)", () => {
    const cart: CartItem[] = [{ product: makeProduct({ id: 1 }), quantity: 3 }];

    const result = updateQuantity(cart, 1, -4);

    expect(result[0].quantity).toBe(-4);
  });
});

describe("clampQuantity zero/negative handling", () => {
  it("clamps zero up to 1", () => {
    expect(clampQuantity(0, 10)).toBe(1);
  });

  it("clamps a negative request up to 1", () => {
    expect(clampQuantity(-5, 10)).toBe(1);
  });

  it("clamps a request above stock down to stock", () => {
    expect(clampQuantity(100, 10)).toBe(10);
  });

  it("returns an in-range request unchanged", () => {
    expect(clampQuantity(4, 10)).toBe(4);
  });
});

describe("lineSubtotal edge cases", () => {
  it("returns price * quantity for a normal item", () => {
    const item: CartItem = { product: makeProduct({ price: 2500 }), quantity: 3 };
    expect(lineSubtotal(item)).toBe(7500);
  });

  it("returns 0 when the product price is 0", () => {
    const item: CartItem = { product: makeProduct({ price: 0 }), quantity: 5 };
    expect(lineSubtotal(item)).toBe(0);
  });

  it("returns 0 when the quantity is 0", () => {
    const item: CartItem = { product: makeProduct({ price: 9999 }), quantity: 0 };
    expect(lineSubtotal(item)).toBe(0);
  });

  it("handles large prices without overflow within safe integer range", () => {
    const item: CartItem = { product: makeProduct({ price: 1_000_000 }), quantity: 1000 };
    expect(lineSubtotal(item)).toBe(1_000_000_000);
  });
});

describe("empty cart behaviour", () => {
  it("cartItemCount of an empty cart is 0", () => {
    expect(cartItemCount([])).toBe(0);
  });

  it("computeTotals of an empty cart is subtotal 0 and total = shipping - discount", () => {
    const totals = computeTotals([], 20000, 5000);
    expect(totals.subtotal).toBe(0);
    expect(totals.shipping).toBe(20000);
    expect(totals.discount).toBe(5000);
    expect(totals.total).toBe(15000);
  });

  it("removeFromCart on an empty cart returns an empty cart", () => {
    expect(removeFromCart([], 1)).toEqual([]);
  });

  it("updateQuantity on an empty cart returns an empty cart", () => {
    expect(updateQuantity([], 1, 5)).toEqual([]);
  });
});
