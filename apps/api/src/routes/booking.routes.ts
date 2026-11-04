import { Router, type RequestHandler } from "express";
import { bookingBodyMiddleware } from "../middleware/booking.middleware.js";
import type { BookingController } from "../types/controllers.js";

export function createBookingRouter(
  controller: BookingController,
  authMiddleware: RequestHandler,
): Router {
  const router: Router = Router();
  router.post(
    "/:slotId/bookings",
    authMiddleware,
    bookingBodyMiddleware,
    controller.create,
  );
  return router;
}
