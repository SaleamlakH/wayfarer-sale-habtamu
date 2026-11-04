import "dotenv/config";
import { vi } from "vitest";

if (process.env.TEST_DATABASE_URL) {
  process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
}

vi.mock("../src/db/prisma.js", async () => {
  const { prisma } = await import("../src/__tests__/db-setup/prisma.js");
  return { prisma };
});
