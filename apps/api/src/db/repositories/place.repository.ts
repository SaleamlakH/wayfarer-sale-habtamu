import type { PrismaClient } from "../../../generated/prisma/client.js";
import type {
  PlaceFilters,
  PlaceRepository,
  PlaceWithReviews,
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
    
    async getOverallAverageRating(): Promise<number | null> {
      const result = await prisma.review.aggregate({
        _avg: { rating: true },
      });

      return result._avg.rating;
    },
  };
}
