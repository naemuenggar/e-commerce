"use client";

// Register page (Task 17.8)
// Source of truth: design.md "Auth screens".
// Requirements: 12.2.
//
// Renders the RegisterForm centered in a card layout with a heading and a link
// to the Login page.

import Link from "next/link";

import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-foreground">
          Create account
        </h1>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
