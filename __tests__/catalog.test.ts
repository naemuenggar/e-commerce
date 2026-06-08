import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  searchByName,
  filterProducts,
  sortProducts,
  relatedProducts,
  bestSellers,
} from "../lib/catalog";
import type { Product } from "../types";
import {
  arbCatalog,
  arbNonEmptyCatalog,
  arbAnyString,
  arbWhitespaceString,
  arbCategory,
  arbPrice,
} from "./helpers/arbitraries";

// Task 5.2–5.8 — Property tests for lib/catalog.ts domain logic.
// Validates: Requirements 3.4, 4.1, 4.2, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 8.5

/** Compare two product arrays as multisets keyed by id (catalog ids are unique). */
function sameProductMultiset(a: Product[], b: Product[]): boolean {
  if (a.length !== b.length) return false;
  const idsA = a.map((p) => p.id).sort((x, y) => x - y);
  const idsB = b.map((p) => p.id).sort((x, y) => x - y);
  return idsA.every((id, i) => id === idsB[i]);
}

describe("bestSellers (Property 3)", () => {
  // Feature: shopease, Property 3: Best seller selection is exactly the best sellers.
  it("returns exactly the products flagged isBestSeller", () => {
    fc.assert(
      fc.property(arbCatalog, (products) => {
        const result = bestSellers(products);

        // Every returned product is a best seller.
        expect(result.every((p) => p.isBestSeller === true)).toBe(true);

        // No best seller from the input is omitted.
        const expected = products.filter((p) => p.isBestSeller === true);
        expect(sameProductMultiset(result, expected)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

describe("searchByName matching (Property 4)", () => {
  // Feature: shopease, Property 4: Search returns exactly the case-insensitive name matches.
  it("returns exactly the products whose name contains the query (case-insensitive)", () => {
    fc.assert(
      fc.property(arbCatalog, arbAnyString, (products, query) => {
        const result = searchByName(products, query);
        const normalized = query.trim().toLowerCase();

        const expected =
          normalized === ""
            ? products
            : products.filter((p) =>
                p.name.toLowerCase().includes(normalized)
              );

        expect(sameProductMultiset(result, expected)).toBe(true);

        // Each result genuinely matches (when query is meaningful).
        if (normalized !== "") {
          expect(
            result.every((p) => p.name.toLowerCase().includes(normalized))
          ).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });
});

describe("empty search identity (Property 5)", () => {
  // Feature: shopease, Property 5: Empty search is identity over the input set — searchByName(products, "") and whitespace-only returns all input products.
  it("returns all input products for empty and whitespace-only queries", () => {
    fc.assert(
      fc.property(arbCatalog, arbWhitespaceString, (products, ws) => {
        const emptyResult = searchByName(products, "");
        const wsResult = searchByName(products, ws);

        expect(sameProductMultiset(emptyResult, products)).toBe(true);
        expect(sameProductMultiset(wsResult, products)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

describe("filterProducts (Property 6)", () => {
  // Feature: shopease, Property 6: Filtering returns exactly the products satisfying all criteria (filterProducts), price bounds inclusive; no criteria returns all.
  it("returns exactly the products satisfying search, category and inclusive price bounds", () => {
    const arbBounds = fc
      .tuple(arbPrice, arbPrice)
      .map(([a, b]) => (a <= b ? [a, b] : [b, a]) as [number, number]);

    fc.assert(
      fc.property(
        arbCatalog,
        arbAnyString,
        fc.option(arbCategory, { nil: null }),
        arbBounds,
        (products, query, category, [min, max]) => {
          const result = filterProducts(products, query, category, min, max);
          const normalized = query.trim().toLowerCase();

          const expected = products.filter((p) => {
            const matchesSearch =
              normalized === "" || p.name.toLowerCase().includes(normalized);
            const matchesCategory =
              category === null || p.category === category;
            const matchesPrice = p.price >= min && p.price <= max;
            return matchesSearch && matchesCategory && matchesPrice;
          });

          expect(sameProductMultiset(result, expected)).toBe(true);

          // Price bounds are inclusive: products exactly on a bound are kept.
          expect(
            result.every((p) => p.price >= min && p.price <= max)
          ).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("no criteria (empty query, null category, full price range) returns all products", () => {
    fc.assert(
      fc.property(arbCatalog, (products) => {
        const result = filterProducts(
          products,
          "",
          null,
          0,
          Number.MAX_SAFE_INTEGER
        );
        expect(sameProductMultiset(result, products)).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});

describe("comparator sorts (Property 7)", () => {
  // Feature: shopease, Property 7: Comparator sorts produce an ordered permutation (sortProducts price-asc, price-desc, rating-desc) — permutation of input, correctly ordered.
  it("price-asc, price-desc and rating-desc produce an ordered permutation of the input", () => {
    fc.assert(
      fc.property(arbCatalog, (products) => {
        const asc = sortProducts(products, "price-asc");
        const desc = sortProducts(products, "price-desc");
        const ratingDesc = sortProducts(products, "rating-desc");

        // Each result is a permutation (same multiset) of the input.
        expect(sameProductMultiset(asc, products)).toBe(true);
        expect(sameProductMultiset(desc, products)).toBe(true);
        expect(sameProductMultiset(ratingDesc, products)).toBe(true);

        // Each result is correctly ordered.
        for (let i = 1; i < asc.length; i++) {
          expect(asc[i - 1].price <= asc[i].price).toBe(true);
        }
        for (let i = 1; i < desc.length; i++) {
          expect(desc[i - 1].price >= desc[i].price).toBe(true);
        }
        for (let i = 1; i < ratingDesc.length; i++) {
          expect(ratingDesc[i - 1].rating >= ratingDesc[i].rating).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });
});

describe("newest sort partition (Property 8)", () => {
  // Feature: shopease, Property 8: Newest sort partitions new before non-new (sortProducts "newest").
  it("places all isNew products before non-new products and is a permutation", () => {
    fc.assert(
      fc.property(arbCatalog, (products) => {
        const sorted = sortProducts(products, "newest");

        // Permutation of the input.
        expect(sameProductMultiset(sorted, products)).toBe(true);

        // Once a non-new product is seen, no new product may follow.
        let seenNonNew = false;
        for (const p of sorted) {
          if (!p.isNew) {
            seenNonNew = true;
          } else {
            expect(seenNonNew).toBe(false);
          }
        }
      }),
      { numRuns: 100 }
    );
  });
});

describe("relatedProducts (Property 10)", () => {
  // Feature: shopease, Property 10: Related products share the category and exclude the product (relatedProducts).
  it("returns exactly the same-category products excluding the selected one", () => {
    fc.assert(
      fc.property(
        arbNonEmptyCatalog,
        fc.nat(),
        (products, idx) => {
          const selected = products[idx % products.length];
          const result = relatedProducts(products, selected);

          // Every related product shares the category and is not the selected.
          expect(
            result.every(
              (p) =>
                p.category === selected.category && p.id !== selected.id
            )
          ).toBe(true);

          // No qualifying product is omitted.
          const expected = products.filter(
            (p) => p.category === selected.category && p.id !== selected.id
          );
          expect(sameProductMultiset(result, expected)).toBe(true);

          // The selected product is absent from the result.
          expect(result.some((p) => p.id === selected.id)).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });
});
