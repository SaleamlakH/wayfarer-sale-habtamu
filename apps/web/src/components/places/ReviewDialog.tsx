import { useEffect } from "react";
import type { Review } from "@weyfarer/types";
import { useReviewForm } from "../../hooks/useReviewForm";
import { useUsersContext } from "../../providers/user-provider/useUsersContext";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Select } from "../ui/Select";
import { Spinner } from "../ui/Spinner";
import { Star } from "../ui/Star";
import { Textarea } from "../ui/Textarea";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  placeId: string;
  placeName: string;
  reviews: Review[];
  onSubmitted: () => void;
}

export function ReviewDialog({
  open,
  onClose,
  placeId,
  placeName,
  reviews,
  onSubmitted,
}: ReviewDialogProps) {
  const { currentUser } = useUsersContext();
  const existingReview =
    reviews.find((review) => review.user.id === currentUser?.id) ?? null;

  const {
    values,
    reset,
    errors,
    submitting,
    handleChange,
    handleSubmit,
    review,
    clearReview,
  } = useReviewForm({
    placeId,
    onSubmitted,
  });

  useEffect(() => {
    if (!open) {
      clearReview();
      return;
    }

    reset({
      rating: String(existingReview?.rating ?? 5),
      body: existingReview?.body ?? "",
    });
  }, [open, existingReview, reset, clearReview]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel={review ? "Review submitted" : "Write a review"}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">
            {review ? "Review submitted" : "Write a review"}
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

        {review ? (
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
                Your review has been submitted.
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1 text-sm text-(--ink)">
                <Star className="text-lg" />
                <span className="font-medium">{review.rating}</span>
              </div>
              <p className="text-sm text-(--ink)">{review.body}</p>
            </div>

            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Star className="text-lg" />
                <Select
                  name="rating"
                  aria-label="Rating"
                  value={values.rating}
                  onChange={handleChange}
                  disabled={submitting}
                  className="flex-1"
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} {value === 1 ? "star" : "stars"}
                    </option>
                  ))}
                </Select>
              </div>
              {errors.rating ? (
                <p className="text-xs text-(--danger)">{errors.rating}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="review-body" className="sr-only">
                Review
              </label>
              <Textarea
                id="review-body"
                name="body"
                rows={4}
                placeholder="Write your review..."
                value={values.body}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.body ? (
                <p className="text-xs text-(--danger)">{errors.body}</p>
              ) : null}
            </div>

            {errors.submit ? (
              <div
                role="alert"
                className="rounded-lg border border-(--danger) bg-(--danger)/5 px-3 py-2 text-sm text-(--danger)"
              >
                <p className="font-medium">Review could not be submitted</p>
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
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
