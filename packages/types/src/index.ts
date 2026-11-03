export interface GetPlacesQuery {
  categoryId?: string;
  sort?: string;
}

export interface CreateReviewRequest {
  rating: number;
  body: string;
}

export interface CreateBookingRequest {
  seats: number;
}

export interface User {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PlaceRating {
  average: number;
  reviewCount: number;
}

export interface Place {
  id: string;
  name: string;
  category: Category;
  description: string;
  openingHours: string;
  rating: PlaceRating;
}

export interface TourSlot {
  id: string;
  placeId: string;
  startsAt: string;
  capacity: number;
  bookedSeats: number;
  remainingSeats: number;
  isFull: boolean;
}

export interface PlaceDetail extends Place {
  tourSlots: TourSlot[];
}

export interface Review {
  id: string;
  placeId: string;
  user: User;
  rating: number;
  body: string;
  createdAt: Date;
}

export interface Booking {
  id: string;
  slotId: string;
  userId: string;
  seats: number;
  createdAt: string;
  tourSlot: TourSlot;
}

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "USER_NOT_FOUND"
  | "PLACE_NOT_FOUND"
  | "TOUR_SLOT_NOT_FOUND"
  | "INSUFFICIENT_CAPACITY"
  | "INTERNAL_ERROR";

export interface ApiErrorBody {
  code: ApiErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  error: ApiErrorBody;
}
