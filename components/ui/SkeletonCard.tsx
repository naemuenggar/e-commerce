// SkeletonCard — placeholder card shown while product content is being
// prepared for display (Skeleton_State, Requirement 5.4).
//
// Mirrors the layout of ProductCard (image block, name line, price line) using
// `animate-pulse` muted blocks so the listing reserves stable space and
// communicates loading without layout shift.

import type { FC } from "react";

export interface SkeletonCardProps {
  /** Optional extra classes for layout composition (e.g. grid sizing). */
  className?: string;
}

/**
 * A non-interactive placeholder matching the ProductCard shape. Hidden from
 * assistive technology since it conveys no real content.
 */
export const SkeletonCard: FC<SkeletonCardProps> = ({ className = "" }) => {
  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden rounded-lg border border-border bg-card ${className}`}
    >
      {/* Image placeholder */}
      <div className="aspect-square w-full animate-pulse bg-muted" />

      <div className="space-y-3 p-4">
        {/* Category line */}
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        {/* Name lines */}
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
        {/* Rating line */}
        <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
        {/* Price + button row */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          <div className="h-9 w-9 animate-pulse rounded-md bg-muted" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
