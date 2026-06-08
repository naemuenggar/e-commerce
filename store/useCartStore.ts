// Cart state store (Task 10.1)
// Source of truth: design.md "State Store Interfaces".
//
// Thin Zustand store: all mutation logic is delegated to the pure functions in
// lib/cart so it remains testable in isolation. State is persisted to
// localStorage so the cart survives client-side navigation and full reloads
// within a browser session (Requirements 9.8). A module-level Zustand store
// already survives client-side route transitions; persist adds reload safety
// with a graceful in-memory fallback when storage is unavailable.
//
// Requirements: 2.5, 8.4, 9.2, 9.8, 11.6.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "../types";
import {
  addToCart,
  updateQuantity,
  removeFromCart,
  cartItemCount,
} from "../lib/cart";
import { createSafeStorage } from "./storage";

export interface CartState {
  items: CartItem[];
  /** Add a product at the given quantity (merges with existing line). */
  add: (product: Product, quantity: number) => void;
  /** Set the quantity of the line item matching productId. */
  updateQty: (productId: number, quantity: number) => void;
  /** Remove the line item matching productId. */
  remove: (productId: number) => void;
  /** Empty the cart (Requirement 11.6). */
  clear: () => void;
  /** Total number of items across all lines (Requirement 2.5). */
  count: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, quantity) =>
        set((state) => ({ items: addToCart(state.items, product, quantity) })),
      updateQty: (productId, quantity) =>
        set((state) => ({
          items: updateQuantity(state.items, productId, quantity),
        })),
      remove: (productId) =>
        set((state) => ({ items: removeFromCart(state.items, productId) })),
      clear: () => set({ items: [] }),
      count: () => cartItemCount(get().items),
    }),
    {
      name: "shopease-cart",
      storage: createJSONStorage(() => createSafeStorage()),
      // Only persist serializable data, not the action functions.
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
