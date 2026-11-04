import { useState } from "react";
import type { Review, TourSlot } from "@weyfarer/types";
import { BackToPlacesLink } from "../components/places/BackToPlacesLink";
import { BookTourDialog } from "../components/places/BookTourDialog";
import { PlaceSidebar } from "../components/places/PlaceSidebar";
import { ReviewDialog } from "../components/places/ReviewDialog";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Spinner } from "../components/ui/Spinner";
import { Star } from "../components/ui/Star";
import { usePlaceDetail } from "../hooks/usePlaceDetail";
import type { AsyncData } from "../hooks/useAsyncData";
import {
  formatTourSlotDate,
  formatTourSlotDayTime,
} from "../utils/format";

export function PlaceDetailPage() {
  const { place, reviews } = usePlaceDetail();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TourSlot | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <BackToPlacesLink className="md:hidden" />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] md:items-start lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <PlaceSidebar
          categoryId={place.data?.category.id}
          categoryName={place.data?.category.name}
          selectedPlaceId={place.data?.id ?? ""}
        />

        <div className="flex flex-col gap-6">
          <div className="md:rounded-xl md:border md:border-(--border) md:bg-(--surface-primary)">
            {place.loading ? (
              <section className="border-b border-(--border) pb-6 md:p-4">
                <div className="flex items-center justify-center gap-3 py-4 text-sm text-(--ink-muted)">
                  <Spinner />
                  Loading place
                </div>
              </section>
            ) : place.error ? (
              <section className="border-b border-(--border) pb-6 md:p-4">
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <p role="alert" className="text-sm text-(--danger)">
                    {place.error.message}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <Button variant="secondary" onClick={place.refetch}>
                      Try again
                    </Button>
                    <BackToPlacesLink />
                  </div>
                </div>
              </section>
            ) : place.data ? (
              <>
                <section className="border-b border-(--border) pb-6 md:p-4">
                  <h1 className="text-2xl font-semibold">
                    {place.data.name}
                  </h1>

                  <div className="mt-3 flex flex-col gap-1 text-sm md:flex-row md:flex-wrap md:items-center md:gap-2">
                    <span className="text-(--ink-muted)">
                      {place.data.category.name}
                    </span>
                    <span
                      className="flex items-center gap-1"
                      aria-label={`Rated ${place.data.rating.average} out of 5 from ${place.data.rating.reviewCount} ${place.data.rating.reviewCount === 1 ? "review" : "reviews"}`}
                    >
                      <Star />
                      <span className="font-medium text-(--ink)">
                        {place.data.rating.average}
                      </span>
                      <span className="text-xs text-(--ink-muted)">
                        ({place.data.rating.reviewCount}{" "}
                        {place.data.rating.reviewCount === 1
                          ? "review"
                          : "reviews"}
                        )
                      </span>
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-(--ink-muted)">
                    Opening hours: {place.data.openingHours}
                  </p>

                  <p className="mt-4 text-sm text-(--ink)">
                    {place.data.description}
                  </p>
                </section>

                <section className="border-b border-(--border) py-6 md:p-4">
                  <h2 className="text-xs font-semibold uppercase tracking-widest text-(--ink-muted)">
                    Guided tours
                  </h2>

                  <div className="mt-4 flex flex-col gap-3">
                    {place.data.tourSlots.length === 0 ? (
                      <p className="text-sm text-(--ink-muted)">
                        No guided tours available.
                      </p>
                    ) : (
                      place.data.tourSlots.map((slot) => {
                        const isLowAvailability =
                          !slot.isFull && slot.remainingSeats <= 2;

                        return (
                          <Card
                            key={slot.id}
                            nested
                            className="flex flex-col gap-3 md:max-w-xl md:flex-row md:items-center md:justify-between md:gap-6"
                          >
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-(--ink)">
                                {formatTourSlotDayTime(slot.startsAt)}
                              </span>
                              <span className="text-xs text-(--ink-muted)">
                                {formatTourSlotDate(slot.startsAt)}
                              </span>
                            </div>
                            <div className="flex grow items-center justify-between md:contents">
                              <span
                                className={`text-sm font-medium ${isLowAvailability ? "text-(--stars)" : ""}`}
                              >
                                {slot.isFull
                                  ? "Fully booked"
                                  : `${slot.remainingSeats} of ${slot.capacity} seats left`}
                              </span>
                              {!slot.isFull && (
                                <Button
                                  variant={
                                    isLowAvailability ? "urgent" : "primary"
                                  }
                                  className="px-3 py-1.5"
                                  onClick={() => setSelectedSlot(slot)}
                                >
                                  Book
                                </Button>
                              )}
                            </div>
                          </Card>
                        );
                      })
                    )}
                  </div>
                </section>
              </>
            ) : null}

            <ReviewsSection
              reviews={reviews}
              onWriteReview={() => setReviewDialogOpen(true)}
              canWriteReview={Boolean(place.data) && !reviews.loading}
            />
          </div>
        </div>
      </div>

      {place.data ? (
        <ReviewDialog
          open={reviewDialogOpen}
          onClose={() => setReviewDialogOpen(false)}
          placeId={place.data.id}
          placeName={place.data.name}
          reviews={reviews.data ?? []}
          onSubmitted={() => {
            reviews.refetch();
            place.refetch();
          }}
        />
      ) : null}

      {place.data && selectedSlot ? (
        <BookTourDialog
          placeName={place.data.name}
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onBooked={place.refetch}
        />
      ) : null}
    </div>
  );
}

interface ReviewsSectionProps {
  reviews: AsyncData<Review[]>;
  onWriteReview: () => void;
  canWriteReview: boolean;
}

function ReviewsSection({
  reviews,
  onWriteReview,
  canWriteReview,
}: ReviewsSectionProps) {
  return (
    <section className="pt-6 md:p-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-(--ink-muted)">
          Reviews
        </h2>
        <Button
          className="px-3 py-1.5"
          onClick={onWriteReview}
          disabled={!canWriteReview}
        >
          + Write review
        </Button>
      </div>

      {reviews.loading ? (
        <div className="mt-4 flex items-center gap-3 text-sm text-(--ink-muted)">
          <Spinner />
          Loading reviews
        </div>
      ) : reviews.error ? (
        <div className="mt-4 flex flex-col items-start gap-3">
          <p role="alert" className="text-sm text-(--danger)">
            {reviews.error.message}
          </p>
          <Button variant="secondary" onClick={reviews.refetch}>
            Try again
          </Button>
        </div>
      ) : (reviews.data ?? []).length === 0 ? (
        <p className="mt-4 text-sm text-(--ink-muted)">No reviews yet.</p>
      ) : (
        <div className="mt-4 flex flex-col divide-y divide-(--border)">
          {(reviews.data ?? []).map((review) => (
            <div key={review.id} className="py-4 first:pt-0 last:pb-0">
              <div className="flex items-center gap-1 text-sm">
                <Star />
                <span className="font-medium text-(--ink)">
                  {review.rating}
                </span>
                <span className="text-(--ink-muted)">
                  · {review.user.name}
                </span>
              </div>
              <p className="mt-2 text-sm text-(--ink)">{review.body}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
