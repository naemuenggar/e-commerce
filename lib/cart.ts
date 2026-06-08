// Cart domain logic — pure, framework-agnostic
// (Requirements 2.5, 8.3, 8.4, 9.2, 9.3, 9.4, 9.6).
// Source of truth: design.md "Domain Logic Interfaces".

import type { CartItem, OrderTotals, Product } from "../types";

/**
 * Add a product to the cart at the given quantity.
 *
 * - If a cart item matching the product's `id` already exists, its quantity is
 *   increased by `quantity` (no duplicate entry is created) — Requirements 8.4, 9.2.
 * - Otherwise a new `CartItem` is appended to the cart.
 *
 * The input array (and its items) is never mutated; new arrays/objects are
 * returned so the original cart is left untouched. All other items are
 * preserved unchanged (backs Property 9).
 *
 * @param cart The current cart.
 * @param product The product to add.
 * @param quantity The quantity to add (expected >= 1).
 * @returns A new cart array reflecting the addition.
 */
export function addToCart(
  cart: CartItem[],
  product: Product,
  quantity: number,
): CartItem[] {
  const exists = cart.some((item) => item.product.id === product.id);

  if (exists) {
    return cart.map((item) =>
      item.product.id === product.id
        ? { ...item, quantity: item.quantity + quantity }
        : item,
    );
  }

  return [...cart, { product, quantity }];
}

/**
 * Set the quantity of the cart item matching `productId`.
 *
 * Items whose product id does not match are left unchanged. The input array
 * (and its items) is never mutated.
 *
 * @param cart The current cart.
 * @param productId The id of the product whose quantity should be set.
 * @param quantity The new quantity value.
 * @returns A new cart array with the matching item's quantity updated.
 */
export function updateQuantity(
  cart: CartItem[],
  productId: number,
  quantity: number,
): CartItem[] {
  return cart.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item,
  );
}

/**
 * Remove the cart item matching `productId`.
 *
 * Only the item with the matching product id is removed; every other item
 * remains unchanged (backs Property 11). The input array is never mutated.
 *
 * @param cart The current cart.
 * @param productId The id of the product to remove.
 * @returns A new cart array without the matching item.
 */
export function removeFromCart(cart: CartItem[], productId: number): CartItem[] {
  return cart.filter((item) => item.product.id !== productId);
}

/**
 * Compute the line subtotal for a single cart item (Requirement 9.3).
 *
 * @param item The cart item.
 * @returns The unit price multiplied by the quantity.
 */
export function lineSubtotal(item: CartItem): number {
  return item.product.price * item.quantity;
}

/**
 * Compute the total number of items in the cart (Requirement 2.5).
 *
 * @param cart The current cart.
 * @returns The sum of the quantities of all cart items.
 */
export function cartItemCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Compute the order totals for the cart (Requirements 9.5, 9.6).
 *
 * - `subtotal` is the sum of all line subtotals.
 * - `total` equals `subtotal + shipping - discount`.
 *
 * @param cart The current cart.
 * @param shipping The flat shipping amount.
 * @param discount The discount amount.
 * @returns The computed {@link OrderTotals}.
 */
export function computeTotals(
  cart: CartItem[],
  shipping: number,
  discount: number,
): OrderTotals {
  const subtotal = cart.reduce((sum, item) => sum + lineSubtotal(item), 0);

  return {
    subtotal,
    shipping,
    discount,
    total: subtotal + shipping - discount,
  };
}

/**
 * Clamp a requested quantity into the inclusive range `[1, stock]`
 * (Requirement 8.3).
 *
 * - Zero or negative requests clamp up to 1.
 * - Requests above `stock` clamp down to `stock`.
 *
 * @param quantity The requested quantity.
 * @param stock The available stock (expected >= 1).
 * @returns A quantity `q` with `1 <= q <= stock`.
 */
export function clampQuantity(quantity: number, stock: number): number {
  return Math.max(1, Math.min(quantity, stock));
}
