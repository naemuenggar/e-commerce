"use client";

// LoginForm (Task 15.4)
// Source of truth: design.md "Auth screens".
// Requirements: 12.1, 12.3, 12.4.
//
// Email + password login with a "Remember me" toggle and a "Forgot password?"
// link. Validates with the shared Zod `loginSchema` through React Hook Form,
// rendering inline field-level errors.

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginSchema } from "@/lib/validation";
import type { LoginValues } from "@/types";

export interface LoginFormProps {
  /** Called with validated values when the form is submitted successfully. */
  onSubmit?: (values: LoginValues) => void;
}

/**
 * Login form with client-side validation. Does not call `onSubmit` while the
 * form is invalid.
 */
export function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit?.(values);
  });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4">
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="flex items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 accent-primary"
            {...register("rememberMe")}
          />
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        Login
      </Button>
    </form>
  );
}

export default LoginForm;
