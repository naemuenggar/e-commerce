import { describe, it, expect, beforeEach } from "vitest";

import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useThemeStore } from "../store/useThemeStore";
import type { Product } from "../types";

// Store persistence integration tests (Task 18.1).
//
// The cart, wishlist, and theme stores use Zustand's `persist` middleware with
// a localStorage-backed storage (names "shopease-cart", "shopease-wishlist",
// "shopease-theme"). These tests mutate each store and assert that the value is
// written to localStorage (so it survives a reload / remount) and that the
// store state itself is retained.
//
// _Requirements: 9.8, 10.6, 15.3_

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: "Persisted Product",
    category: "Fashion",
    price: 75000,
    rating: 4.5,
    stock: 10,
    image: "https://example.com/p.jpg",
    description: "A persisted product",
    isNew: false,
    isBestSeller: false,
    ...overrides,
  };
}

describe("store persistence", () => {
  beforeEach(() => {
    localStorage.clear();
    useCartStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
    useThemeStore.setState({ theme: "light" });
  });

  it("persists the cart contents to localStorage (Requirement 9.8)", () => {
    const product = makeProduct({ id: 5, name: "Cart Item" });
    useCartStore.getState().add(product, 2);

    // State is retained in the live store.
    expect(useCartStore.getState().items).toHaveLength(1);

    // And it is written to the named persisted storage so it survives a reload.
    const raw = localStorage.getItem("shopease-cart");
    expect(raw).toBeTruthy();

    const persisted = JSON.parse(raw as string);
    expect(persisted.state.items).toHaveLength(1);
    expect(persisted.state.items[0].product.id).toBe(5);
    expect(persisted.state.items[0].quantity).toBe(2);
  });

  it("persists the wishlist contents to localStorage (Requirement 10.6)", () => {
    const product = makeProduct({ id: 9, name: "Wished Item" });
    useWishlistStore.getState().toggle(product);

    expect(useWishlistStore.getState().has(9)).toBe(true);

    const raw = localStorage.getItem("shopease-wishlist");
    expect(raw).toBeTruthy();

    const persisted = JSON.parse(raw as string);
    expect(persisted.state.items).toHaveLength(1);
    expect(persisted.state.items[0].id).toBe(9);
  });

  it("persists the selected theme to localStorage (Requirement 15.3)", () => {
    expect(useThemeStore.getState().theme).toBe("light");

    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().theme).toBe("dark");

    const raw = localStorage.getItem("shopease-theme");
    expect(raw).toBeTruthy();

    const persisted = JSON.parse(raw as string);
    expect(persisted.state.theme).toBe("dark");
  });

  it("rehydrates persisted cart state from localStorage on remount", () => {
    // Simulate a previously-persisted cart written to localStorage (e.g. from a
    // prior browser session), then rehydrate the store from storage as a
    // reload/remount would.
    const product = makeProduct({ id: 3, name: "Rehydrated" });
    const seeded = {
      state: { items: [{ product, quantity: 4 }] },
      version: 0,
    };
    localStorage.setItem("shopease-cart", JSON.stringify(seeded));

    // Rehydrate from the persisted storage.
    useCartStore.persist.rehydrate();

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe(3);
    expect(items[0].quantity).toBe(4);
  });
});
