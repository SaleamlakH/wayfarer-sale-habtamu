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
    rating,
    setRating,
    body,
    setBody,
    errors,
    submitting,
    handleRatingChange,
    handleBodyChange,
    handleSubmit,
  } = useReviewForm({
    open,
    placeId,
    onSubmitted,
    onClose,
  });

  useEffect(() => {
    if (!open) return;

    setRating(existingReview?.rating ?? 5);
    setBody(existingReview?.body ?? "");
  }, [open, existingReview, setRating, setBody]);

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Write a review">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex items-start justify-between gap-4">
          <h2 className="text-lg font-semibold">Write a review</h2>
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

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Star className="text-lg" />
            <Select
              aria-label="Rating"
              value={rating}
              onChange={handleRatingChange}
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
            rows={4}
            placeholder="Write your review..."
            value={body}
            onChange={handleBodyChange}
            disabled={submitting}
          />
          {errors.body ? (
            <p className="text-xs text-(--danger)">{errors.body}</p>
          ) : null}
        </div>

        {errors.submit ? (
          <p role="alert" className="text-sm text-(--danger)">
            {errors.submit}
          </p>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? <Spinner /> : null}
            Submit
          </Button>
        </div>
      </form>
    </Modal>
  );
}
