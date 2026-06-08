import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Navbar } from "../components/layout/Navbar";
import { useCartStore } from "../store/useCartStore";
import type { Product } from "../types";

// Component tests for the Navbar (Task 12.3).
// _Requirements: 2.1, 2.3, 2.4, 2.5, 15.1_

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

describe("Navbar", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("shows the primary nav links", () => {
    render(<Navbar />);
    const nav = screen.getByRole("navigation", { name: /primary/i });

    for (const label of ["Home", "Products", "Categories", "Cart", "Wishlist"]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("shows a Login control", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "Login" })).toBeInTheDocument();
  });

  it("renders the theme toggle", () => {
    render(<Navbar />);
    // ThemeToggle exposes an accessible label for the active theme action.
    expect(
      screen.getByRole("button", { name: /switch to (light|dark) theme/i }),
    ).toBeInTheDocument();
  });

  it("reflects the cart count in the badge after adding an item", () => {
    useCartStore.getState().add(makeProduct(), 3);
    render(<Navbar />);

    expect(screen.getByLabelText("3 items in cart")).toHaveTextContent("3");
  });

  it("does not render a cart badge when the cart is empty", () => {
    render(<Navbar />);
    expect(screen.queryByLabelText(/items in cart/)).not.toBeInTheDocument();
  });

  it("toggles the MobileMenu visibility via the hamburger button", async () => {
    const user = userEvent.setup();
    render(<Navbar />);

    // Mobile menu is hidden initially.
    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      screen.getByRole("navigation", { name: /mobile/i }),
    ).toBeInTheDocument();

    // Closing it via the close button hides it again.
    await user.click(screen.getByRole("button", { name: "Close menu" }));
    expect(
      screen.queryByRole("navigation", { name: /mobile/i }),
    ).not.toBeInTheDocument();
  });
});
