import { useCallback } from "react";
import { useParams } from "react-router";
import type { PlaceDetail, Review } from "@weyfarer/types";
import { getPlace, getReviews } from "../services/places.service";
import { useAsyncData, type AsyncData } from "./useAsyncData";

export interface PlaceDetailState {
  place: AsyncData<PlaceDetail>;
  reviews: AsyncData<Review[]>;
}

export function usePlaceDetail(): PlaceDetailState {
  const { placeId = "" } = useParams();

  const loadPlace = useCallback(
    (signal: AbortSignal) => getPlace(placeId, signal),
    [placeId],
  );
  const loadReviews = useCallback(
    (signal: AbortSignal) => getReviews(placeId, signal),
    [placeId],
  );

  const place = useAsyncData(loadPlace);
  const reviews = useAsyncData(loadReviews);

  return { place, reviews };
}
