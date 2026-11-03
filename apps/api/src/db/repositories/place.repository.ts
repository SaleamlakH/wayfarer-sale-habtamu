import type { PrismaClient } from "../../../generated/prisma/client.js";
import type {
  PlaceRepository,
  PlaceWithReviews,
} from "../../types/repositories.js";

export function createPrismaPlaceRepository(
  prisma: PrismaClient,
): PlaceRepository {
  return {
    findAll(): Promise<PlaceWithReviews[]> {
      return prisma.place.findMany({
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
  };
}
