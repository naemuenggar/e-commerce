// Form validation domain logic — pure, framework-agnostic, never throwing.
// Source of truth: design.md "Domain Logic Interfaces" and "Error Handling".
// Requirements: 11.1, 11.3, 11.4, 12.3, 12.4, 12.5.

import { z } from "zod";

/**
 * Email format pattern.
 *
 * Requires a non-empty local part, a single "@", a domain with at least one
 * dot-separated label, and a top-level label of at least two characters.
 * Disallows whitespace anywhere and consecutive dots. Intentionally pragmatic
 * (not a full RFC 5322 grammar) so it accepts well-formed everyday addresses
 * and rejects obvious malformations.
 */
const EMAIL_PATTERN =
  /^[^\s@]+(?:\.[^\s@.]+)*@[^\s@.]+(?:\.[^\s@.]+)+$/;

/**
 * Return `true` only for well-formed email addresses.
 *
 * Pure and total: any string input yields a boolean, never throws.
 * Leading/trailing whitespace is not trimmed away — a value with surrounding
 * whitespace is considered malformed.
 *
 * @param value The candidate email string.
 * @returns Whether `value` matches a valid email address format.
 */
export function isValidEmail(value: string): boolean {
  if (typeof value !== "string") {
    return false;
  }

  // Guard against pathological lengths; real addresses are well under 254 chars.
  if (value.length === 0 || value.length > 254) {
    return false;
  }

  if (value.includes("..")) {
    return false;
  }

  return EMAIL_PATTERN.test(value);
}

/**
 * Produce an error entry for each required field that is empty or
 * whitespace-only.
 *
 * Pure and total. A field is considered missing when it is absent from
 * `values`, or its value trims to an empty string. Fields that are populated,
 * or that are not in the `required` list, never receive an error.
 *
 * @param values A map of field name to its current string value.
 * @param required The list of field names that must be non-empty.
 * @returns A map of field name to validation message for each empty required field.
 */
export function requiredFieldErrors(
  values: Record<string, string>,
  required: string[]
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of required) {
    const value = values[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      errors[field] = "This field is required";
    }
  }

  return errors;
}

/**
 * Return `true` if and only if the password and confirmation are identical.
 *
 * Pure, total, exact string equality (case- and whitespace-sensitive).
 *
 * @param password The password value.
 * @param confirm The confirm-password value.
 * @returns Whether the two strings are exactly equal.
 */
export function passwordsMatch(password: string, confirm: string): boolean {
  return password === confirm;
}

/**
 * Reusable non-empty (after trim) string schema for required text fields.
 */
const requiredString = (label: string) =>
  z
    .string({ required_error: `${label} is required` })
    .trim()
    .min(1, { message: `${label} is required` });

/**
 * Email schema reusing `isValidEmail` so the validation rule has a single
 * source of truth.
 */
const emailSchema = z
  .string({ required_error: "Email is required" })
  .min(1, { message: "Email is required" })
  .refine((value) => isValidEmail(value), {
    message: "Enter a valid email address",
  });

/**
 * Checkout form schema (Requirement 11.1, 11.3, 11.4).
 *
 * All fields are required and non-empty; email must be well-formed; the payment
 * method must be one of the fixed set.
 */
export const checkoutSchema = z.object({
  fullName: requiredString("Full name"),
  email: emailSchema,
  phone: requiredString("Phone"),
  address: requiredString("Address"),
  city: requiredString("City"),
  postalCode: requiredString("Postal code"),
  paymentMethod: z.enum(["Bank Transfer", "E-Wallet", "Cash on Delivery"], {
    required_error: "Select a payment method",
    invalid_type_error: "Select a payment method",
  }),
});

/**
 * Login form schema (Requirement 12.3, 12.4).
 *
 * Email must be valid and password is required.
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: requiredString("Password"),
});

/**
 * Register form schema (Requirement 12.3, 12.4, 12.5).
 *
 * Full name, email, password, and confirm password are required; email must be
 * valid; confirm password must equal password.
 */
export const registerSchema = z
  .object({
    fullName: requiredString("Full name"),
    email: emailSchema,
    password: requiredString("Password"),
    confirmPassword: requiredString("Confirm password"),
  })
  .refine((data) => passwordsMatch(data.password, data.confirmPassword), {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Inferred types for the schemas, useful for form integration.
 */
export type CheckoutSchemaValues = z.infer<typeof checkoutSchema>;
export type LoginSchemaValues = z.infer<typeof loginSchema>;
export type RegisterSchemaValues = z.infer<typeof registerSchema>;
