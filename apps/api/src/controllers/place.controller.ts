import type { Request, Response } from "express";
import type { CreateReviewRequest, GetPlacesQuery } from "@weyfarer/types";
import type { PlaceController } from "../types/controllers.js";
import type { PlaceService } from "../types/services.js";

export function createPlaceController(
  placeService: PlaceService,
): PlaceController {
  return {
    list: async (req: Request, res: Response): Promise<void> => {
      const places = await placeService.listPlaces(
        (req.validQuery ?? {}) as GetPlacesQuery,
      );
      res.json(places);
    },

    getById: async (req: Request, res: Response): Promise<void> => {
      const place = await placeService.getPlaceById(
        req.params.placeId as string,
      );

      res.json(place);
    },

    listReviews: async (req: Request, res: Response): Promise<void> => {
      const reviews = await placeService.listReviews(
        req.params.placeId as string,
      );

      res.json(reviews);
    },

    createReview: async (req: Request, res: Response): Promise<void> => {
      const { review, created } = await placeService.createReview(
        req.params.placeId as string,
        req.user!.id,
        req.validBody as CreateReviewRequest,
      );

      res.status(created ? 201 : 200).json(review);
    },
  };
}
