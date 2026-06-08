// Toast notification state store (Task 10.4)
// Source of truth: design.md "State Store Interfaces".
//
// Holds the list of active toasts. `show` adds a toast with a unique id and
// schedules automatic dismissal after TOAST_DURATION_MS; `dismiss` removes a
// toast by id. This store is intentionally NOT persisted — toasts are
// ephemeral UI feedback.
//
// Requirements: 13.1, 13.2, 13.3.

import { create } from "zustand";
import { TOAST_DURATION_MS } from "../lib/constants";

/** The visual/semantic variant of a toast. */
export type ToastType = "success" | "error" | "info";

/** A single toast notification. */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

export interface ToastState {
  toasts: Toast[];
  /** Show a toast; auto-dismisses after TOAST_DURATION_MS (Requirement 13.3). */
  show: (message: string, type?: ToastType) => void;
  /** Remove a toast by id. */
  dismiss: (id: string) => void;
}

/**
 * Generate a unique id for a toast. Uses crypto.randomUUID when available and
 * falls back to a timestamp + random suffix otherwise.
 */
function createToastId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useToastStore = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, type = "info") => {
    const id = createToastId();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));

    if (typeof setTimeout !== "undefined") {
      setTimeout(() => {
        get().dismiss(id);
      }, TOAST_DURATION_MS);
    }
  },
  dismiss: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
