import type { CreateReviewRequest, Review } from "@weyfarer/types";
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

    async existsById(id: string): Promise<boolean> {
      const place = await prisma.place.findUnique({
        where: { id },
        select: { id: true },
      });

      return place !== null;
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

    async reviewExists(placeId: string, userId: string): Promise<boolean> {
      const review = await prisma.review.findUnique({
        where: { placeId_userId: { placeId, userId } },
        select: { id: true },
      });

      return review !== null;
    },

    createReview(
      placeId: string,
      userId: string,
      input: CreateReviewRequest,
    ): Promise<Review> {
      return prisma.review.create({
        data: {
          placeId,
          userId,
          rating: input.rating,
          body: input.body,
        },
        omit: { userId: true },
        include: {
          user: { select: { id: true, name: true } },
        },
      });
    },

    updateReview(
      placeId: string,
      userId: string,
      input: CreateReviewRequest,
    ): Promise<Review> {
      return prisma.review.update({
        where: { placeId_userId: { placeId, userId } },
        data: {
          rating: input.rating,
          body: input.body,
        },
        omit: { userId: true },
        include: {
          user: { select: { id: true, name: true } },
        },
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
