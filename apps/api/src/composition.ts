import { Router } from "express";
import { prisma } from "./db/prisma.js";
import { createPrismaUserRepository } from "./db/repositories/user.repository.js";
import { createUserService } from "./services/user.service.js";
import { createUserController } from "./controllers/user.controller.js";
import { createUserRouter } from "./routes/user.routes.js";

const userRepository = createPrismaUserRepository(prisma);
const userService = createUserService(userRepository);
const userController = createUserController(userService);

const apiRouter: Router = Router();
apiRouter.use("/users", createUserRouter(userController));

export { apiRouter };
