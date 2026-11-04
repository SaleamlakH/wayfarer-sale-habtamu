import type { Booking, CreateBookingRequest } from "@weyfarer/types";
import { request } from "../api/client";

export function createBooking(
  slotId: string,
  input: CreateBookingRequest,
  userId: string,
  signal?: AbortSignal,
): Promise<Booking> {
  return request<Booking>(
    `/api/tour-slots/${encodeURIComponent(slotId)}/bookings`,
    {
      request: {
        method: "POST",
        body: JSON.stringify(input),
      },
      userId,
      signal,
    },
  );
}
