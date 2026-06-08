import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

import { Hero } from "../components/home/Hero";
import { FeaturedCategories } from "../components/home/FeaturedCategories";
import { PromoBanner } from "../components/home/PromoBanner";
import { BestSellerSection } from "../components/home/BestSellerSection";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import type { Product } from "../types";

// Component tests for home page sections (Task 14.2).
// _Requirements: 3.1, 3.2, 3.4_

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

describe("Hero", () => {
  it("renders the headline and subheadline", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /shop smarter/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/discover curated fashion/i)).toBeInTheDocument();
  });

  it("renders a Shop Now CTA linking to /products", () => {
    render(<Hero />);
    const cta = screen.getByRole("link", { name: /shop now/i });
    expect(cta).toHaveAttribute("href", "/products");
    expect(cta).toHaveTextContent("Shop Now");
  });
});

describe("home sections render", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
  });

  it("renders FeaturedCategories", () => {
    render(<FeaturedCategories />);
    expect(
      screen.getByRole("heading", { name: /shop by category/i }),
    ).toBeInTheDocument();
  });

  it("renders the PromoBanner", () => {
    render(<PromoBanner />);
    expect(
      screen.getByRole("heading", { name: /up to 50% off storewide/i }),
    ).toBeInTheDocument();
  });

  it("renders the BestSellerSection heading when best sellers exist", () => {
    render(
      <BestSellerSection
        products={[makeProduct({ id: 1, isBestSeller: true })]}
      />,
    );
    expect(
      screen.getByRole("heading", { name: /best sellers/i }),
    ).toBeInTheDocument();
  });
});

describe("BestSellerSection filtering", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
  });

  it("shows only products flagged isBestSeller", () => {
    const products: Product[] = [
      makeProduct({ id: 1, name: "Best One", isBestSeller: true }),
      makeProduct({ id: 2, name: "Regular Two", isBestSeller: false }),
      makeProduct({ id: 3, name: "Best Three", isBestSeller: true }),
    ];

    render(<BestSellerSection products={products} />);

    expect(screen.getByText("Best One")).toBeInTheDocument();
    expect(screen.getByText("Best Three")).toBeInTheDocument();
    expect(screen.queryByText("Regular Two")).not.toBeInTheDocument();
  });

  it("renders nothing when there are no best sellers", () => {
    const { container } = render(
      <BestSellerSection
        products={[makeProduct({ id: 1, isBestSeller: false })]}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
