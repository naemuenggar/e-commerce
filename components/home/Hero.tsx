// Hero (Task 14.1)
// Source of truth: design.md "Home Page" section.
//
// The landing hero: headline, subheadline, a "Shop Now" CTA linking to the
// product listing, and a supporting product image. Responsive two-column on
// desktop, single column stacked on mobile.
//
// Requirements: 3.1, 3.2, 3.3.

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/Button";

/**
 * Visually appealing landing hero with a clear primary call-to-action.
 */
export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24 lg:px-8">
        <div className="flex flex-col items-start gap-6 text-center md:text-left">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
            New season, fresh finds
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Shop smarter with{" "}
            <span className="text-primary">ShopEase</span>
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Discover curated fashion, electronics, and lifestyle essentials at
            prices you&apos;ll love. Quality products, effortless checkout.
          </p>
          <Link href="/products" aria-label="Shop now">
            <Button size="lg">
              Shop Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="relative mx-auto aspect-[4/3] w-full max-w-lg overflow-hidden rounded-2xl shadow-xl ring-1 ring-border transition-transform duration-300 hover:scale-[1.02]">
          <Image
            src="https://picsum.photos/seed/shopease-hero/800/600"
            alt="Featured ShopEase products"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
