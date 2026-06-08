// Wishlist state store (Task 10.2)
// Source of truth: design.md "State Store Interfaces".
//
// Thin Zustand store: toggle logic is delegated to lib/wishlist.toggleWishlist.
// State is persisted to localStorage (with in-memory fallback) so the wishlist
// is retained across client-side navigation and reloads (Requirement 10.6).
//
// Requirements: 10.1, 10.2, 10.6.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "../types";
import { toggleWishlist } from "../lib/wishlist";
import { createSafeStorage } from "./storage";

export interface WishlistState {
  items: Product[];
  /** Add the product if absent, remove it if present (Requirements 10.1, 10.2). */
  toggle: (product: Product) => void;
  /** Remove the product matching productId. */
  remove: (productId: number) => void;
  /** Whether a product is currently in the wishlist. */
  has: (productId: number) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) =>
        set((state) => ({ items: toggleWishlist(state.items, product) })),
      remove: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        })),
      has: (productId) => get().items.some((item) => item.id === productId),
    }),
    {
      name: "shopease-wishlist",
      storage: createJSONStorage(() => createSafeStorage()),
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
