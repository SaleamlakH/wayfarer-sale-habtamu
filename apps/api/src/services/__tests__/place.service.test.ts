import { describe, expect, it } from "vitest";
import type { PlaceRepository } from "../../types/repositories.js";
import { createPlaceService } from "../place.service.js";

describe("place service listPlaces", () => {
  it("sorts a single review below a place with many reviews", async () => {
    const repository: PlaceRepository = {
      findAll: async () => [
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
      ],
      getOverallAverageRating: async () => (100 * 4.8 + 4.5) / 101,
    };

    const service = createPlaceService(repository, { minimumReviewCount: 10 });

    const places = await service.listPlaces({ sort: "rate" });

    expect(places.map((place) => place.id)).toEqual(["Many", "Single"]);
  });
});
