"use client";

// Input UI primitive (Task 11.1)
// Source of truth: design.md "Reusable Component Inventory" (Requirement 16.1).
//
// A labeled text input with an inline error message slot. It uses forwardRef
// so it composes cleanly with react-hook-form's `register`. It extends the
// native input element, so any standard input attribute is accepted.

import { forwardRef, useId } from "react";
import type { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Optional visible label rendered above the input. */
  label?: string;
  /** Optional error message rendered below the input when present. */
  error?: string;
}

const baseInputClasses =
  "w-full rounded-md border bg-background px-3 py-2 text-sm text-foreground " +
  "placeholder:text-muted-foreground transition-colors duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background " +
  "disabled:cursor-not-allowed disabled:opacity-50";

/**
 * Labeled input with error display. Forwards a ref to the underlying native
 * input element for react-hook-form compatibility.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hasError = Boolean(error);

    const stateClasses = hasError
      ? "border-accent focus:ring-accent"
      : "border-border focus:ring-primary";

    const classes = [baseInputClasses, stateClasses, className ?? ""]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col gap-1">
        {label ? (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={classes}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          {...props}
        />
        {hasError ? (
          <p id={errorId} className="text-sm text-accent" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
