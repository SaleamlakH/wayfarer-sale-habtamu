import type { Place } from "@weyfarer/types";
import type { PlaceRepository } from "../types/repositories.js";
import type { PlaceService } from "../types/services.js";

function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) {
    return 0;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Math.round((total / ratings.length) * 100) / 100;
}

export function createPlaceService(
  placeRepository: PlaceRepository,
): PlaceService {
  return {
    async listPlaces(): Promise<Place[]> {
      const places = await placeRepository.findAll();

      return places.map((place) => {
        const ratings = place.reviews.map((review) => review.rating);
        const average = calculateAverageRating(ratings);

        return {
          id: place.id,
          name: place.name,
          category: place.category,
          description: place.description,
          openingHours: place.openingHours,
          rating: {
            average,
            reviewCount: place.reviews.length,
          },
        };
      });
    },
  };
}
