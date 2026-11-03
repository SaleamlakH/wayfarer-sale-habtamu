import { Router } from "express";
import { placesQueryMiddleware } from "../middleware/places-query.js";
import type { PlaceController } from "../types/controllers.js";

export function createPlaceRouter(controller: PlaceController): Router {
  const router: Router = Router();
  router.get("/", placesQueryMiddleware, controller.list);
  router.get("/:placeId", controller.getById);
  router.get("/:placeId/reviews", controller.listReviews);
  return router;
}
