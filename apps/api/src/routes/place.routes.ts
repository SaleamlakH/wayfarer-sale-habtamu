import { Router, type RequestHandler } from "express";
import { placesQueryMiddleware } from "../middleware/places-query.js";
import { reviewBodyMiddleware } from "../middleware/review-body.js";
import type { PlaceController } from "../types/controllers.js";

export function createPlaceRouter(
  controller: PlaceController,
  authMiddleware: RequestHandler,
): Router {
  const router: Router = Router();
  router.get("/", placesQueryMiddleware, controller.list);
  router.get("/:placeId", controller.getById);
  router.get("/:placeId/reviews", controller.listReviews);
  router.post(
    "/:placeId/reviews",
    authMiddleware,
    reviewBodyMiddleware,
    controller.createReview,
  );
  return router;
}
