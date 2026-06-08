"use client";

// HomeSearch (Task 17.2)
// Source of truth: design.md "Home Page" section.
//
// A small client wrapper around the shared SearchBar for the home page. It
// holds the query text locally and, on submit (Enter), navigates to the
// Product_Listing_Page with the query as the `q` search param so the listing
// seeds its search state from the URL.
//
// Requirements: 3.1, 3.3.

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

import { SearchBar } from "@/components/product/SearchBar";

/**
 * Home page search field. Submitting navigates to /products?q=<query>.
 */
export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(
      trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : "/products"
    );
  };

  return (
    <form onSubmit={handleSubmit} role="search" className="mx-auto max-w-xl">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search products..."
      />
    </form>
  );
}

export default HomeSearch;
