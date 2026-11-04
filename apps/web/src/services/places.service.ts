import type {
  Category,
  CreateReviewRequest,
  GetPlacesQuery,
  Place,
  PlaceDetail,
  Review,
} from "@weyfarer/types";
import { request } from "../api/client";

export function getCategories(signal?: AbortSignal): Promise<Category[]> {
  return request<Category[]>("/api/categories", { signal });
}

export function getPlaces(
  query: GetPlacesQuery = {},
  signal?: AbortSignal,
): Promise<Place[]> {
  const params = new URLSearchParams();

  if (query.categoryId) {
    params.set("categoryId", query.categoryId);
  }

  if (query.sort) {
    params.set("sort", query.sort);
  }

  const search = params.toString();

  return request<Place[]>(`/api/places${search ? `?${search}` : ""}`, {
    signal,
  });
}

export function getPlace(
  placeId: string,
  signal?: AbortSignal,
): Promise<PlaceDetail> {
  return request<PlaceDetail>(`/api/places/${encodeURIComponent(placeId)}`, {
    signal,
  });
}

export function getReviews(
  placeId: string,
  signal?: AbortSignal,
): Promise<Review[]> {
  return request<Review[]>(
    `/api/places/${encodeURIComponent(placeId)}/reviews`,
    { signal },
  );
}

export function createReview(
  placeId: string,
  input: CreateReviewRequest,
  userId: string,
  signal?: AbortSignal,
): Promise<Review> {
  return request<Review>(
    `/api/places/${encodeURIComponent(placeId)}/reviews`,
    {
      request: {
        method: "POST",
        body: JSON.stringify(input),
      },
      userId,
      signal,
    },
  );
}
