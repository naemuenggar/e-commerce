import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OrderSummary } from "../components/cart/OrderSummary";
import { CheckoutForm } from "../components/checkout/CheckoutForm";
import { LoginForm } from "../components/auth/LoginForm";
import { RegisterForm } from "../components/auth/RegisterForm";
import { useCartStore } from "../store/useCartStore";
import type { CartItem, Product } from "../types";

// Component tests for cart/checkout/auth components (Task 15.5).
// _Requirements: 9.5, 11.1, 12.1, 12.2_

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

function makeCartItem(overrides: Partial<Product> = {}, quantity = 1): CartItem {
  return { product: makeProduct(overrides), quantity };
}

describe("OrderSummary", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  it("renders the Subtotal, Shipping, Discount, and Total labels", () => {
    render(<OrderSummary items={[makeCartItem({ price: 50000 }, 2)]} />);

    expect(screen.getByText("Subtotal")).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("Discount")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
  });
});

describe("CheckoutForm", () => {
  it("renders all input fields", () => {
    render(<CheckoutForm />);

    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByLabelText("City")).toBeInTheDocument();
    expect(screen.getByLabelText("Postal code")).toBeInTheDocument();
  });

  it("renders the three payment options", () => {
    render(<CheckoutForm />);
    expect(screen.getByRole("radio", { name: "Bank Transfer" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "E-Wallet" })).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Cash on Delivery" }),
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CheckoutForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /place order/i }));

    const errors = await screen.findAllByRole("alert");
    expect(errors.length).toBeGreaterThan(0);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("shows an email error for an invalid email", async () => {
    const user = userEvent.setup();
    render(<CheckoutForm />);

    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.click(screen.getByRole("button", { name: /place order/i }));

    expect(await screen.findByText(/valid email address/i)).toBeInTheDocument();
  });
});

describe("LoginForm", () => {
  it("renders the email and password fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });
});

describe("RegisterForm", () => {
  it("renders all of its fields", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Register" })).toBeInTheDocument();
  });

  it("shows a confirm-password mismatch error on submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<RegisterForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Full name"), "Jane Doe");
    await user.type(screen.getByLabelText("Email"), "jane@example.com");
    await user.type(screen.getByLabelText("Password"), "secret123");
    await user.type(screen.getByLabelText("Confirm password"), "different456");

    await user.click(screen.getByRole("button", { name: "Register" }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
