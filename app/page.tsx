// Home page (Task 17.2)
// Source of truth: design.md "App Router Route Map" and "Home Page" section.
//
// Composes the landing experience: Hero, a search area, featured categories, a
// featured products section, a promo banner, and the best sellers section. The
// Navbar and Footer are provided by the root layout (app/providers.tsx), so the
// page focuses on home content only.
//
// This is a Server Component; the only interactive piece is the small
// `HomeSearch` client component, which navigates to /products?q=... on submit.
//
// Requirements: 3.1, 3.2, 3.3, 3.5.

import productsData from "@/data/products.json";
import type { Product } from "@/types";

import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BestSellerSection } from "@/components/home/BestSellerSection";
import { HomeSearch } from "@/components/home/HomeSearch";
import { ProductGrid } from "@/components/product/ProductGrid";

const products = productsData as Product[];

// Featured products: prefer newly arrived items, falling back to the first few
// of the catalog so the section is never empty.
const featuredProducts = (() => {
  const fresh = products.filter((product) => product.isNew);
  const source = fresh.length > 0 ? fresh : products;
  return source.slice(0, 8);
})();

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />

      <section className="mx-auto w-full max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <HomeSearch />
      </section>

      <FeaturedCategories />

      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Featured Products
          </h2>
          <p className="text-muted-foreground">
            Handpicked highlights from across the store
          </p>
        </div>
        <ProductGrid products={featuredProducts} />
      </section>

      <PromoBanner />

      <BestSellerSection products={products} />
    </div>
  );
}
