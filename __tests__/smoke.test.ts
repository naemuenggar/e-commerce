import { describe, it, expect } from "vitest";
import fc from "fast-check";

// Tooling smoke test (Task 1.2): confirms the Vitest runner and the fast-check
// property-based testing library both execute correctly in single-run mode.
// _Requirements: 16.2_
describe("tooling smoke test", () => {
  it("runs a plain Vitest assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("runs a fast-check property (integer addition is commutative)", () => {
    fc.assert(
      fc.property(fc.integer(), fc.integer(), (a, b) => {
        return a + b === b + a;
      }),
      { numRuns: 100 }
    );
  });
});
