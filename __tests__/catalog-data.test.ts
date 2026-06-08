import { describe, it, expect } from "vitest";
import products from "../data/products.json";
import { CATEGORIES } from "../lib/constants";

// Task 3.2 — Example unit tests for the product catalog dataset.
// Validates: Requirements 1.1, 1.2, 1.3, 1.4

const ALLOWED_CATEGORIES = new Set<string>(CATEGORIES);

describe("products.json catalog dataset", () => {
  it("contains at least 20 entries (Requirement 1.1)", () => {
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThanOrEqual(20);
  });

  it("has every entry matching the Product shape with correct types (Requirement 1.2)", () => {
    for (const p of products as unknown[]) {
      expect(p).toBeTypeOf("object");
      const product = p as Record<string, unknown>;

      // All 10 fields present with correct types.
      expect(product.id).toBeTypeOf("number");
      expect(Number.isInteger(product.id)).toBe(true);

      expect(product.name).toBeTypeOf("string");
      expect((product.name as string).length).toBeGreaterThan(0);

      expect(product.category).toBeTypeOf("string");

      expect(product.price).toBeTypeOf("number");
      expect(Number.isInteger(product.price)).toBe(true);
      expect(product.price as number).toBeGreaterThanOrEqual(0);

      expect(product.rating).toBeTypeOf("number");
      expect(product.rating as number).toBeGreaterThanOrEqual(0);
      expect(product.rating as number).toBeLessThanOrEqual(5);

      expect(product.stock).toBeTypeOf("number");
      expect(Number.isInteger(product.stock)).toBe(true);
      expect(product.stock as number).toBeGreaterThanOrEqual(0);

      expect(product.image).toBeTypeOf("string");
      expect((product.image as string).length).toBeGreaterThan(0);

      expect(product.description).toBeTypeOf("string");

      expect(product.isNew).toBeTypeOf("boolean");
      expect(product.isBestSeller).toBeTypeOf("boolean");

      // Exactly the 10 expected keys, no extras.
      expect(Object.keys(product).sort()).toEqual(
        [
          "category",
          "description",
          "id",
          "image",
          "isBestSeller",
          "isNew",
          "name",
          "price",
          "rating",
          "stock",
        ].sort()
      );
    }
  });

  it("has categories within the fixed allowed set (Requirement 1.3)", () => {
    for (const p of products) {
      expect(ALLOWED_CATEGORIES.has(p.category)).toBe(true);
    }
  });

  it("has unique ids (Requirement 1.4)", () => {
    const ids = products.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
