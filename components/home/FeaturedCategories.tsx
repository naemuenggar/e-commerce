// FeaturedCategories (Task 14.1)
// Source of truth: design.md "Home Page" section.
//
// Renders the fixed set of categories as tappable tiles. Each tile links to the
// product listing pre-filtered by that category via the `category` query param.
//
// Requirements: 3.1, 3.5.

import Image from "next/image";
import Link from "next/link";

import { CATEGORIES } from "@/lib/constants";

/**
 * Grid of category tiles. A click navigates to
 * /products?category=<encoded category>.
 */
export function FeaturedCategories() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight">Shop by Category</h2>
        <p className="text-muted-foreground">
          Browse our most-loved collections
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/products?category=${encodeURIComponent(category)}`}
            className="group relative flex aspect-square flex-col items-center justify-end overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
          >
            <Image
              src={`https://picsum.photos/seed/shopease-${encodeURIComponent(
                category,
              )}/400/400`}
              alt={category}
              fill
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <span className="relative z-10 w-full p-3 text-center text-sm font-semibold text-white">
              {category}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default FeaturedCategories;
