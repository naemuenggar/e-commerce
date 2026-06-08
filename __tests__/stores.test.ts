import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useToastStore } from "../store/useToastStore";
import { TOAST_DURATION_MS } from "../lib/constants";
import type { Product } from "../types";

// Example unit tests for the Zustand stores (Task 10.6).
// _Requirements: 2.5, 9.2, 10.1, 10.2, 13.1, 13.2_

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: "Test Product",
    category: "Fashion",
    price: 50000,
    rating: 4.5,
    stock: 10,
    image: "https://example.com/p.jpg",
    description: "A test product",
    isNew: false,
    isBestSeller: false,
    ...overrides,
  };
}

describe("useCartStore", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("adds a product as a new line item", () => {
    const product = makeProduct();
    useCartStore.getState().add(product, 2);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].product.id).toBe(product.id);
    expect(items[0].quantity).toBe(2);
  });

  it("merges quantity when adding an existing product (Requirement 9.2)", () => {
    const product = makeProduct();
    useCartStore.getState().add(product, 2);
    useCartStore.getState().add(product, 3);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(5);
  });

  it("count is the sum of all line quantities (Requirement 2.5)", () => {
    const a = makeProduct({ id: 1 });
    const b = makeProduct({ id: 2 });
    useCartStore.getState().add(a, 2);
    useCartStore.getState().add(b, 4);

    expect(useCartStore.getState().count()).toBe(6);
  });

  it("count is 0 for an empty cart", () => {
    expect(useCartStore.getState().count()).toBe(0);
  });

  it("clear empties the cart", () => {
    useCartStore.getState().add(makeProduct({ id: 1 }), 2);
    useCartStore.getState().add(makeProduct({ id: 2 }), 1);

    useCartStore.getState().clear();

    expect(useCartStore.getState().items).toEqual([]);
    expect(useCartStore.getState().count()).toBe(0);
  });
});

describe("useWishlistStore", () => {
  beforeEach(() => {
    useWishlistStore.setState({ items: [] });
  });

  it("toggle adds a product when absent (Requirement 10.1)", () => {
    const product = makeProduct();
    useWishlistStore.getState().toggle(product);

    const { items } = useWishlistStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe(product.id);
  });

  it("toggle removes a product when already present (Requirement 10.2)", () => {
    const product = makeProduct();
    useWishlistStore.getState().toggle(product);
    useWishlistStore.getState().toggle(product);

    expect(useWishlistStore.getState().items).toEqual([]);
  });

  it("has() reflects membership", () => {
    const product = makeProduct({ id: 42 });
    expect(useWishlistStore.getState().has(42)).toBe(false);

    useWishlistStore.getState().toggle(product);
    expect(useWishlistStore.getState().has(42)).toBe(true);

    useWishlistStore.getState().toggle(product);
    expect(useWishlistStore.getState().has(42)).toBe(false);
  });
});

describe("useToastStore", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("show adds a toast (Requirement 13.1)", () => {
    useToastStore.getState().show("Added to cart", "success");

    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Added to cart");
    expect(toasts[0].type).toBe("success");
    expect(toasts[0].id).toBeTruthy();
  });

  it("defaults the toast type to info", () => {
    useToastStore.getState().show("Heads up");
    expect(useToastStore.getState().toasts[0].type).toBe("info");
  });

  it("dismiss removes a toast by id (Requirement 13.2)", () => {
    useToastStore.getState().show("First");
    useToastStore.getState().show("Second");
    const [first] = useToastStore.getState().toasts;

    useToastStore.getState().dismiss(first.id);

    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toBe("Second");
  });

  it("auto-dismisses a toast after TOAST_DURATION_MS", () => {
    vi.useFakeTimers();

    useToastStore.getState().show("Temporary");
    expect(useToastStore.getState().toasts).toHaveLength(1);

    // Just before the duration elapses the toast is still present.
    vi.advanceTimersByTime(TOAST_DURATION_MS - 1);
    expect(useToastStore.getState().toasts).toHaveLength(1);

    // Once the full duration passes it is auto-dismissed.
    vi.advanceTimersByTime(1);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
