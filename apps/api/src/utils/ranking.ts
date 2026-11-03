export const MINIMUM_REVIEW_COUNT = 10;

export interface WeightedRatingInput {
  averageRating: number;
  reviewCount: number;
  overallAverageRating: number;
  minimumReviewCount: number;
}

export function calculateWeightedRating({
  averageRating,
  reviewCount,
  overallAverageRating,
  minimumReviewCount,
}: WeightedRatingInput): number {
  if (reviewCount <= 0) {
    return overallAverageRating;
  }

  if (minimumReviewCount <= 0) {
    return averageRating;
  }

  return (
    (reviewCount / (reviewCount + minimumReviewCount)) * averageRating +
    (minimumReviewCount / (reviewCount + minimumReviewCount)) *
      overallAverageRating
  );
}
