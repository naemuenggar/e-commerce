"use client";

// Toast — the visual container for transient notifications (Requirement 13.x).
// Reads the active toasts from `useToastStore` and renders them in a fixed
// bottom-right stack. Each toast shows its message, a type-based color, an
// icon, and a manual dismiss button. Auto-dismissal is handled by the store
// (TOAST_DURATION_MS); this component only presents and lets the user dismiss
// early.

import type { FC } from "react";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useToastStore, type ToastType } from "../../store/useToastStore";

/** Per-type presentation: container classes and leading icon. */
const TYPE_STYLES: Record<
  ToastType,
  { container: string; Icon: typeof Info }
> = {
  success: {
    container:
      "border-green-500/30 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
    Icon: CheckCircle2,
  },
  error: {
    container:
      "border-red-500/30 bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200",
    Icon: XCircle,
  },
  info: {
    container:
      "border-border bg-card text-card-foreground",
    Icon: Info,
  },
};

/**
 * Fixed-position, accessible toast region. Renders nothing when there are no
 * active toasts. Uses `aria-live="polite"` so additions are announced.
 */
export const Toast: FC = () => {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((toast) => {
        const { container, Icon } = TYPE_STYLES[toast.type];
        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 rounded-lg border p-3 shadow-lg transition-all duration-300 ease-out ${container}`}
          >
            <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              className="shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Toast;
