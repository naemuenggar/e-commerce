"use client";

// Client-side application shell and providers (Task 17.1)
// Source of truth: design.md layout inventory and theme handling
// (Requirements 2.1, 3.1, 15.3, 16.1).
//
// Wraps every page with the persistent layout chrome: a sticky Navbar at the
// top, the page `children` as the flexible main region, and the Footer at the
// bottom. The Toast container is rendered once here so notifications appear on
// every route.
//
// Theme application lives on the client: the active theme comes from the
// persisted `useThemeStore`, and we add/remove the `dark` class on
// <html> (document.documentElement) via an effect. The root layout sets
// `suppressHydrationWarning` on <html> because this class is applied after
// hydration.

import { useEffect, type ReactNode } from "react";
import { useThemeStore } from "../store/useThemeStore";
import { Navbar } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { Toast } from "../components/ui/Toast";

export function Providers({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  // Reflect the active theme onto the document root so Tailwind's
  // class-based dark mode (`darkMode: "class"`) takes effect site-wide.
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toast />
    </div>
  );
}

export default Providers;
