import type { Booking, CreateBookingRequest } from "@weyfarer/types";
import type { BookingRepository } from "../types/repositories.js";
import type { BookingService } from "../types/services.js";
import { AppError } from "../errors/app-error.js";

export function createBookingService(
  bookingRepository: BookingRepository,
): BookingService {
  return {
    async createBooking(
      slotId: string,
      userId: string,
      input: CreateBookingRequest,
    ): Promise<Booking> {
      const result = await bookingRepository.createBooking(
        slotId,
        userId,
        input.seats,
      );

      if (result.status === "slot_not_found") {
        throw new AppError(
          "TOUR_SLOT_NOT_FOUND",
          "The requested tour slot was not found.",
          404,
        );
      }

      if (result.status === "insufficient_capacity") {
        throw new AppError(
          "INSUFFICIENT_CAPACITY",
          "Not enough seats available for this tour slot.",
          409,
          {
            requestedSeats: result.requestedSeats,
            availableSeats: result.availableSeats,
          },
        );
      }

      const remainingSeats =
        result.tourSlot.capacity - result.tourSlot.bookedSeats;

      return {
        ...result.booking,
        createdAt: result.booking.createdAt.toISOString(),
        tourSlot: {
          ...result.tourSlot,
          remainingSeats,
          startsAt: result.tourSlot.startsAt.toISOString(),
          isFull: remainingSeats <= 0,
        },
      };
    },
  };
}
