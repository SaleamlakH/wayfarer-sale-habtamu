import type {
  CreateReviewRequest,
  GetPlacesQuery,
  Place,
  PlaceDetail,
  Review,
} from "@weyfarer/types";
import type {
  PlaceRepository,
  PlaceWithReviews,
} from "../types/repositories.js";
import type {
  PlaceService,
  ReviewWriteResult,
} from "../types/services.js";
import { AppError } from "../errors/app-error.js";
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

    async getPlaceById(placeId: string): Promise<PlaceDetail> {
      const place = await placeRepository.findById(placeId);

      if (!place) {
        throw new AppError(
          "PLACE_NOT_FOUND",
          "The requested place was not found.",
          404,
        );
      }

      const tourSlots = place.tourSlots.map((slot) => {
        const bookedSeats = slot.bookings.reduce(
          (total, booking) => total + booking.seats,
          0,
        );
        const remainingSeats = slot.capacity - bookedSeats;

        return {
          id: slot.id,
          placeId: slot.placeId,
          startsAt: slot.startsAt.toISOString(),
          capacity: slot.capacity,
          bookedSeats,
          remainingSeats,
          isFull: remainingSeats <= 0,
        };
      });

      return {
        ...toPlace(place),
        tourSlots,
      };
    },

    async listReviews(placeId: string): Promise<Review[]> {
      return placeRepository.findReviewsByPlaceId(placeId);
    },

    async createReview(
      placeId: string,
      userId: string,
      input: CreateReviewRequest,
    ): Promise<ReviewWriteResult> {
      const placeExists = await placeRepository.existsById(placeId);

      if (!placeExists) {
        throw new AppError(
          "PLACE_NOT_FOUND",
          "The requested place was not found.",
          404,
        );
      }

      if (await placeRepository.reviewExists(placeId, userId)) {
        const review = await placeRepository.updateReview(
          placeId,
          userId,
          input,
        );

        return { review, created: false };
      }

      const review = await placeRepository.createReview(placeId, userId, input);
      return { review, created: true };
    },
  };
}
