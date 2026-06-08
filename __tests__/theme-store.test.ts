import { describe, it, expect, beforeEach } from "vitest";
import fc from "fast-check";

import { useThemeStore, type Theme } from "../store/useThemeStore";

// Property-based test for the theme store (Task 10.5).
// _Requirements: 15.2_

const THEMES: Theme[] = ["light", "dark"];

describe("useThemeStore.toggle", () => {
  beforeEach(() => {
    // Reset to a known baseline before each run.
    useThemeStore.setState({ theme: "light" });
  });

  // Feature: shopease, Property 18: Theme toggle flips and is reversible.
  it("flips light<->dark once and restores the original after two toggles", () => {
    fc.assert(
      fc.property(fc.constantFrom(...THEMES), (start) => {
        // Drive the real store from the given starting theme.
        useThemeStore.setState({ theme: start });

        // One toggle flips to the opposite theme.
        useThemeStore.getState().toggle();
        const afterOne = useThemeStore.getState().theme;
        const expectedFlip: Theme = start === "light" ? "dark" : "light";
        expect(afterOne).toBe(expectedFlip);
        expect(afterOne).not.toBe(start);

        // Two toggles restore the original theme (reversible).
        useThemeStore.getState().toggle();
        const afterTwo = useThemeStore.getState().theme;
        expect(afterTwo).toBe(start);
      }),
      { numRuns: 100 }
    );
  });
});
