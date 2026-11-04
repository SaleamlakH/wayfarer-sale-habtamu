import type { PrismaClient } from "../../../generated/prisma/client.js";
import type {
  BookingRepository,
  CreateBookingResult,
} from "../../types/repositories.js";

interface LockedTourSlot {
  id: string;
  placeId: string;
  startsAt: Date;
  capacity: number;
}

export function createPrismaBookingRepository(
  prisma: PrismaClient,
): BookingRepository {
  return {
    createBooking(
      slotId: string,
      userId: string,
      seats: number,
    ): Promise<CreateBookingResult> {
      return prisma.$transaction(
        async (tx) => {
          const [slot] = await tx.$queryRaw<LockedTourSlot[]>`
            SELECT
              id,
              place_id AS "placeId",
              starts_at AS "startsAt",
              capacity
            FROM tour_slots
            WHERE id = ${slotId}
            FOR UPDATE
          `;

          if (!slot) return { status: "slot_not_found" };

          const aggregate = await tx.booking.aggregate({
            where: { slotId },
            _sum: { seats: true },
          });

          const bookedSeats = aggregate._sum.seats ?? 0;
          const availableSeats = Math.max(slot.capacity - bookedSeats, 0);

          if (seats > availableSeats) {
            return {
              status: "insufficient_capacity",
              requestedSeats: seats,
              availableSeats,
            };
          }

          const booking = await tx.booking.create({
            data: {
              slotId,
              userId,
              seats,
            },
          });

          return {
            status: "created",
            booking,
            tourSlot: {
              ...slot,
              bookedSeats: bookedSeats + seats,
            },
          };
        },
        {
          maxWait: 20_000,
          timeout: 20_000,
        },
      );
    },
  };
}
