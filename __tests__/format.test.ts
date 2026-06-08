import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { formatRupiah } from "../lib/format";

// Task 4.2 — Property test for Rupiah formatting.
// Module under test: lib/format.ts (formatRupiah).
// Validates: Requirements 1.5, 16.3

describe("formatRupiah (Property 1)", () => {
  // A non-negative integer arbitrary including 0, small, and very large values.
  const arbAmount = fc.oneof(
    fc.integer({ min: 0, max: 100_000_000 }),
    fc.constant(0),
    fc.constant(Number.MAX_SAFE_INTEGER)
  );

  // Feature: shopease, Property 1: Rupiah formatting is well-formed and recoverable. For any non-negative integer amount, formatRupiah(amount) begins with "Rp ", uses "." only as thousands separator grouping digits in threes, and removing "Rp " prefix and all "." recovers the original amount.
  it("is well-formed (Rp prefix, dotted thirds grouping) and recoverable", () => {
    fc.assert(
      fc.property(arbAmount, (amount) => {
        const formatted = formatRupiah(amount);

        // 1. Begins with "Rp ".
        expect(formatted.startsWith("Rp ")).toBe(true);

        // 2. The numeric portion contains only digits and "." separators.
        const numeric = formatted.slice("Rp ".length);
        expect(/^[0-9]{1,3}(\.[0-9]{3})*$/.test(numeric)).toBe(true);

        // 3. "." groups digits in threes from the right: every group except the
        //    leading one has exactly three digits, and the leading group has 1-3.
        const groups = numeric.split(".");
        groups.slice(1).forEach((g) => expect(g.length).toBe(3));
        expect(groups[0].length).toBeGreaterThanOrEqual(1);
        expect(groups[0].length).toBeLessThanOrEqual(3);

        // 4. Removing the "Rp " prefix and all "." recovers the original amount.
        const recovered = Number(numeric.replace(/\./g, ""));
        expect(recovered).toBe(amount);
      }),
      { numRuns: 200 }
    );
  });

  it("formats known examples correctly (unit checks)", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
    expect(formatRupiah(1500)).toBe("Rp 1.500");
    expect(formatRupiah(250000)).toBe("Rp 250.000");
    expect(formatRupiah(1000000)).toBe("Rp 1.000.000");
    expect(formatRupiah(999)).toBe("Rp 999");
  });
});
