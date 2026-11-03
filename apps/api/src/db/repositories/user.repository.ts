import type { User } from "@weyfarer/types";
import type { PrismaClient } from "../../../generated/prisma/client.js";
import type { UserRepository } from "../../types/repositories.js";

function createPrismaUserRepository(prisma: PrismaClient): UserRepository {
  return {
    findAll(): Promise<User[]> {
      return prisma.user.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      });
    },

    findById(id: string): Promise<User | null> {
      return prisma.user.findUnique({
        where: { id },
        select: { id: true, name: true },
      });
    },
  };
}

export { createPrismaUserRepository };
