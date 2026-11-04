import { useState } from "react";
import type { Booking } from "@weyfarer/types";
import { useUsersContext } from "../providers/user-provider/useUsersContext";
import { createBooking } from "../services/booking.service";
import { useForm, type FormErrors } from "./useForm";

interface BookingValues {
  seats: string;
}

interface UseBookingFormOptions {
  slotId: string;
  availableSeats: number;
  onBooked: () => void;
}

export function useBookingForm({
  slotId,
  availableSeats,
  onBooked,
}: UseBookingFormOptions) {
  const { currentUser } = useUsersContext();
  const [booking, setBooking] = useState<Booking | null>(null);

  function validate({ seats }: BookingValues): FormErrors<BookingValues> {
    const nextErrors: FormErrors<BookingValues> = {};
    const requestedSeats = Number(seats);

    if (!Number.isInteger(requestedSeats) || requestedSeats <= 0) {
      nextErrors.seats = "Enter a whole number of seats.";
    } else if (requestedSeats > availableSeats) {
      nextErrors.seats = `Only ${availableSeats} ${
        availableSeats === 1 ? "seat is" : "seats are"
      } available.`;
    }

    return nextErrors;
  }

  async function submit({ seats }: BookingValues) {
    if (!currentUser) {
      throw new Error("No acting user selected.");
    }

    const createdBooking = await createBooking(
      slotId,
      { seats: Number(seats) },
      currentUser.id,
    );

    setBooking(createdBooking);
    onBooked();
  }

  const form = useForm<BookingValues>({
    initialValues: {
      seats: "1",
    },
    validate,
    onSubmit: submit,
  });

  return { ...form, booking };
}
