// Shared TypeScript types for ShopEase
// Source of truth: design.md "Data Models" and "Domain Logic Interfaces" sections.

/**
 * The fixed set of product categories (Requirement 1.3).
 */
export type Category =
  | "Fashion"
  | "Electronics"
  | "Shoes"
  | "Accessories"
  | "Beauty"
  | "Home Living";

/**
 * A single catalog item (Requirement 1.2).
 */
export interface Product {
  id: number; // unique (Requirement 1.4)
  name: string;
  category: Category; // one of the fixed set (Requirement 1.3)
  price: number; // in Rupiah, integer
  rating: number; // 0–5
  stock: number; // >= 0
  image: string; // path/URL
  description: string;
  isNew: boolean;
  isBestSeller: boolean;
}

/**
 * A single entry in the Cart (Requirement 9).
 */
export interface CartItem {
  product: Product;
  quantity: number; // >= 1
}

/**
 * Sort options for the Product_Listing_Page (Requirement 7.x).
 */
export type SortOption = "price-asc" | "price-desc" | "rating-desc" | "newest";

/**
 * The combined search + filter + sort state driving the Product_Listing_Page.
 */
export interface CatalogQuery {
  query: string;
  category: string | null;
  priceMin: number;
  priceMax: number;
  sort: SortOption | null;
}

/**
 * Order summary amounts (Requirement 9.5, 9.6).
 */
export interface OrderTotals {
  subtotal: number; // sum of line subtotals
  shipping: number; // flat config value
  discount: number; // config / promo value
  total: number; // subtotal + shipping - discount
}

/**
 * Checkout form fields (Requirement 11.1).
 */
export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: "Bank Transfer" | "E-Wallet" | "Cash on Delivery";
}

/**
 * Login screen values (Requirement 12.1).
 */
export interface LoginValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Register screen values (Requirement 12.2).
 */
export interface RegisterValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
