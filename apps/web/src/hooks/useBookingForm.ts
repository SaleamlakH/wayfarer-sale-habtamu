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
  onClose: () => void;
}

export function useBookingForm({
  slotId,
  availableSeats,
  onBooked,
  onClose,
}: UseBookingFormOptions) {
  const { currentUser } = useUsersContext();

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

    await createBooking(slotId, { seats: Number(seats) }, currentUser.id);
    onBooked();
    onClose();
  }

  return useForm<BookingValues>({
    initialValues: {
      seats: "1",
    },
    validate,
    onSubmit: submit,
  });
}
