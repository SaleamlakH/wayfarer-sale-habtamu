import { type RequestHandler } from "express";
import { prisma } from "./db/prisma.js";
import { createPrismaUserRepository } from "./db/repositories/user.repository.js";
import { createPrismaPlaceRepository } from "./db/repositories/place.repository.js";
import { createPrismaCategoryRepository } from "./db/repositories/category.repository.js";
import { createUserService } from "./services/user.service.js";
import { createPlaceService } from "./services/place.service.js";
import { createCategoryService } from "./services/category.service.js";
import { createUserController } from "./controllers/user.controller.js";
import { createPlaceController } from "./controllers/place.controller.js";
import { createCategoryController } from "./controllers/category.controller.js";
import { createUserRouter } from "./routes/user.routes.js";
import { createPlaceRouter } from "./routes/place.routes.js";
import { createCategoryRouter } from "./routes/category.routes.js";
import { createAuthMiddleware } from "./middleware/auth.js";
import { MINIMUM_REVIEW_COUNT } from "./utils/ranking.js";

const userRepository = createPrismaUserRepository(prisma);
const userService = createUserService(userRepository);
const userController = createUserController(userService);

export const authMiddleware: RequestHandler =
  createAuthMiddleware(userRepository);

export const usersRoute = createUserRouter(userController);

const placeRepository = createPrismaPlaceRepository(prisma);
const placeService = createPlaceService(placeRepository, {
  minimumReviewCount: MINIMUM_REVIEW_COUNT,
});
const placeController = createPlaceController(placeService);

export const placesRoute = createPlaceRouter(placeController, authMiddleware);

const categoryRepository = createPrismaCategoryRepository(prisma);
const categoryService = createCategoryService(categoryRepository);
const categoryController = createCategoryController(categoryService);

export const categoriesRoute = createCategoryRouter(categoryController);
