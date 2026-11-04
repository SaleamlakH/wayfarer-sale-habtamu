import type { TourSlot } from "@weyfarer/types";
import { useBookingForm } from "../../hooks/useBookingForm";
import { formatTourSlotDate, formatTourSlotTime } from "../../utils/format";
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
  const { values, errors, submitting, handleChange, handleSubmit } =
    useBookingForm({
      slotId: slot.id,
      availableSeats: slot.remainingSeats,
      onBooked,
      onClose,
    });

  return (
    <Modal open onClose={onClose} ariaLabel="Book tour">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">Book tour</h2>
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

        <dl className="grid w-fit grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-sm">
          <dt className="text-(--ink-muted)">Date:</dt>
          <dd className="text-(--ink)">{formatTourSlotDate(slot.startsAt)}</dd>
          <dt className="text-(--ink-muted)">Start time:</dt>
          <dd className="text-(--ink)">{formatTourSlotTime(slot.startsAt)}</dd>
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
          <p role="alert" className="text-sm text-(--danger)">
            {errors.submit}
          </p>
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
    </Modal>
  );
}
