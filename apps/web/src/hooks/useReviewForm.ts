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
  onClose: () => void;
}

export function useReviewForm({
  placeId,
  onSubmitted,
  onClose,
}: UseReviewFormOptions) {
  const { currentUser } = useUsersContext();

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

    await createReview(
      placeId,
      { rating: Number(rating), body: body.trim() },
      currentUser.id,
    );
    onSubmitted();
    onClose();
  }

  return useForm<ReviewValues>({
    initialValues: {
      rating: "5",
      body: "",
    },
    validate,
    onSubmit: submit,
  });
}
