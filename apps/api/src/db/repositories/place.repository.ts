import type { Review } from "@weyfarer/types";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type {
  PlaceFilters,
  PlaceRepository,
  PlaceWithReviews,
  PlaceWithTourSlots,
} from "../../types/repositories.js";

export function createPrismaPlaceRepository(
  prisma: PrismaClient,
): PlaceRepository {
  return {
    findAll(filters: PlaceFilters): Promise<PlaceWithReviews[]> {
      return prisma.place.findMany({
        where: filters.categoryId
          ? { categoryId: filters.categoryId }
          : undefined,
        select: {
          id: true,
          name: true,
          description: true,
          openingHours: true,
          category: { select: { id: true, name: true } },
          reviews: { select: { rating: true } },
        },
        orderBy: { name: "asc" },
      });
    },

    findById(id: string): Promise<PlaceWithTourSlots | null> {
      return prisma.place.findUnique({
        where: { id },
        include: {
          category: true,
          reviews: { select: { rating: true } },
          tourSlots: {
            orderBy: { startsAt: "asc" },
            include: { bookings: { select: { seats: true } } },
          },
        },
      });
    },

    findReviewsByPlaceId(placeId: string): Promise<Review[]> {
      return prisma.review.findMany({
        where: { placeId },
        omit: { userId: true },
        include: {
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
    },

    async getOverallAverageRating(): Promise<number | null> {
      const result = await prisma.review.aggregate({
        _avg: { rating: true },
      });

      return result._avg.rating;
    },
  };
}
