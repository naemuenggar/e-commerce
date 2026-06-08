// Configuration constants for ShopEase
// Source of truth: design.md "Configuration Constants" section.

import type { Category } from "../types";

/**
 * The fixed set of product categories (Requirement 1.3).
 * Used to populate category filters and featured category sections.
 */
export const CATEGORIES: Category[] = [
  "Fashion",
  "Electronics",
  "Shoes",
  "Accessories",
  "Beauty",
  "Home Living",
];

/**
 * Flat shipping amount in Rupiah applied to the order summary (Requirement 9.5, 9.6).
 * Rp 20.000 flat shipping.
 */
export const SHIPPING_FLAT = 20000;

/**
 * Default promo discount applied to the order summary (Requirement 9.5, 9.6).
 * Defaults to none.
 */
export const DISCOUNT_DEFAULT = 0;

/**
 * Duration, in milliseconds, a Toast_Notification is displayed before it is
 * automatically dismissed (Requirement 13.3).
 */
export const TOAST_DURATION_MS = 3000;

/**
 * Responsive layout breakpoints, in pixels (Requirement 14.1).
 *
 * Mobile-first ranges that drive the Product_Grid column counts:
 * - mobile:  width < 640        -> 1 column  (Requirement 14.2)
 * - tablet:  640 <= width < 1024 -> 2 columns (Requirement 14.3)
 * - desktop: width >= 1024       -> 3+ columns (Requirement 14.4)
 *
 * Values align with Tailwind's default `sm` (640) and `lg` (1024) breakpoints.
 */
export const BREAKPOINTS = {
  /** Tablet range starts at this width (Tailwind `sm`). */
  tablet: 640,
  /** Desktop range starts at this width (Tailwind `lg`). */
  desktop: 1024,
} as const;
