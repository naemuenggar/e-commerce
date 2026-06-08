"use client";

// Modal UI primitive (Task 11.1)
// Source of truth: design.md "Reusable Component Inventory" (Requirement 16.1).
//
// An accessible overlay dialog. Renders nothing when closed. While open it
// shows a backdrop and a centered panel with role="dialog" and aria-modal.
// Closes on backdrop click and on the Escape key. Focus trapping is out of
// scope per the task, but the dialog is properly labelled for assistive tech.

import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  /** Whether the modal is visible. */
  open: boolean;
  /** Called when the user requests to close (backdrop click or Escape). */
  onClose: () => void;
  /** Dialog body content. */
  children: ReactNode;
  /** Optional accessible title rendered in the header. */
  title?: string;
}

/**
 * Accessible overlay dialog. Mounts only while `open` is true.
 */
export function Modal({ open, onClose, children, title }: ModalProps) {
  // Close on Escape while open.
  useEffect(() => {
    if (!open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  const titleId = title ? "modal-title" : undefined;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      // Backdrop click closes the modal. Clicks inside the panel are stopped.
      onClick={onClose}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-lg border border-border bg-card p-6 text-card-foreground shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          {title ? (
            <h2 id={titleId} className="text-lg font-semibold text-foreground">
              {title}
            </h2>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
