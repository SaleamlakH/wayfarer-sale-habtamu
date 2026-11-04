import type { TourSlot } from "@weyfarer/types";
import { useBookingForm } from "../../hooks/useBookingForm";
import {
  formatTourSlotDate,
  formatTourSlotDayTime,
  formatTourSlotTime,
} from "../../utils/format";
import { Button } from "../ui/Button";
import { Field } from "../ui/Field";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { Spinner } from "../ui/Spinner";

interface BookTourDialogProps {
  placeName: string;
  slot: TourSlot;
  onClose: () => void;
  onBooked: () => void;
}

export function BookTourDialog({
  placeName,
  slot,
  onClose,
  onBooked,
}: BookTourDialogProps) {
  const { values, errors, submitting, handleChange, handleSubmit, booking } =
    useBookingForm({
      slotId: slot.id,
      availableSeats: slot.remainingSeats,
      onBooked,
    });

  return (
    <Modal
      open
      onClose={onClose}
      ariaLabel={booking ? "Booking confirmed" : "Book tour"}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">
            {booking ? "Booking confirmed" : "Book tour"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-1 text-(--ink-muted) transition-colors hover:bg-(--ink)/5 hover:text-(--ink)"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-sm font-medium text-(--ink)">{placeName}</p>

        {booking ? (
          <>
            <div className="flex flex-col items-center gap-2 rounded-xl border border-(--accent)/20 bg-(--accent)/5 px-4 py-5 text-center">
              <span className="flex size-10 items-center justify-center rounded-full bg-(--accent)/10 text-(--accent)">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-5"
                >
                  <path d="m5 12 4 4L19 6" />
                </svg>
              </span>
              <p className="text-sm font-medium text-(--ink)">
                Your tour has been booked.
              </p>
            </div>

            <dl className="grid w-fit grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
              <dt className="text-(--ink-muted)">Seats booked:</dt>
              <dd className="text-(--ink)">{booking.seats}</dd>
              <dt className="text-(--ink-muted)">Date &amp; time:</dt>
              <dd className="text-(--ink)">
                {formatTourSlotDayTime(booking.tourSlot.startsAt)}
              </dd>
              <dt className="text-(--ink-muted)">Full date:</dt>
              <dd className="text-(--ink)">
                {formatTourSlotDate(booking.tourSlot.startsAt)}
              </dd>
            </dl>

            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <dl className="grid w-fit grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
              <dt className="text-(--ink-muted)">Date:</dt>
              <dd className="text-(--ink)">
                {formatTourSlotDate(slot.startsAt)}
              </dd>
              <dt className="text-(--ink-muted)">Start time:</dt>
              <dd className="text-(--ink)">
                {formatTourSlotTime(slot.startsAt)}
              </dd>
              <dt className="text-(--ink-muted)">Available seats:</dt>
              <dd className="text-(--ink)">
                {slot.remainingSeats} / {slot.capacity}
              </dd>
            </dl>

            <Field
              label="Number of seats"
              htmlFor="booking-seats"
              error={errors.seats}
            >
              <Input
                id="booking-seats"
                name="seats"
                type="number"
                min={1}
                max={slot.remainingSeats}
                step={1}
                value={values.seats}
                onChange={handleChange}
                disabled={submitting}
              />
            </Field>

            {errors.submit ? (
              <div
                role="alert"
                className="rounded-lg border border-(--danger) bg-(--danger)/5 px-3 py-2 text-sm text-(--danger)"
              >
                <p className="font-medium">Booking could not be completed</p>
                <p className="mt-1">{errors.submit}</p>
              </div>
            ) : null}

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Spinner /> : null}
                Book
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
