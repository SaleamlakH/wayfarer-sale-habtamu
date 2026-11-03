import { describe, expect, it } from "vitest";
import { calculateWeightedRating } from "../ranking.js";

describe("calculateWeightedRating", () => {
  it("matches the weighted rating formula for representative inputs", () => {
    const score = calculateWeightedRating({
      overallAverageRating: 4.5,
      minimumReviewCount: 10,
      averageRating: 4.67,
      reviewCount: 3,
    });

    expect(score).toBeCloseTo(4.5392, 4);
  });

  it("single 5 review doesn't outrank a high rated place with many reviews", () => {
    const singleFiveStarReview = calculateWeightedRating({
      overallAverageRating: 4.5,
      minimumReviewCount: 10,
      averageRating: 5,
      reviewCount: 1,
    });

    const manyHighReviews = calculateWeightedRating({
      overallAverageRating: 4.5,
      minimumReviewCount: 10,
      averageRating: 4.8,
      reviewCount: 100,
    });

    expect(manyHighReviews).toBeGreaterThan(singleFiveStarReview);
  });

  it("ranks a place with more reviews higher when their ratings is equal", () => {
    const fewReviews = calculateWeightedRating({
      overallAverageRating: 4.5,
      minimumReviewCount: 10,
      averageRating: 4.67,
      reviewCount: 1,
    });

    const manyReviews = calculateWeightedRating({
      overallAverageRating: 4.5,
      minimumReviewCount: 10,
      averageRating: 4.67,
      reviewCount: 3,
    });

    expect(manyReviews).toBeGreaterThan(fewReviews);
  });

  // expected behavior,
  // it is below average of all places rating
  // giving the rating stronger influence
  it("a rating above the overall average outranks a lower rating with many more reviews", () => {
    const aboveAverageRating = calculateWeightedRating({
      overallAverageRating: 4.5,
      minimumReviewCount: 10000,
      averageRating: 4.8,
      reviewCount: 1,
    });

    const belowAverageRating = calculateWeightedRating({
      overallAverageRating: 4.5,
      minimumReviewCount: 10000,
      averageRating: 4.4,
      reviewCount: 100,
    });

    expect(aboveAverageRating).toBeGreaterThan(belowAverageRating);
  });

  it("returns the overall average when a place has no reviews", () => {
    const score = calculateWeightedRating({
      overallAverageRating: 4.5,
      minimumReviewCount: 10,
      averageRating: 0,
      reviewCount: 0,
    });

    expect(score).toBe(4.5);
  });

  it("returns the place average when the minimum review count is zero", () => {
    const score = calculateWeightedRating({
      overallAverageRating: 4.5,
      minimumReviewCount: 0,
      averageRating: 4.2,
      reviewCount: 3,
    });

    expect(score).toBe(4.2);
  });
});
