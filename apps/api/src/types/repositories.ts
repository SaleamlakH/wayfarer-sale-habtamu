import type {
  Category,
  CreateReviewRequest,
  Review,
  User,
} from "@weyfarer/types";

export interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
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
  findReviewsByPlaceId(placeId: string): Promise<Review[]>;
  reviewExists(placeId: string, userId: string): Promise<boolean>;
  createReview(
    placeId: string,
    userId: string,
    input: CreateReviewRequest,
  ): Promise<Review>;
  updateReview(
    placeId: string,
    userId: string,
    input: CreateReviewRequest,
  ): Promise<Review>;
  getOverallAverageRating(): Promise<number | null>;
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
}
