import { Router } from "express";
import type { UserController } from "../types/controllers.js";

function createUserRouter(controller: UserController): Router {
  const router: Router = Router();
  router.get("/", controller.list);
  return router;
}

export { createUserRouter };
