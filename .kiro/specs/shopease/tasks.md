# Implementation Plan: ShopEase

## Overview

This plan converts the ShopEase design into incremental, test-driven coding tasks. The strategy is bottom-up: establish project tooling and types, build the pure domain logic in `lib/` (format, catalog, cart, wishlist, validation) with its property-based tests first, then wrap that logic in thin Zustand stores, then build reusable components, then wire everything together through the App Router pages, and finally add integration/smoke tests and the README deliverables.

All source is TypeScript (strict). Pure domain logic is implemented framework-agnostically so the 18 correctness properties can be exercised by `fast-check` independently of React. Each property test is a single `fast-check` property (minimum 100 iterations) tagged `// Feature: shopease, Property {N}: {property_text}`. Test sub-tasks are marked `*` (optional) and reference the design properties and requirements they cover.

## Tasks

- [x] 1. Initialize project, tooling, and configuration
  - [x] 1.1 Scaffold the Next.js + TypeScript + Tailwind project and dependencies
    - Create `package.json`, `tsconfig.json` (strict), `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, and `app/globals.css` (Tailwind base + light/dark theme tokens, mobile-first)
    - Add runtime deps: `zustand`, `lucide-react`, `zod`, `react-hook-form`, and a toast solution (`react-hot-toast` or custom store)
    - Add dev/test deps and `vitest.config.ts` (jsdom env): `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`
    - Add scripts: `dev`, `build`, `test` (`vitest --run`), `typecheck` (`tsc --noEmit`)
    - _Requirements: 14.1, 16.2, 17.2, 17.3_
  - [x]* 1.2 Add a tooling smoke test
    - Write a trivial Vitest test and a trivial `fast-check` property to confirm the test runner and PBT library execute in single-run mode
    - _Requirements: 16.2_

- [x] 2. Define core types and configuration constants
  - [x] 2.1 Define shared TypeScript types
    - Create `types/index.ts` with `Product`, `Category`, `CartItem`, `SortOption`, `CatalogQuery`, `OrderTotals`, `CheckoutFormValues`, `LoginValues`, `RegisterValues`
    - _Requirements: 1.2, 1.3, 7.x, 8.x, 9.x, 11.1, 12.1, 12.2_
  - [x] 2.2 Define configuration constants
    - Create `lib/constants.ts` with `CATEGORIES`, `SHIPPING_FLAT`, `DISCOUNT_DEFAULT`, `TOAST_DURATION_MS`, and breakpoint values
    - _Requirements: 1.3, 9.5, 9.6, 13.3, 14.1_
  - [x]* 2.3 Create shared fast-check arbitraries and test helpers
    - Create `__tests__/helpers/arbitraries.ts` with `arbProduct` (valid category, non-negative price, rating 0–5, stock >= 0), `arbCatalog` (unique ids), `arbCart`, and string/email/quantity arbitraries including edge cases (empty, whitespace, non-ASCII, large numbers, out-of-range quantities)
    - _Requirements: 1.2, 1.3, 1.4_

- [x] 3. Build the product catalog dataset
  - [x] 3.1 Create the product catalog JSON
    - Create `data/products.json` with at least 20 products, unique numeric ids, categories from the fixed set, and `isNew`/`isBestSeller` flags spread across entries
    - _Requirements: 1.1, 1.2, 1.3, 1.4_
  - [x]* 3.2 Write catalog data unit tests
    - Assert >= 20 entries, every entry validates against the `Product` shape, categories within the allowed set, ids unique
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 4. Implement currency formatting
  - [x] 4.1 Implement `formatRupiah`
    - Create `lib/format.ts`; produce `"Rp "` prefix with `"."` thousands separators (e.g. `formatRupiah(250000) === "Rp 250.000"`)
    - _Requirements: 1.5, 16.3_
  - [x]* 4.2 Write property test for Rupiah formatting
    - **Property 1: Rupiah formatting is well-formed and recoverable**
    - **Validates: Requirements 1.5, 16.3**

- [x] 5. Implement catalog domain logic (search, filter, sort, related, best seller)
  - [x] 5.1 Implement `lib/catalog.ts`
    - Implement `searchByName`, `filterByCategory`, `filterByPriceRange`, `filterProducts`, `sortProducts` (`price-asc`, `price-desc`, `rating-desc`, `newest`), `applyCatalogQuery`, `relatedProducts`, and a best-seller selector — all pure
    - _Requirements: 3.4, 4.1, 4.2, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 8.5_
  - [x]* 5.2 Write property test for best-seller selection
    - **Property 3: Best seller selection is exactly the best sellers**
    - **Validates: Requirements 3.4**
  - [x]* 5.3 Write property test for search matching
    - **Property 4: Search returns exactly the case-insensitive name matches**
    - **Validates: Requirements 4.1**
  - [x]* 5.4 Write property test for empty search
    - **Property 5: Empty search is identity over the input set**
    - **Validates: Requirements 4.2**
  - [x]* 5.5 Write property test for filtering
    - **Property 6: Filtering returns exactly the products satisfying all criteria** (price bounds inclusive; no criteria returns all)
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4**
  - [x]* 5.6 Write property test for comparator sorts
    - **Property 7: Comparator sorts produce an ordered permutation** (`price-asc`, `price-desc`, `rating-desc`)
    - **Validates: Requirements 7.1, 7.2, 7.3**
  - [x]* 5.7 Write property test for newest sort
    - **Property 8: Newest sort partitions new before non-new**
    - **Validates: Requirements 7.4**
  - [x]* 5.8 Write property test for related products
    - **Property 10: Related products share the category and exclude the product**
    - **Validates: Requirements 8.5**

- [x] 6. Implement cart domain logic (math and reducers)
  - [x] 6.1 Implement `lib/cart.ts`
    - Implement `addToCart`, `updateQuantity`, `removeFromCart`, `lineSubtotal`, `cartItemCount`, `computeTotals`, and `clampQuantity` — all pure
    - _Requirements: 2.5, 8.3, 8.4, 9.2, 9.3, 9.4, 9.6_
  - [x]* 6.2 Write property test for cart item count
    - **Property 2: Cart total item count equals the sum of quantities**
    - **Validates: Requirements 2.5**
  - [x]* 6.3 Write property test for quantity clamping
    - **Property 9: Quantity is clamped to the valid stock range** (in-range values returned unchanged)
    - **Validates: Requirements 8.3**
  - [x]* 6.4 Write property test for add-to-cart merge
    - **Property 11: Adding an existing product merges quantities** (no duplicate line item; new product appends one entry)
    - **Validates: Requirements 8.4, 9.2, 10.4**
  - [x]* 6.5 Write property test for cart removal
    - **Property 12: Removing a product leaves it absent**
    - **Validates: Requirements 9.4**
  - [x]* 6.6 Write property test for order totals
    - **Property 13: Order summary arithmetic is consistent** (`subtotal = Σ price*qty`; `total = subtotal + shipping - discount`)
    - **Validates: Requirements 9.3, 9.6**
  - [x]* 6.7 Write unit tests for quantity updates and line subtotal edge cases
    - Cover updating to a new quantity, zero/negative handling, and empty cart
    - _Requirements: 9.3_

- [x] 7. Implement wishlist toggle logic
  - [x] 7.1 Implement `lib/wishlist.ts`
    - Implement `toggleWishlist(wishlist, product)` (add if absent, remove if present) — pure
    - _Requirements: 10.1, 10.2, 10.4_
  - [x]* 7.2 Write property test for wishlist toggle
    - **Property 14: Wishlist toggle is an involution**
    - **Validates: Requirements 10.1, 10.2**

- [x] 8. Implement form validation logic
  - [x] 8.1 Implement `lib/validation.ts`
    - Implement `isValidEmail`, `requiredFieldErrors`, `passwordsMatch`, and Zod schemas `checkoutSchema`, `loginSchema`, `registerSchema` — all pure, never throwing
    - _Requirements: 11.1, 11.3, 11.4, 12.3, 12.4, 12.5_
  - [x]* 8.2 Write property test for required-field validation
    - **Property 15: Empty required fields produce a per-field validation error**
    - **Validates: Requirements 11.3, 12.3**
  - [x]* 8.3 Write property test for email validation
    - **Property 16: Email validation accepts valid and rejects invalid formats**
    - **Validates: Requirements 11.4, 12.4**
  - [x]* 8.4 Write property test for confirm-password validation
    - **Property 17: Confirm-password validation matches iff equal**
    - **Validates: Requirements 12.5**

- [x] 9. Checkpoint - domain logic complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Implement Zustand state stores
  - [x] 10.1 Implement `store/useCartStore.ts`
    - `items`, `add`, `updateQty`, `remove`, `clear`, `count` — delegating mutations to `lib/cart`; state survives client-side navigation within a session
    - _Requirements: 2.5, 8.4, 9.2, 9.8, 11.6_
  - [x] 10.2 Implement `store/useWishlistStore.ts`
    - `items`, `toggle`, `remove`, `has` — delegating to `lib/wishlist`; retained across navigation
    - _Requirements: 10.1, 10.2, 10.6_
  - [x] 10.3 Implement `store/useThemeStore.ts`
    - `theme`, `toggle`; retained across navigation
    - _Requirements: 15.2, 15.3_
  - [x] 10.4 Implement `store/useToastStore.ts`
    - `toasts`, `show`, `dismiss` with auto-dismiss after `TOAST_DURATION_MS`
    - _Requirements: 13.1, 13.2, 13.3_
  - [x]* 10.5 Write property test for theme toggle
    - **Property 18: Theme toggle flips and is reversible**
    - **Validates: Requirements 15.2**
  - [x]* 10.6 Write unit tests for cart, wishlist, and toast stores
    - Cover add/clear/count, toggle/has, and show/dismiss behaviors
    - _Requirements: 2.5, 9.2, 10.1, 10.2, 13.1, 13.2_

- [x] 11. Implement UI primitive components (`components/ui/`)
  - [x] 11.1 Implement `Button`, `Input`, `Modal`
    - Typed prop interfaces; `Input` exposes a `label` and `error` slot; `Modal` is an accessible overlay dialog
    - _Requirements: 16.1_
  - [x] 11.2 Implement `SkeletonCard`, `EmptyState`, `Rating`, and `Toast`
    - `Toast` reads `useToastStore`; `EmptyState` takes `title`, `message`, optional `action`
    - _Requirements: 5.4, 16.1_
  - [x]* 11.3 Write unit tests for UI primitives
    - Assert rendering, variants, error display, and modal open/close
    - _Requirements: 16.1_

- [x] 12. Implement layout components (`components/layout/`)
  - [x] 12.1 Implement `Navbar`, `MobileMenu`, and `ThemeToggle`
    - Logo, nav links (Home, Products, Categories, Cart, Wishlist), Login control, cart count badge (reads `useCartStore`), hamburger menu on mobile, theme toggle (reads `useThemeStore`)
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 15.1_
  - [x] 12.2 Implement `Footer`
    - Site footer links and info
    - _Requirements: 3.1_
  - [x]* 12.3 Write unit tests for Navbar
    - Assert links present, cart badge reflects count, hamburger toggles link visibility, theme toggle present
    - _Requirements: 2.1, 2.3, 2.4, 2.5, 15.1_

- [x] 13. Implement product display components (`components/product/`)
  - [x] 13.1 Implement `ProductCard`
    - Image, name, category, price via `formatRupiah`, rating, Add to Cart (calls cart store + toast), wishlist toggle (wishlist store + toast), link to `/product/{id}`
    - _Requirements: 1.5, 5.2, 8.4, 10.1_
  - [x] 13.2 Implement `ProductGrid`
    - Responsive wrapper arranging `ProductCard`s: 1 column mobile, 2 tablet, 3+ desktop
    - _Requirements: 5.1, 14.2, 14.3, 14.4_
  - [x] 13.3 Implement `SearchBar`, `ProductFilter`, and `ProductSort`
    - Controlled inputs emitting `value`/`onChange` to drive `applyCatalogQuery`; filter has category select, price range, and clear control; sort exposes the four sort options
    - _Requirements: 4.1, 6.1, 6.2, 6.4, 7.1, 7.2, 7.3, 7.4_
  - [x] 13.4 Implement `QuantitySelector` and `RelatedProducts`
    - `QuantitySelector` constrains values via `clampQuantity`; `RelatedProducts` renders `relatedProducts` output
    - _Requirements: 8.3, 8.5_
  - [x]* 13.5 Write component tests for product components
    - Assert `ProductCard` shows name, category, formatted price, rating, Add to Cart, wishlist control, and link target `/product/{id}`; assert grid responsive column classes and control wiring
    - _Requirements: 5.2, 5.3, 14.2, 14.3, 14.4_

- [x] 14. Implement home page components (`components/home/`)
  - [x] 14.1 Implement `Hero`, `FeaturedCategories`, `PromoBanner`, and `BestSellerSection`
    - `Hero` shows headline, subheadline, Shop Now CTA, image; `FeaturedCategories` links to `/products?category=X`; `BestSellerSection` renders only `isBestSeller` products
    - _Requirements: 3.1, 3.2, 3.4, 3.5_
  - [x]* 14.2 Write component tests for home sections
    - Assert hero elements present, all home sections render, best seller section shows only best sellers
    - _Requirements: 3.1, 3.2, 3.4_

- [x] 15. Implement cart, wishlist, checkout, and auth components
  - [x] 15.1 Implement `CartItem` and `OrderSummary` (`components/cart/`)
    - `CartItem`: image, name, unit price, quantity selector, line subtotal, remove control; `OrderSummary`: subtotal, shipping, discount, total via `computeTotals`
    - _Requirements: 9.1, 9.5_
  - [x] 15.2 Implement `WishlistItem` (`components/wishlist/`)
    - Product row with remove and Add to Cart controls
    - _Requirements: 10.3_
  - [x] 15.3 Implement `CheckoutForm` (`components/checkout/`)
    - Collect full name, email, phone, address, city, postal code, payment method (Bank Transfer / E-Wallet / Cash on Delivery); validate via Zod + React Hook Form, render inline errors, retain page on failure
    - _Requirements: 11.1, 11.3, 11.4_
  - [x] 15.4 Implement `LoginForm` and `RegisterForm` (`components/auth/`)
    - Login: email, password, remember me, forgot password link, login control; Register: full name, email, password, confirm password, register control; field-level validation messages
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  - [x]* 15.5 Write component tests for cart/checkout/auth components
    - Assert OrderSummary fields, CheckoutForm fields + payment options + email validation, and auth form fields + password-match validation
    - _Requirements: 9.5, 11.1, 12.1, 12.2_

- [x] 16. Checkpoint - components complete
  - Ensure all tests pass, ask the user if questions arise.

- [x] 17. Implement App Router pages and wire everything together
  - [x] 17.1 Implement root layout and providers
    - Create `app/layout.tsx` with a client `Providers` wrapper that initializes stores, applies the theme class to `<html>`, and renders `Navbar`, `Footer`, and the `Toast` container
    - _Requirements: 2.1, 3.1, 15.3, 16.1_
  - [x] 17.2 Implement the Home page (`app/page.tsx`)
    - Compose hero, search, featured categories, featured products, promo banner, best sellers, footer; Shop Now → `/products`; category → `/products?category=X`
    - _Requirements: 3.1, 3.2, 3.3, 3.5_
  - [x] 17.3 Implement the Product Listing page (`app/products/page.tsx`)
    - Grid + search + filter + sort driven by `applyCatalogQuery`; read `?category=` and `?q=`; skeleton while preparing; empty state when no matches
    - _Requirements: 4.1, 4.2, 4.3, 5.1, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4_
  - [x] 17.4 Implement the Product Detail page (`app/product/[id]/page.tsx`)
    - Image, name, price, rating, description, stock/shipping info, quantity selector, Add to Cart, Add to Wishlist, related products; `notFound()` for unknown id
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  - [x] 17.5 Implement the Cart page (`app/cart/page.tsx`)
    - List `CartItem`s, `OrderSummary`, empty state when cart is empty
    - _Requirements: 9.1, 9.5, 9.7_
  - [x] 17.6 Implement the Wishlist page (`app/wishlist/page.tsx`)
    - List `WishlistItem`s with remove + Add to Cart; empty state when empty
    - _Requirements: 10.3, 10.5_
  - [x] 17.7 Implement the Checkout page (`app/checkout/page.tsx`)
    - Render `CheckoutForm` + `OrderSummary`; on valid submit show "Your order has been placed successfully." and clear the cart
    - _Requirements: 11.2, 11.5, 11.6_
  - [x] 17.8 Implement the Login and Register pages (`app/login/page.tsx`, `app/register/page.tsx`)
    - Render `LoginForm` and `RegisterForm`
    - _Requirements: 12.1, 12.2_
  - [x]* 17.9 Write page-level interaction tests
    - Assert nav link hrefs, Shop Now/category navigation, card link target, empty states (no match / empty cart / empty wishlist), checkout success message + cart cleared, and toast fired on add-to-cart/wishlist
    - _Requirements: 2.2, 3.3, 3.5, 4.3, 5.3, 5.5, 9.7, 10.5, 11.5, 11.6, 13.1, 13.2_

- [x] 18. Add integration and smoke tests
  - [x]* 18.1 Write store persistence integration tests
    - Populate cart/wishlist/theme, simulate navigation/remount, assert state is retained
    - _Requirements: 9.8, 10.6, 15.3_
  - [x]* 18.2 Write toast auto-dismiss, responsive, and inventory smoke tests
    - Timer-based toast auto-dismiss; responsive grid column classes at mobile/tablet/desktop; import/existence check for all Requirement 16.1 components
    - _Requirements: 13.3, 14.1, 14.2, 14.3, 14.4, 16.1_
  - [x]* 18.3 Add TypeScript strict configuration check
    - Confirm `tsc --noEmit` passes with strict mode and that there are no `.js` source files
    - _Requirements: 16.2_

- [x] 19. Author project documentation
  - [x] 19.1 Write `README.md`
    - Include project name, description, key features, tech stack, screenshot placeholder, installation steps, local run steps, demo link placeholder, author section, Vercel deployment instructions, folder-structure explanation, and a suggested future enhancements section
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [x] 20. Final checkpoint - full verification
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test tasks and can be skipped for a faster MVP, but they back the design's correctness guarantees.
- Each of the 18 property tests is a single `fast-check` property (>= 100 iterations) tagged `// Feature: shopease, Property {N}: {property_text}` and lives in its own file under `__tests__/` for isolation and parallel execution.
- Property → module mapping: 1 → `lib/format`; 2, 9, 11, 12, 13 → `lib/cart`; 3, 4, 5, 6, 7, 8, 10 → `lib/catalog`; 14 → `lib/wishlist`; 15, 16, 17 → `lib/validation`; 18 → `store/useThemeStore`.
- ProductCard rendering (Req 5.2) is covered by a component/example test (task 13.5), per the design's Testing Strategy.
- Checkpoints (tasks 9, 16, 20) provide incremental validation breaks.
- Each task references specific requirement clauses for traceability.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["2.2", "2.3", "3.1", "4.1", "7.1"] },
    { "id": 3, "tasks": ["3.2", "4.2", "5.1", "6.1", "7.2", "8.1"] },
    { "id": 4, "tasks": ["5.2", "5.3", "5.4", "5.5", "5.6", "5.7", "5.8", "6.2", "6.3", "6.4", "6.5", "6.6", "6.7", "8.2", "8.3", "8.4"] },
    { "id": 5, "tasks": ["10.1", "10.2", "10.3", "10.4"] },
    { "id": 6, "tasks": ["10.5", "10.6", "11.1", "11.2"] },
    { "id": 7, "tasks": ["11.3", "12.1", "12.2", "13.1", "13.3", "13.4", "14.1", "15.1", "15.2", "15.3", "15.4"] },
    { "id": 8, "tasks": ["13.2", "12.3", "14.2", "15.5", "17.1"] },
    { "id": 9, "tasks": ["13.5", "17.2", "17.3", "17.4", "17.5", "17.6", "17.7", "17.8"] },
    { "id": 10, "tasks": ["17.9", "18.1", "18.2", "18.3", "19.1"] }
  ]
}
```
