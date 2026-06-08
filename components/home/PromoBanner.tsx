// PromoBanner (Task 14.1)
// Source of truth: design.md "Home Page" section.
//
// An eye-catching promotional banner highlighting a discount, with a CTA that
// links to the product listing.
//
// Requirements: 3.1.

import Link from "next/link";
import { Tag } from "lucide-react";

import { Button } from "@/components/ui/Button";

/**
 * Full-width promotional banner with a bold offer and a call-to-action.
 */
export function PromoBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-accent px-6 py-12 text-center shadow-lg sm:px-12 sm:py-16">
        <div className="relative z-10 flex flex-col items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1 text-sm font-medium text-white backdrop-blur-sm">
            <Tag className="h-4 w-4" />
            Limited time offer
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Up to 50% Off Storewide
          </h2>
          <p className="max-w-xl text-base text-white/90 sm:text-lg">
            Refresh your collection with unbeatable deals across every category.
            Hurry, while stocks last.
          </p>
          <Link href="/products" aria-label="Shop the sale">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90"
            >
              Shop the Sale
            </Button>
          </Link>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10"
        />
      </div>
    </section>
  );
}

export default PromoBanner;
