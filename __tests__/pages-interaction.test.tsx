import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Page-level interaction tests (Task 17.9).
//
// Covers representative page behaviors: empty states for the cart and wishlist
// pages, the checkout success flow (success message + cart cleared), the
// add-to-cart toast firing from a ProductCard, and the ProductCard detail link
// target.
//
// _Requirements: 2.2, 3.3, 3.5, 4.3, 5.3, 5.5, 9.7, 10.5, 11.5, 11.6, 13.1,
//                13.2_

// Mock next/navigation so client pages/components that depend on routing render
// without a real Next.js runtime.
const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  notFound: vi.fn(),
}));

import CartPage from "../app/cart/page";
import WishlistPage from "../app/wishlist/page";
import CheckoutPage from "../app/checkout/page";
import { ProductCard } from "../components/product/ProductCard";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { useToastStore } from "../store/useToastStore";
import type { Product } from "../types";

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 1,
    name: "Interactive Product",
    category: "Fashion",
    price: 120000,
    rating: 4.5,
    stock: 10,
    image: "https://example.com/p.jpg",
    description: "An interactive product",
    isNew: false,
    isBestSeller: false,
    ...overrides,
  };
}

beforeEach(() => {
  pushMock.mockClear();
  localStorage.clear();
  useCartStore.setState({ items: [] });
  useWishlistStore.setState({ items: [] });
  useToastStore.setState({ toasts: [] });
});

describe("Cart page", () => {
  it("shows the empty state when the cart is empty (Requirement 9.7)", async () => {
    render(<CartPage />);

    // The empty-state content is gated behind a mount effect.
    expect(await screen.findByText(/your cart is empty/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continue shopping/i }),
    ).toHaveAttribute("href", "/products");
  });
});

describe("Wishlist page", () => {
  it("shows the empty state when the wishlist is empty (Requirement 10.5)", async () => {
    render(<WishlistPage />);

    expect(
      await screen.findByText(/your wishlist is empty/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /continue shopping/i }),
    ).toHaveAttribute("href", "/products");
  });
});

describe("Checkout page", () => {
  it("shows the success message and clears the cart on valid submit (Requirements 11.5, 11.6)", async () => {
    const user = userEvent.setup();

    // Seed the cart so we can assert it gets cleared on success.
    useCartStore.getState().add(makeProduct({ id: 1 }), 2);
    expect(useCartStore.getState().items).toHaveLength(1);

    render(<CheckoutPage />);

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Phone"), "08123456789");
    await user.type(screen.getByLabelText("Address"), "123 Main Street");
    await user.type(screen.getByLabelText("City"), "Jakarta");
    await user.type(screen.getByLabelText("Postal code"), "12345");
    await user.click(screen.getByLabelText("Bank Transfer"));

    await user.click(screen.getByRole("button", { name: /place order/i }));

    // Success message appears in the modal (Requirement 11.5).
    expect(
      await screen.findByText("Your order has been placed successfully."),
    ).toBeInTheDocument();

    // Cart has been cleared (Requirement 11.6).
    expect(useCartStore.getState().items).toEqual([]);
  });

  it("does not show the success message when required fields are empty (Requirement 11.3)", async () => {
    const user = userEvent.setup();
    render(<CheckoutPage />);

    await user.click(screen.getByRole("button", { name: /place order/i }));

    expect(
      screen.queryByText("Your order has been placed successfully."),
    ).not.toBeInTheDocument();
  });
});

describe("ProductCard interactions", () => {
  it("fires a toast when adding to cart (Requirement 13.1)", async () => {
    const user = userEvent.setup();
    const product = makeProduct({ id: 2, name: "Toasty" });
    render(<ProductCard product={product} />);

    expect(useToastStore.getState().toasts).toHaveLength(0);

    await user.click(
      screen.getByRole("button", { name: /add toasty to cart/i }),
    );

    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toMatch(/toasty added to cart/i);
    // And the product is actually added to the cart.
    expect(useCartStore.getState().count()).toBe(1);
  });

  it("fires a toast when toggling the wishlist (Requirement 13.2)", async () => {
    const user = userEvent.setup();
    const product = makeProduct({ id: 3, name: "Likeable" });
    render(<ProductCard product={product} />);

    await user.click(
      screen.getByRole("button", { name: /add likeable to wishlist/i }),
    );

    const { toasts } = useToastStore.getState();
    expect(toasts).toHaveLength(1);
    expect(toasts[0].message).toMatch(/likeable added to wishlist/i);
    expect(useWishlistStore.getState().has(3)).toBe(true);
  });

  it("links to the product detail page /product/{id} (Requirement 5.3)", () => {
    const product = makeProduct({ id: 42 });
    render(<ProductCard product={product} />);

    const detailLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/product/42");
    expect(detailLinks.length).toBeGreaterThan(0);
  });
});
