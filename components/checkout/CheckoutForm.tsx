"use client";

// CheckoutForm (Task 15.3)
// Source of truth: design.md "Checkout_Page" / "Domain Logic Interfaces".
// Requirements: 11.1, 11.3, 11.4.
//
// Collects shipping/contact details and a payment method, validating with the
// shared Zod `checkoutSchema` through React Hook Form. Invalid submissions are
// blocked client-side (the page is retained) and inline field errors are shown.

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { checkoutSchema } from "@/lib/validation";
import type { CheckoutFormValues } from "@/types";

export interface CheckoutFormProps {
  /** Called with validated values when the form is submitted successfully. */
  onSubmit?: (values: CheckoutFormValues) => void;
}

/** Fixed set of payment methods (Requirement 11.x). */
const PAYMENT_METHODS: CheckoutFormValues["paymentMethod"][] = [
  "Bank Transfer",
  "E-Wallet",
  "Cash on Delivery",
];

/**
 * Checkout form with client-side validation. Does not navigate or call
 * `onSubmit` while the form is invalid.
 */
export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: undefined,
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit?.(values);
  });

  const paymentError = errors.paymentMethod?.message;

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Input
        label="Full name"
        autoComplete="name"
        error={errors.fullName?.message}
        {...register("fullName")}
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Phone"
        type="tel"
        autoComplete="tel"
        error={errors.phone?.message}
        {...register("phone")}
      />
      <Input
        label="Address"
        autoComplete="street-address"
        error={errors.address?.message}
        {...register("address")}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="City"
          autoComplete="address-level2"
          error={errors.city?.message}
          {...register("city")}
        />
        <Input
          label="Postal code"
          autoComplete="postal-code"
          error={errors.postalCode?.message}
          {...register("postalCode")}
        />
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-foreground">
          Payment method
        </legend>
        <div className="flex flex-col gap-2">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method}
              className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted dark:hover:bg-muted"
            >
              <input
                type="radio"
                value={method}
                className="h-4 w-4 accent-primary"
                {...register("paymentMethod")}
              />
              {method}
            </label>
          ))}
        </div>
        {paymentError ? (
          <p className="text-sm text-accent" role="alert">
            {paymentError}
          </p>
        ) : null}
      </fieldset>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        Place Order
      </Button>
    </form>
  );
}

export default CheckoutForm;
