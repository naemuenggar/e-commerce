// Theme state store (Task 10.3)
// Source of truth: design.md "State Store Interfaces".
//
// Tracks the active "light" | "dark" theme and exposes a toggle. State is
// persisted to localStorage (with in-memory fallback) so the chosen theme is
// retained across client-side navigation and reloads (Requirement 15.3).
//
// Requirements: 15.2, 15.3.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createSafeStorage } from "./storage";

export type Theme = "light" | "dark";

export interface ThemeState {
  theme: Theme;
  /** Flip between light and dark (Requirement 15.2). */
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggle: () =>
        set((state) => ({ theme: state.theme === "light" ? "dark" : "light" })),
    }),
    {
      name: "shopease-theme",
      storage: createJSONStorage(() => createSafeStorage()),
      partialize: (state) => ({ theme: state.theme }),
    },
  ),
);
