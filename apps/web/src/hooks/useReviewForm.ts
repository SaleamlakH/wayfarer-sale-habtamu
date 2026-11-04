import {
  useEffect,
  useState,
  type ChangeEvent,
  type SubmitEvent,
} from "react";
import { useUsersContext } from "../providers/user-provider/useUsersContext";
import { createReview } from "../services/places.service";

interface ReviewErrors {
  rating?: string;
  body?: string;
  submit?: string;
}

interface UseReviewFormOptions {
  open: boolean;
  placeId: string;
  onSubmitted: () => void;
  onClose: () => void;
}

export function useReviewForm({
  open,
  placeId,
  onSubmitted,
  onClose,
}: UseReviewFormOptions) {
  const { currentUser } = useUsersContext();

  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<ReviewErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  function handleRatingChange(event: ChangeEvent<HTMLSelectElement>) {
    setRating(Number(event.target.value));
  }

  function handleBodyChange(event: ChangeEvent<HTMLTextAreaElement>) {
    setBody(event.target.value);
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ReviewErrors = {};

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      nextErrors.rating = "Choose a rating from 1 to 5.";
    }

    if (!body.trim()) {
      nextErrors.body = "Write a review before submitting.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    if (!currentUser) {
      setErrors({ submit: "No acting user selected." });
      return;
    }

    setSubmitting(true);

    try {
      await createReview(placeId, { rating, body: body.trim() }, currentUser.id);
      onSubmitted();
      onClose();
    } catch (cause) {
      setErrors({
        submit:
          cause instanceof Error
            ? cause.message
            : "Could not submit your review.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return {
    rating,
    setRating,
    body,
    setBody,
    errors,
    submitting,
    handleRatingChange,
    handleBodyChange,
    handleSubmit,
  };
}
