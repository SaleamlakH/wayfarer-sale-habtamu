import { Router } from "express";
import type { PlaceController } from "../types/controllers.js";

function createPlaceRouter(controller: PlaceController): Router {
  const router: Router = Router();
  router.get("/", controller.list);
  return router;
}

export { createPlaceRouter };
