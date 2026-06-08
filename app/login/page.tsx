"use client";

// Login page (Task 17.8)
// Source of truth: design.md "Auth screens".
// Requirements: 12.1.
//
// Renders the LoginForm centered in a card layout with a heading and a link to
// the Register page.

import Link from "next/link";

import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold text-foreground">
          Login
        </h1>

        <LoginForm />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary transition-colors hover:text-primary/80"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
