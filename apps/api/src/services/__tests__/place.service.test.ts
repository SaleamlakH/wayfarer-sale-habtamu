import { afterEach, describe, expect, it, vi, type Mocked } from "vitest";
import type {
  PlaceRepository,
  ReviewRecord,
} from "../../types/repositories.js";
import { createPlaceService } from "../place.service.js";

function createMockPlaceRepository(): Mocked<PlaceRepository> {
  return {
    findAll: vi.fn(),
    findById: vi.fn(),
    existsById: vi.fn(),
    findReviewsByPlaceId: vi.fn(),
    reviewExists: vi.fn(),
    createReview: vi.fn(),
    updateReview: vi.fn(),
    getOverallAverageRating: vi.fn(),
  };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("place service listPlaces", () => {
  it("sorts a single review below a place with many reviews", async () => {
    const repository = createMockPlaceRepository();

    repository.findAll.mockResolvedValue([
      {
        id: "Single",
        name: "Single Review",
        description: "Single review",
        openingHours: "09:00-17:00",
        category: { id: "category", name: "Category" },
        reviews: [{ rating: 4.5 }],
      },
      {
        id: "Many",
        name: "Many Reviews",
        description: "Many reviews",
        openingHours: "09:00-17:00",
        category: { id: "category", name: "Category" },
        reviews: Array.from({ length: 100 }, () => ({ rating: 4.8 })),
      },
    ]);
    repository.getOverallAverageRating.mockResolvedValue(
      (100 * 4.8 + 4.5) / 101,
    );

    const service = createPlaceService(repository, { minimumReviewCount: 10 });

    const places = await service.listPlaces({ sort: "rate" });

    expect(places.map((place) => place.id)).toEqual(["Many", "Single"]);
  });
});

describe("place service createReview", () => {
  it("updates the existing review for the same user and place", async () => {
    const existingReview: ReviewRecord = {
      id: "review_1",
      placeId: "place_1",
      user: { id: "user_1", name: "Amina" },
      rating: 5,
      body: "Original review",
      createdAt: new Date("2026-10-14T18:05:00.000Z"),
    };
    const updatedReview: ReviewRecord = {
      ...existingReview,
      rating: 3,
      body: "Updated review",
    };

    const repository = createMockPlaceRepository();

    repository.existsById.mockResolvedValue(true);
    repository.reviewExists.mockResolvedValue(true);
    repository.updateReview.mockResolvedValue(updatedReview);

    const service = createPlaceService(repository, { minimumReviewCount: 10 });

    const result = await service.createReview("place_1", "user_1", {
      rating: 3,
      body: "Updated review",
    });

    expect(result).toEqual({
      review: {
        ...updatedReview,
        createdAt: updatedReview.createdAt.toISOString(),
      },
      created: false,
    });
    expect(repository.updateReview).toHaveBeenCalledWith("place_1", "user_1", {
      rating: 3,
      body: "Updated review",
    });
    expect(repository.createReview).not.toHaveBeenCalled();
  });
});
