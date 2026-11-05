import { useCallback, useState } from "react";
import type { Review } from "@weyfarer/types";
import { useUsersContext } from "../providers/user-provider/useUsersContext";
import { createReview } from "../services/places.service";
import { useForm, type FormErrors } from "./useForm";

interface ReviewValues {
  rating: string;
  body: string;
}

interface UseReviewFormOptions {
  placeId: string;
  onSubmitted: () => void;
}

export function useReviewForm({
  placeId,
  onSubmitted,
}: UseReviewFormOptions) {
  const { currentUser } = useUsersContext();
  const [review, setReview] = useState<Review | null>(null);

  const clearReview = useCallback(() => {
    setReview(null);
  }, []);

  function validate({ rating, body }: ReviewValues): FormErrors<ReviewValues> {
    const nextErrors: FormErrors<ReviewValues> = {};
    const parsedRating = Number(rating);

    if (
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      nextErrors.rating = "Choose a rating from 1 to 5.";
    }

    if (!body.trim()) {
      nextErrors.body = "Write a review before submitting.";
    }

    return nextErrors;
  }

  async function submit({ rating, body }: ReviewValues) {
    if (!currentUser) {
      throw new Error("No acting user selected.");
    }

    const createdReview = await createReview(
      placeId,
      { rating: Number(rating), body: body.trim() },
      currentUser.id,
    );

    setReview(createdReview);
    onSubmitted();
  }

  const form = useForm<ReviewValues>({
    initialValues: {
      rating: "5",
      body: "",
    },
    validate,
    onSubmit: submit,
  });

  return { ...form, review, clearReview };
}
