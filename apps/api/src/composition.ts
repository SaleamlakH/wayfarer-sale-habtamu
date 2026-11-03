import { type RequestHandler } from "express";
import { prisma } from "./db/prisma.js";
import { createPrismaUserRepository } from "./db/repositories/user.repository.js";
import { createPrismaPlaceRepository } from "./db/repositories/place.repository.js";
import { createUserService } from "./services/user.service.js";
import { createPlaceService } from "./services/place.service.js";
import { createUserController } from "./controllers/user.controller.js";
import { createPlaceController } from "./controllers/place.controller.js";
import { createUserRouter } from "./routes/user.routes.js";
import { createPlaceRouter } from "./routes/place.routes.js";
import { createAuthMiddleware } from "./middleware/auth.js";

const userRepository = createPrismaUserRepository(prisma);
const userService = createUserService(userRepository);
const userController = createUserController(userService);

const placeRepository = createPrismaPlaceRepository(prisma);
const placeService = createPlaceService(placeRepository);
const placeController = createPlaceController(placeService);

export const usersRoute = createUserRouter(userController);
export const placesRoute = createPlaceRouter(placeController);

export const authMiddleware: RequestHandler =
  createAuthMiddleware(userRepository);
