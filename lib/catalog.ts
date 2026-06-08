// Catalog domain logic — pure, framework-agnostic.
// Search, filter, sort, related products, and best-seller selection.
// Source of truth: design.md "Domain Logic Interfaces".
// Requirements: 3.4, 4.1, 4.2, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 8.5

import type { CatalogQuery, Product, SortOption } from "../types";

/**
 * Filter products by a case-insensitive substring match on the product name
 * (Requirement 4.1). When the query is empty or whitespace-only, all products
 * are returned (Requirement 4.2).
 *
 * The input array is never mutated; a new array is always returned.
 *
 * @param products The products to search.
 * @param query The search text.
 * @returns Products whose name contains the query, case-insensitively.
 */
export function searchByName(products: Product[], query: string): Product[] {
  const normalized = query.trim().toLowerCase();

  if (normalized === "") {
    return [...products];
  }

  return products.filter((product) =>
    product.name.toLowerCase().includes(normalized)
  );
}

/**
 * Filter products by category (Requirement 6.1). A `null` category returns all
 * products (no category filter applied).
 *
 * The input array is never mutated; a new array is always returned.
 *
 * @param products The products to filter.
 * @param category The category to match, or `null` for no filter.
 * @returns Products whose category matches the selected category.
 */
export function filterByCategory(
  products: Product[],
  category: string | null
): Product[] {
  if (category === null) {
    return [...products];
  }

  return products.filter((product) => product.category === category);
}

/**
 * Filter products whose price falls within `[min, max]`, inclusive of both
 * bounds (Requirement 6.2).
 *
 * The input array is never mutated; a new array is always returned.
 *
 * @param products The products to filter.
 * @param min The inclusive lower price bound.
 * @param max The inclusive upper price bound.
 * @returns Products whose price is between min and max, inclusive.
 */
export function filterByPriceRange(
  products: Product[],
  min: number,
  max: number
): Product[] {
  return products.filter(
    (product) => product.price >= min && product.price <= max
  );
}

/**
 * Apply search, category, and price-range filtering in combination
 * (Requirement 6.3). Each filter is applied independently, so the result
 * contains exactly the products satisfying every active predicate.
 *
 * The input array is never mutated; a new array is always returned.
 *
 * @param products The products to filter.
 * @param query The search text.
 * @param category The category to match, or `null` for no category filter.
 * @param min The inclusive lower price bound.
 * @param max The inclusive upper price bound.
 * @returns Products satisfying the search, category, and price-range criteria.
 */
export function filterProducts(
  products: Product[],
  query: string,
  category: string | null,
  min: number,
  max: number
): Product[] {
  const bySearch = searchByName(products, query);
  const byCategory = filterByCategory(bySearch, category);
  return filterByPriceRange(byCategory, min, max);
}

/**
 * Sort products by the given option, returning a permutation of the input
 * (Requirements 7.1, 7.2, 7.3, 7.4):
 *
 * - `"price-asc"`: ascending price.
 * - `"price-desc"`: descending price.
 * - `"rating-desc"`: descending rating.
 * - `"newest"`: products with `isNew === true` appear before those with
 *   `isNew === false`.
 *
 * The input array is never mutated; a new sorted array is returned. The sort is
 * applied to a shallow copy so the same multiset of products is preserved.
 *
 * @param products The products to sort.
 * @param option The sort option to apply.
 * @returns A new array containing the same products in the requested order.
 */
export function sortProducts(
  products: Product[],
  option: SortOption
): Product[] {
  const copy = [...products];

  switch (option) {
    case "price-asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price-desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating-desc":
      return copy.sort((a, b) => b.rating - a.rating);
    case "newest":
      // `true` (new) sorts before `false` (not new). Number(isNew) maps
      // true -> 1, false -> 0, so subtract b from a for descending order.
      return copy.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    default:
      return copy;
  }
}

/**
 * Apply the combined catalog query: search + category + price range, then sort
 * (Requirements 4.1, 4.2, 6.1, 6.2, 6.3, 6.4, 7.x). When `sort` is `null`, the
 * filtered products are returned in their existing order.
 *
 * The input array is never mutated; a new array is always returned.
 *
 * @param products The products to query.
 * @param q The combined search, filter, and sort state.
 * @returns The filtered and (optionally) sorted products.
 */
export function applyCatalogQuery(
  products: Product[],
  q: CatalogQuery
): Product[] {
  const filtered = filterProducts(
    products,
    q.query,
    q.category,
    q.priceMin,
    q.priceMax
  );

  if (q.sort === null) {
    return filtered;
  }

  return sortProducts(filtered, q.sort);
}

/**
 * Select products related to the given product (Requirement 8.5): those sharing
 * the selected product's category, excluding the selected product itself by id.
 *
 * The input array is never mutated; a new array is always returned.
 *
 * @param products The catalog to search.
 * @param selected The product whose related items to find.
 * @returns Products in the same category as `selected`, excluding `selected`.
 */
export function relatedProducts(
  products: Product[],
  selected: Product
): Product[] {
  return products.filter(
    (product) =>
      product.category === selected.category && product.id !== selected.id
  );
}

/**
 * Select only the products flagged as best sellers (Requirement 3.4).
 *
 * The input array is never mutated; a new array is always returned.
 *
 * @param products The catalog to filter.
 * @returns Products whose `isBestSeller` field is `true`.
 */
export function bestSellers(products: Product[]): Product[] {
  return products.filter((product) => product.isBestSeller === true);
}
