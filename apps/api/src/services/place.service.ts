import type { GetPlacesQuery, Place } from "@weyfarer/types";
import type {
  PlaceRepository,
  PlaceWithReviews,
} from "../types/repositories.js";
import type { PlaceService } from "../types/services.js";
import { calculateWeightedRating } from "../utils/ranking.js";

function calculateAverageRating(ratings: number[]): number {
  if (ratings.length === 0) {
    return 0;
  }

  const total = ratings.reduce((sum, rating) => sum + rating, 0);
  return Math.round((total / ratings.length) * 100) / 100;
}

function toPlace(place: PlaceWithReviews): Place {
  const ratings = place.reviews.map((review) => review.rating);

  return {
    id: place.id,
    name: place.name,
    category: place.category,
    description: place.description,
    openingHours: place.openingHours,
    rating: {
      average: calculateAverageRating(ratings),
      reviewCount: ratings.length,
    },
  };
}

interface PlaceServiceOptions {
  minimumReviewCount: number;
}

export function createPlaceService(
  placeRepository: PlaceRepository,
  options: PlaceServiceOptions,
): PlaceService {
  return {
    async listPlaces(query: GetPlacesQuery): Promise<Place[]> {
      const places = await placeRepository.findAll({
        categoryId: query.categoryId,
      });

      const mappedPlaces = places.map(toPlace);

      if (query.sort !== "rate") return mappedPlaces;
      if (places.length === 0) return [];

      const overallAverageRating =
        (await placeRepository.getOverallAverageRating()) ?? 0;

      // score places
      const scoredPlaces = mappedPlaces.map((place) => {
        return {
          place,
          score: calculateWeightedRating({
            overallAverageRating,
            averageRating: place.rating.average,
            reviewCount: place.rating.reviewCount,
            minimumReviewCount: options.minimumReviewCount,
          }),
        };
      });

      const sortedPlaces = scoredPlaces.sort((a, b) => {
        return b.score - a.score;
      });

      return sortedPlaces.map((scoredPlace) => scoredPlace.place);
    },
  };
}
