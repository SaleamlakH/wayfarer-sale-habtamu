import type { Request, Response } from "express";
import type { PlaceController } from "../types/controllers.js";
import type { PlaceService } from "../types/services.js";

export function createPlaceController(
  placeService: PlaceService,
): PlaceController {
  return {
    list: async (req: Request, res: Response): Promise<void> => {
      const places = await placeService.listPlaces(req.validQuery ?? {});
      res.json(places);
    },

    getById: async (req: Request, res: Response): Promise<void> => {
      const place = await placeService.getPlaceById(
        req.params.placeId as string,
      );

      res.json(place);
    },
  };
}
