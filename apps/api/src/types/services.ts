import type {
  Category,
  CreateReviewRequest,
  GetPlacesQuery,
  Place,
  PlaceDetail,
  Review,
  User,
} from "@weyfarer/types";

export interface ReviewWriteResult {
  review: Review;
  created: boolean;
}

export interface UserService {
  listUsers(): Promise<User[]>;
}

export interface PlaceService {
  listPlaces(query: GetPlacesQuery): Promise<Place[]>;
  getPlaceById(placeId: string): Promise<PlaceDetail>;
  listReviews(placeId: string): Promise<Review[]>;
  createReview(
    placeId: string,
    userId: string,
    input: CreateReviewRequest,
  ): Promise<ReviewWriteResult>;
}

export interface CategoryService {
  listCategories(): Promise<Category[]>;
}
