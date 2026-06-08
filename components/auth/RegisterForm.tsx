"use client";

// RegisterForm (Task 15.4)
// Source of truth: design.md "Auth screens".
// Requirements: 12.2, 12.4, 12.5.
//
// Account creation with full name, email, password, and confirm password.
// Validates with the shared Zod `registerSchema` through React Hook Form. The
// confirm-password mismatch is surfaced inline on the confirmPassword field.

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { registerSchema } from "@/lib/validation";
import type { RegisterValues } from "@/types";

export interface RegisterFormProps {
  /** Called with validated values when the form is submitted successfully. */
  onSubmit?: (values: RegisterValues) => void;
}

/**
 * Register form with client-side validation. Does not call `onSubmit` while the
 * form is invalid; password mismatch is reported on the confirm field.
 */
export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submit = handleSubmit((values) => {
    onSubmit?.(values);
  });

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
        label="Password"
        type="password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password")}
      />
      <Input
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        Register
      </Button>
    </form>
  );
}

export default RegisterForm;
