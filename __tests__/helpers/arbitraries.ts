// Shared fast-check arbitraries and test helpers for ShopEase (Task 2.3).
//
// These generators back the property-based tests for the pure domain logic
// (catalog, cart, wishlist, validation, formatting). They produce realistic
// data while deliberately including the edge cases called out in the design's
// Testing Strategy: empty/whitespace strings, non-ASCII text, very large
// numbers, and out-of-range / negative quantities.
//
// _Requirements: 1.2, 1.3, 1.4_

import fc from "fast-check";
import { CATEGORIES } from "../../lib/constants";
import type { Category, Product, CartItem } from "../../types";

// ---------------------------------------------------------------------------
// String arbitraries
// ---------------------------------------------------------------------------

/**
 * A "plain" non-empty string with no surrounding whitespace. Useful for fields
 * that should hold meaningful content (e.g. product name).
 */
export const arbNonEmptyString: fc.Arbitrary<string> = fc
  .string({ minLength: 1, maxLength: 40 })
  .filter((s) => s.trim().length > 0);

/** Whitespace-only strings (spaces, tabs, newlines) including the empty string. */
export const arbWhitespaceString: fc.Arbitrary<string> = fc
  .array(fc.constantFrom(" ", "\t", "\n", "\r", "\f", "\v"), {
    minLength: 0,
    maxLength: 6,
  })
  .map((chars) => chars.join(""));

/** Strings containing non-ASCII / unicode characters (accents, CJK, emoji). */
export const arbNonAsciiString: fc.Arbitrary<string> = fc
  .array(fc.constantFrom("é", "ü", "ñ", "日", "本", "语", "🛒", "★", "Ω", "©"), {
    minLength: 1,
    maxLength: 8,
  })
  .map((chars) => chars.join(""));

/**
 * A broad string arbitrary that mixes ordinary strings with the tricky edge
 * cases (empty, whitespace-only, and non-ASCII). Use this for inputs that must
 * tolerate any string, such as search queries.
 */
export const arbAnyString: fc.Arbitrary<string> = fc.oneof(
  fc.string({ maxLength: 40 }),
  fc.constant(""),
  arbWhitespaceString,
  arbNonAsciiString,
  arbNonEmptyString
);

// ---------------------------------------------------------------------------
// Email arbitraries
// ---------------------------------------------------------------------------

/** Well-formed email addresses (delegates to fast-check's RFC-aware generator). */
export const arbValidEmail: fc.Arbitrary<string> = fc.emailAddress();

/**
 * Strings that are NOT valid email addresses: missing `@`, missing local part
 * or domain, whitespace, or empty. Useful for negative email-validation tests.
 */
export const arbInvalidEmail: fc.Arbitrary<string> = fc.oneof(
  fc.constant(""),
  arbWhitespaceString,
  fc.string({ maxLength: 20 }).filter((s) => !s.includes("@")),
  fc.string({ maxLength: 20 }).map((s) => `${s}@`),
  fc.string({ maxLength: 20 }).map((s) => `@${s}`),
  fc.constant("no-at-symbol.com"),
  fc.constant("missing@domain"),
  fc.constant("two@@at.com")
);

// ---------------------------------------------------------------------------
// Numeric / quantity arbitraries
// ---------------------------------------------------------------------------

/** A valid cart quantity: integer >= 1. */
export const arbValidQuantity: fc.Arbitrary<number> = fc.integer({
  min: 1,
  max: 1000,
});

/** A valid stock value: integer >= 0. */
export const arbStock: fc.Arbitrary<number> = fc.integer({ min: 0, max: 1000 });

/** A non-negative integer price (in Rupiah). Includes 0 and very large values. */
export const arbPrice: fc.Arbitrary<number> = fc.oneof(
  fc.integer({ min: 0, max: 100_000_000 }),
  fc.constant(0),
  fc.constant(Number.MAX_SAFE_INTEGER)
);

/** A rating in the inclusive range 0–5. */
export const arbRating: fc.Arbitrary<number> = fc.oneof(
  fc.integer({ min: 0, max: 5 }),
  fc.float({ min: 0, max: 5, noNaN: true })
);

/**
 * A quantity that may be out of range: zero, negative, or absurdly large.
 * Use this to exercise clamping / defensive logic (e.g. `clampQuantity`).
 */
export const arbAnyQuantity: fc.Arbitrary<number> = fc.oneof(
  arbValidQuantity,
  fc.constant(0),
  fc.integer({ min: -1000, max: -1 }),
  fc.constant(Number.MAX_SAFE_INTEGER),
  fc.integer({ min: 1001, max: 1_000_000 })
);

// ---------------------------------------------------------------------------
// Category arbitrary
// ---------------------------------------------------------------------------

/** A category drawn from the fixed CATEGORIES set (Requirement 1.3). */
export const arbCategory: fc.Arbitrary<Category> = fc.constantFrom(
  ...CATEGORIES
);

// ---------------------------------------------------------------------------
// Product arbitraries
// ---------------------------------------------------------------------------

/**
 * A valid Product (Requirement 1.2, 1.3):
 * - category from the fixed CATEGORIES set
 * - non-negative integer price
 * - rating in 0–5
 * - stock >= 0
 * - valid string fields
 * - boolean flags
 *
 * The `id` is generated here but should be made unique at the catalog level
 * (see `arbCatalog`).
 */
export const arbProduct: fc.Arbitrary<Product> = fc.record({
  id: fc.integer({ min: 0, max: 1_000_000 }),
  name: arbNonEmptyString,
  category: arbCategory,
  price: arbPrice,
  rating: arbRating,
  stock: arbStock,
  image: fc.webUrl(),
  description: fc.string({ maxLength: 120 }),
  isNew: fc.boolean(),
  isBestSeller: fc.boolean(),
});

/**
 * A catalog: an array of products with UNIQUE ids (Requirement 1.4).
 * Uniqueness is enforced by the product `id` field.
 */
export const arbCatalog: fc.Arbitrary<Product[]> = fc.uniqueArray(arbProduct, {
  selector: (p) => p.id,
  minLength: 0,
  maxLength: 25,
});

/** A non-empty catalog with unique ids — handy when a selected product is needed. */
export const arbNonEmptyCatalog: fc.Arbitrary<Product[]> = fc.uniqueArray(
  arbProduct,
  {
    selector: (p) => p.id,
    minLength: 1,
    maxLength: 25,
  }
);

// ---------------------------------------------------------------------------
// Cart arbitraries
// ---------------------------------------------------------------------------

/** A single CartItem: a product paired with a quantity >= 1. */
export const arbCartItem: fc.Arbitrary<CartItem> = fc.record({
  product: arbProduct,
  quantity: arbValidQuantity,
});

/**
 * A cart: an array of CartItems. Product ids are kept unique so the cart models
 * the real invariant that each product appears at most once as a line item.
 */
export const arbCart: fc.Arbitrary<CartItem[]> = fc.uniqueArray(arbCartItem, {
  selector: (item) => item.product.id,
  minLength: 0,
  maxLength: 15,
});
