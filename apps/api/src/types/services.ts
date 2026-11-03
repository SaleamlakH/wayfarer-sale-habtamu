import type {
  Category,
  GetPlacesQuery,
  Place,
  PlaceDetail,
  Review,
  User,
} from "@weyfarer/types";

export interface UserService {
  listUsers(): Promise<User[]>;
}

export interface PlaceService {
  listPlaces(query: GetPlacesQuery): Promise<Place[]>;
  getPlaceById(placeId: string): Promise<PlaceDetail>;
  listReviews(placeId: string): Promise<Review[]>;
}

export interface CategoryService {
  listCategories(): Promise<Category[]>;
}
