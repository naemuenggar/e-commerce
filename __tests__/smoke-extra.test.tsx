import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";

import { useToastStore } from "../store/useToastStore";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { TOAST_DURATION_MS } from "../lib/constants";
import { ProductGrid } from "../components/product/ProductGrid";
import type { Product } from "../types";

// Smoke tests (Task 18.2): toast auto-dismiss timing, responsive grid column
// classes, and a component inventory existence check.
// _Requirements: 13.3, 14.1, 14.2, 14.3, 14.4, 16.1_

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: "Smoke Product",
    category: "Fashion",
    price: 50000,
    rating: 4,
    stock: 10,
    image: "https://example.com/p.jpg",
    description: "A smoke-test product",
    isNew: false,
    isBestSeller: false,
    ...overrides,
  };
}

describe("toast auto-dismiss (Requirement 13.3)", () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("removes a toast after TOAST_DURATION_MS elapses", () => {
    vi.useFakeTimers();

    useToastStore.getState().show("Added to cart", "success");
    expect(useToastStore.getState().toasts).toHaveLength(1);

    // Still present just before the configured duration.
    vi.advanceTimersByTime(TOAST_DURATION_MS - 1);
    expect(useToastStore.getState().toasts).toHaveLength(1);

    // Auto-dismissed once the full duration passes.
    vi.advanceTimersByTime(1);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});

describe("responsive product grid (Requirements 14.1-14.4)", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
  });

  it("applies mobile/tablet/desktop responsive column classes", () => {
    const { container } = render(
      <ProductGrid products={[makeProduct({ id: 1 })]} />,
    );
    const grid = container.firstElementChild as HTMLElement;

    // 1 column on mobile, 2 on tablet (sm), 3 on desktop (lg).
    expect(grid.className).toContain("grid-cols-1");
    expect(grid.className).toContain("sm:grid-cols-2");
    expect(grid.className).toContain("lg:grid-cols-3");
  });
});

describe("reusable component inventory (Requirement 16.1)", () => {
  it("exposes all 16 required reusable components as defined modules", async () => {
    const [
      { Navbar },
      { Footer },
      { Hero },
      { ProductCard },
      { ProductGrid: Grid },
      { ProductFilter },
      { ProductSort },
      { SearchBar },
      { CartItem },
      { WishlistItem },
      { CheckoutForm },
      { Button },
      { Input },
      { Modal },
      { SkeletonCard },
      { EmptyState },
    ] = await Promise.all([
      import("../components/layout/Navbar"),
      import("../components/layout/Footer"),
      import("../components/home/Hero"),
      import("../components/product/ProductCard"),
      import("../components/product/ProductGrid"),
      import("../components/product/ProductFilter"),
      import("../components/product/ProductSort"),
      import("../components/product/SearchBar"),
      import("../components/cart/CartItem"),
      import("../components/wishlist/WishlistItem"),
      import("../components/checkout/CheckoutForm"),
      import("../components/ui/Button"),
      import("../components/ui/Input"),
      import("../components/ui/Modal"),
      import("../components/ui/SkeletonCard"),
      import("../components/ui/EmptyState"),
    ]);

    const inventory: Record<string, unknown> = {
      Navbar,
      Footer,
      Hero,
      ProductCard,
      ProductGrid: Grid,
      ProductFilter,
      ProductSort,
      SearchBar,
      CartItem,
      WishlistItem,
      CheckoutForm,
      Button,
      Input,
      Modal,
      SkeletonCard,
      EmptyState,
    };

    expect(Object.keys(inventory)).toHaveLength(16);

    for (const [name, component] of Object.entries(inventory)) {
      // React components are either functions or, for forwardRef/memo
      // components (Button, Input), objects. Either way they must be defined.
      expect(component, `${name} should be defined`).toBeTruthy();
      expect(
        ["function", "object"].includes(typeof component),
        `${name} should be a function or object`,
      ).toBe(true);
    }
  });
});
