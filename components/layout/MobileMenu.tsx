"use client";

// MobileMenu layout component (Task 12.1)
// Source of truth: design.md layout inventory (Requirements 2.1, 2.3, 2.4).
//
// A slide-in navigation panel shown on small screens. It renders an overlay
// backdrop plus a right-aligned panel listing the primary nav links and a
// Login link. Selecting any link (or the backdrop / close button) invokes
// onClose so the parent can hide the menu.

import Link from "next/link";
import { X } from "lucide-react";

export interface MobileMenuProps {
  /** Whether the menu is visible. */
  open: boolean;
  /** Called when the user dismisses the menu or follows a link. */
  onClose: () => void;
}

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

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <nav
        aria-label="Mobile navigation"
        className="absolute right-0 top-0 flex h-full w-72 max-w-[80%] flex-col gap-2 border-l border-border bg-card p-6 text-card-foreground shadow-xl"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="text-lg font-bold text-foreground">ShopEase</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {NAV_LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={onClose}
            className="rounded-md px-3 py-2 text-base font-medium text-foreground transition-colors hover:bg-muted"
          >
            {link.label}
          </Link>
        ))}

        <Link
          href="/login"
          onClick={onClose}
          className="mt-2 rounded-md bg-primary px-3 py-2 text-center text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Login
        </Link>
      </nav>
    </div>
  );
}

export default MobileMenu;
