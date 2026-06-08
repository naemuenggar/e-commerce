// Rating — renders a row of star icons reflecting a product rating
// (0–max, default max of 5). Part of the reusable component inventory used by
// ProductCard and the Product_Detail_Page (Requirement 16.1).
//
// Stars are filled up to the (rounded) rating value and outlined for the
// remainder. The whole control carries an accessible label so screen readers
// announce the numeric rating instead of the decorative icons.

import type { FC } from "react";
import { Star } from "lucide-react";

export interface RatingProps {
  /** The rating value, expected within [0, max]. Clamped defensively. */
  value: number;
  /** Maximum number of stars. Defaults to 5. */
  max?: number;
  /** Optional extra classes for layout composition. */
  className?: string;
}

/** Constrain a possibly out-of-range value into [0, max]. */
function clamp(value: number, max: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(Math.max(value, 0), max);
}

/**
 * Accessible star rating display. The numeric value is exposed via
 * `aria-label`; the individual stars are decorative.
 */
export const Rating: FC<RatingProps> = ({ value, max = 5, className = "" }) => {
  const safeMax = max > 0 ? max : 5;
  const clamped = clamp(value, safeMax);
  const filled = Math.round(clamped);

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      role="img"
      aria-label={`Rating: ${clamped} out of ${safeMax} stars`}
    >
      {Array.from({ length: safeMax }, (_, index) => {
        const isFilled = index < filled;
        return (
          <Star
            key={index}
            aria-hidden="true"
            className={`h-4 w-4 ${
              isFilled
                ? "fill-accent text-accent"
                : "fill-transparent text-muted-foreground"
            }`}
          />
        );
      })}
    </div>
  );
};

export default Rating;
