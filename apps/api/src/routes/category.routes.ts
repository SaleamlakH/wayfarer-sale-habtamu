import { Router } from "express";
import type { CategoryController } from "../types/controllers.js";

export function createCategoryRouter(controller: CategoryController): Router {
  const router: Router = Router();
  router.get("/", controller.list);
  return router;
}
