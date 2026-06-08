"use client";

// ThemeToggle layout component (Task 12.1)
// Source of truth: design.md layout inventory (Requirement 15.1).
//
// A button that flips the active theme via the theme store. It shows a Sun
// icon while in dark mode (click to go light) and a Moon icon while in light
// mode (click to go dark). Applying the resulting `.dark` class to <html> is
// handled by the Providers wrapper (Task 17.1); this control only toggles the
// stored value.

import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

export function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const toggle = useThemeStore((state) => state.toggle);

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {isDark ? (
        <Sun className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Moon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
}

export default ThemeToggle;
