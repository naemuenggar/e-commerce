// EmptyState — shown when a collection (products, cart, wishlist) has no items
// (Requirements 4.3, 5.5, 9.7, 10.5). Part of the reusable component inventory
// (Requirement 16.1).
//
// Renders a centered icon, a title, an optional supporting message, and an
// optional action/CTA slot (e.g. a "Continue shopping" button).

import type { FC, ReactNode } from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  /** Primary heading describing the empty collection. */
  title: string;
  /** Optional supporting message with more context. */
  message?: string;
  /** Optional call-to-action node (e.g. a Button or Link). */
  action?: ReactNode;
  /** Optional custom icon; defaults to an inbox glyph. */
  icon?: ReactNode;
  /** Optional extra classes for layout composition. */
  className?: string;
}

/**
 * A centered, theme-aware empty-collection message with an optional CTA.
 */
export const EmptyState: FC<EmptyStateProps> = ({
  title,
  message,
  action,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon ?? <Inbox className="h-8 w-8" aria-hidden="true" />}
      </div>

      <h2 className="text-lg font-semibold text-foreground">{title}</h2>

      {message ? (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">{message}</p>
      ) : null}

      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
};

export default EmptyState;
