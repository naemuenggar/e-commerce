// Currency formatting for ShopEase (Requirements 1.5, 16.3).
// Pure, framework-agnostic logic — the target of Property 1 (PBT).

/**
 * Format a monetary amount as Indonesian Rupiah.
 *
 * Produces a string with a `"Rp "` prefix and `"."` as the thousands
 * separator, grouping digits in threes.
 *
 * @example
 * formatRupiah(250000) === "Rp 250.000"
 * formatRupiah(0)      === "Rp 0"
 * formatRupiah(1500)   === "Rp 1.500"
 *
 * @param amount A non-negative integer amount in Rupiah.
 * @returns The formatted Rupiah string.
 */
export function formatRupiah(amount: number): string {
  // Normalize to a non-negative integer so formatting stays deterministic
  // for the digit-grouping contract exercised by Property 1.
  const normalized = Math.max(0, Math.trunc(amount));

  const digits = normalized.toString();

  // Insert "." every three digits from the right.
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `Rp ${grouped}`;
}
