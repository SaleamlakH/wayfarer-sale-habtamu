import type { Category } from "@weyfarer/types";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { CategoryRepository } from "../../types/repositories.js";

export function createPrismaCategoryRepository(
  prisma: PrismaClient,
): CategoryRepository {
  return {
    findAll(): Promise<Category[]> {
      return prisma.category.findMany({
        orderBy: { name: "asc" },
      });
    },
  };
}
