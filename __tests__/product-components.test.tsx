import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";

import { ProductCard } from "../components/product/ProductCard";
import { ProductGrid } from "../components/product/ProductGrid";
import { useCartStore } from "../store/useCartStore";
import { useWishlistStore } from "../store/useWishlistStore";
import { formatRupiah } from "../lib/format";
import type { Product } from "../types";

// Component tests for product display components (Task 13.5).
// _Requirements: 5.2, 5.3, 14.2, 14.3, 14.4_

function makeProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 7,
    name: "Classic Sneakers",
    category: "Shoes",
    price: 250000,
    rating: 4,
    stock: 12,
    image: "https://example.com/sneakers.jpg",
    description: "Comfortable everyday sneakers",
    isNew: false,
    isBestSeller: false,
    ...overrides,
  };
}

describe("ProductCard", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
  });

  it("renders the product name", () => {
    render(<ProductCard product={makeProduct()} />);
    expect(screen.getByText("Classic Sneakers")).toBeInTheDocument();
  });

  it("renders the category", () => {
    render(<ProductCard product={makeProduct()} />);
    expect(screen.getByText("Shoes")).toBeInTheDocument();
  });

  it("renders the price formatted with formatRupiah", () => {
    render(<ProductCard product={makeProduct({ price: 250000 })} />);
    expect(screen.getByText(formatRupiah(250000))).toBeInTheDocument();
    expect(screen.getByText("Rp 250.000")).toBeInTheDocument();
  });

  it("renders the rating", () => {
    render(<ProductCard product={makeProduct({ rating: 4 })} />);
    expect(
      screen.getByRole("img", { name: /rating: 4 out of 5 stars/i }),
    ).toBeInTheDocument();
  });

  it("renders an Add to Cart control", () => {
    render(<ProductCard product={makeProduct()} />);
    expect(
      screen.getByRole("button", { name: /add classic sneakers to cart/i }),
    ).toBeInTheDocument();
  });

  it("renders a wishlist control", () => {
    render(<ProductCard product={makeProduct()} />);
    expect(
      screen.getByRole("button", { name: /add classic sneakers to wishlist/i }),
    ).toBeInTheDocument();
  });

  it("links to the product detail page /product/{id}", () => {
    render(<ProductCard product={makeProduct({ id: 7 })} />);
    const links = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === "/product/7");
    expect(links.length).toBeGreaterThan(0);
  });
});

describe("ProductGrid", () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
    useWishlistStore.setState({ items: [] });
  });

  it("applies the responsive column classes", () => {
    const { container } = render(
      <ProductGrid products={[makeProduct({ id: 1 })]} />,
    );
    const grid = container.firstElementChild as HTMLElement;
    expect(grid.className).toContain("grid-cols-1");
    expect(grid.className).toContain("sm:grid-cols-2");
    expect(grid.className).toContain("lg:grid-cols-3");
  });

  it("renders one card per product", () => {
    const products = [
      makeProduct({ id: 1, name: "Product One" }),
      makeProduct({ id: 2, name: "Product Two" }),
      makeProduct({ id: 3, name: "Product Three" }),
    ];
    render(<ProductGrid products={products} />);

    expect(screen.getByText("Product One")).toBeInTheDocument();
    expect(screen.getByText("Product Two")).toBeInTheDocument();
    expect(screen.getByText("Product Three")).toBeInTheDocument();

    // One detail link per product (the image link), matched by href.
    expect(
      screen.getAllByRole("link").filter((link) =>
        /^\/product\/\d+$/.test(link.getAttribute("href") ?? ""),
      ).length,
    ).toBeGreaterThanOrEqual(products.length);
  });

  it("renders an empty grid without errors when there are no products", () => {
    const { container } = render(<ProductGrid products={[]} />);
    const grid = container.firstElementChild as HTMLElement;
    expect(within(grid).queryAllByRole("link")).toHaveLength(0);
  });
});
