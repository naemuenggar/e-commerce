import { describe, it, expect } from "vitest";
import fc from "fast-check";

import {
  isValidEmail,
  requiredFieldErrors,
  passwordsMatch,
  registerSchema,
} from "../lib/validation";
import {
  arbValidEmail,
  arbInvalidEmail,
  arbNonEmptyString,
  arbWhitespaceString,
} from "./helpers/arbitraries";

// Property-based tests for the form validation domain logic (Tasks 8.2–8.4).
// _Requirements: 11.3, 11.4, 12.3, 12.4, 12.5_

// ---------------------------------------------------------------------------
// Property 15 — required-field validation (Tasks 8.2)
// ---------------------------------------------------------------------------

/**
 * A single field specification: a unique name, a value "kind" (blank,
 * populated, or omitted entirely), and whether the field is required.
 */
const arbFieldSpec = fc.record({
  name: arbNonEmptyString,
  kind: fc.constantFrom("blank" as const, "populated" as const, "omitted" as const),
  blankValue: arbWhitespaceString, // includes the empty string
  populatedValue: arbNonEmptyString,
  required: fc.boolean(),
});

const arbFieldSpecs = fc.uniqueArray(arbFieldSpec, {
  selector: (f) => f.name,
  minLength: 0,
  maxLength: 10,
});

describe("requiredFieldErrors", () => {
  // Feature: shopease, Property 15: Empty required fields produce a per-field validation error — for any field-value set where a non-empty subset of required fields is blank/whitespace, requiredFieldErrors returns an error for exactly each blank required field and none for populated/non-required.
  it("returns an error for exactly each blank/missing required field and nothing else", () => {
    fc.assert(
      fc.property(arbFieldSpecs, (specs) => {
        const values: Record<string, string> = {};
        const required: string[] = [];
        const expectedErrorFields = new Set<string>();

        for (const spec of specs) {
          if (spec.required) {
            required.push(spec.name);
          }

          if (spec.kind === "populated") {
            values[spec.name] = spec.populatedValue;
          } else if (spec.kind === "blank") {
            values[spec.name] = spec.blankValue;
          }
          // "omitted": the field is intentionally absent from `values`.

          // A required field is expected to error when it is blank or missing.
          const isBlankOrMissing = spec.kind !== "populated";
          if (spec.required && isBlankOrMissing) {
            expectedErrorFields.add(spec.name);
          }
        }

        const errors = requiredFieldErrors(values, required);

        // Exactly the expected fields have errors, and each carries a message.
        // Use own-key checks throughout so field names that collide with
        // inherited Object.prototype members (e.g. "constructor") are handled.
        const errorFields = Object.keys(errors);
        expect(new Set(errorFields)).toEqual(expectedErrorFields);
        for (const field of errorFields) {
          expect(typeof errors[field]).toBe("string");
          expect(errors[field].length).toBeGreaterThan(0);
        }

        // No populated field and no non-required field is ever flagged.
        for (const spec of specs) {
          if (spec.kind === "populated" || !spec.required) {
            expect(
              Object.prototype.hasOwnProperty.call(errors, spec.name)
            ).toBe(false);
          }
        }
      }),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 16 — email validation (Task 8.3)
// ---------------------------------------------------------------------------

describe("isValidEmail", () => {
  // Feature: shopease, Property 16: Email validation accepts valid and rejects invalid formats — isValidEmail returns true for well-formed addresses and false for malformed ones.
  it("accepts well-formed email addresses", () => {
    fc.assert(
      fc.property(arbValidEmail, (email) => {
        expect(isValidEmail(email)).toBe(true);
      }),
      { numRuns: 200 }
    );
  });

  // Feature: shopease, Property 16: Email validation accepts valid and rejects invalid formats — isValidEmail returns true for well-formed addresses and false for malformed ones.
  it("rejects malformed email addresses", () => {
    fc.assert(
      fc.property(arbInvalidEmail, (email) => {
        expect(isValidEmail(email)).toBe(false);
      }),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 17 — confirm-password validation (Task 8.4)
// ---------------------------------------------------------------------------

/** A password with no surrounding whitespace (the schema trims its inputs). */
const arbTrimmedPassword = arbNonEmptyString.map((s) => s.trim()).filter((s) => s.length > 0);

/**
 * A (password, confirmPassword) pair that is biased to include both the equal
 * and unequal cases so the "iff" is exercised in both directions.
 */
const arbPasswordPair = fc.oneof(
  // Equal pair.
  arbTrimmedPassword.map((p) => [p, p] as [string, string]),
  // Possibly-unequal pair.
  fc.tuple(arbTrimmedPassword, arbTrimmedPassword)
);

describe("registerSchema confirm-password", () => {
  // Feature: shopease, Property 17: Confirm-password validation matches iff equal — registerSchema reports a confirmPassword error if and only if password !== confirmPassword.
  it("reports a confirmPassword error exactly when password and confirmPassword differ", () => {
    fc.assert(
      fc.property(
        arbNonEmptyString,
        arbValidEmail,
        arbPasswordPair,
        (fullName, email, [password, confirmPassword]) => {
          const result = registerSchema.safeParse({
            fullName,
            email,
            password,
            confirmPassword,
          });

          const hasConfirmError =
            !result.success &&
            result.error.issues.some((issue) =>
              issue.path.includes("confirmPassword")
            );

          // The mismatch error appears iff the two passwords are unequal.
          const shouldMismatch = !passwordsMatch(password, confirmPassword);
          expect(hasConfirmError).toBe(shouldMismatch);

          // When they match, the whole (otherwise valid) form parses cleanly.
          if (passwordsMatch(password, confirmPassword)) {
            expect(result.success).toBe(true);
          }
        }
      ),
      { numRuns: 200 }
    );
  });
});
