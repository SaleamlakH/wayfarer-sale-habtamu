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
  };
}

export { createPrismaUserRepository };
