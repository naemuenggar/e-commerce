"use client";

// Navbar layout component (Task 12.1)
// Source of truth: design.md layout inventory
// (Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 15.1).
//
// A sticky top navigation bar with the ShopEase logo, desktop nav links, a
// Login control, the theme toggle, and a cart count badge. On screens below
// the `md` breakpoint the desktop links are hidden and a hamburger button
// opens the MobileMenu instead.
//
// Hydration note: the cart store is persisted to localStorage, so the count on
// the client's first render can differ from the server-rendered (empty) value.
// We only render the numeric badge after mount to avoid a hydration mismatch.

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingCart } from "lucide-react";
import { useCartStore } from "../../store/useCartStore";
import { ThemeToggle } from "./ThemeToggle";
import { MobileMenu } from "./MobileMenu";

interface NavLink {
  label: string;
  href: string;
}

const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/products" },
  { label: "Cart", href: "/cart" },
  { label: "Wishlist", href: "/wishlist" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // The cart count comes from a persisted store; defer rendering the numeric
  // badge until after mount so SSR and the first client render agree.
  const count = useCartStore((state) => state.count());

  useEffect(() => {
    setMounted(true);
  }, []);

  const showBadge = mounted && count > 0;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold text-foreground transition-colors hover:text-primary"
        >
          ShopEase
        </Link>

        {/* Desktop nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_LINKS.map((link) => {
            const isCart = link.href === "/cart";
            return (
              <Link
                key={link.label}
                href={link.href}
                className="relative inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {isCart && (
                  <ShoppingCart className="h-4 w-4" aria-hidden="true" />
                )}
                {link.label}
                {isCart && showBadge && (
                  <span
                    aria-label={`${count} items in cart`}
                    className="ml-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-primary-foreground"
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right-side controls */}
        <div className="flex items-center gap-1">
          <Link
            href="/login"
            className="hidden rounded-md px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted md:inline-flex"
          >
            Login
          </Link>

          <ThemeToggle />

          {/* Hamburger (mobile only) */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            {showBadge && (
              <span
                aria-hidden="true"
                className="absolute right-1 top-1 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold text-primary-foreground"
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}

export default Navbar;
