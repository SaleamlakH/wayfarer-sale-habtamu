import type { Request, Response } from "express";
import type { CreateBookingRequest } from "@weyfarer/types";
import type { BookingController } from "../types/controllers.js";
import type { BookingService } from "../types/services.js";

export function createBookingController(
  bookingService: BookingService,
): BookingController {
  return {
    create: async (req: Request, res: Response): Promise<void> => {
      const booking = await bookingService.createBooking(
        req.params.slotId as string,
        req.user!.id,
        req.validBody as CreateBookingRequest,
      );

      res.status(201).json(booking);
    },
  };
}
