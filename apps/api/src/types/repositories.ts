import type {
  Category,
  CreateReviewRequest,
  User,
} from "@weyfarer/types";

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
}

export interface ReviewRecord {
  id: string;
  placeId: string;
  user: User;
  rating: number;
  body: string;
  createdAt: Date;
}

export interface PlaceWithReviews {
  id: string;
  name: string;
  description: string;
  openingHours: string;
  category: Category;
  reviews: { rating: number }[];
}

export interface TourSlotWithBookings {
  id: string;
  placeId: string;
  startsAt: Date;
  capacity: number;
  bookings: { seats: number }[];
}

export interface PlaceWithTourSlots extends PlaceWithReviews {
  tourSlots: TourSlotWithBookings[];
}

export interface PlaceFilters {
  categoryId?: string;
}

export interface PlaceRepository {
  findAll(filters: PlaceFilters): Promise<PlaceWithReviews[]>;
  findById(id: string): Promise<PlaceWithTourSlots | null>;
  existsById(id: string): Promise<boolean>;
  findReviewsByPlaceId(placeId: string): Promise<ReviewRecord[]>;
  reviewExists(placeId: string, userId: string): Promise<boolean>;
  createReview(
    placeId: string,
    userId: string,
    input: CreateReviewRequest,
  ): Promise<ReviewRecord>;
  updateReview(
    placeId: string,
    userId: string,
    input: CreateReviewRequest,
  ): Promise<ReviewRecord>;
  getOverallAverageRating(): Promise<number | null>;
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
}

export interface BookingRecord {
  id: string;
  slotId: string;
  userId: string;
  seats: number;
  createdAt: Date;
}

export interface BookingSlotSnapshot {
  id: string;
  placeId: string;
  startsAt: Date;
  capacity: number;
  bookedSeats: number;
}

export type CreateBookingResult =
  | {
      status: "created";
      booking: BookingRecord;
      tourSlot: BookingSlotSnapshot;
    }
  | { status: "slot_not_found" }
  | {
      status: "insufficient_capacity";
      requestedSeats: number;
      availableSeats: number;
    };

export interface BookingRepository {
  createBooking(
    slotId: string,
    userId: string,
    seats: number,
  ): Promise<CreateBookingResult>;
}
