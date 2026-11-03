import type {
  Category,
  GetPlacesQuery,
  Place,
  PlaceDetail,
  User,
} from "@weyfarer/types";

export interface UserService {
  listUsers(): Promise<User[]>;
}

export interface PlaceService {
  listPlaces(query: GetPlacesQuery): Promise<Place[]>;
  getPlaceById(placeId: string): Promise<PlaceDetail>;
}

export interface CategoryService {
  listCategories(): Promise<Category[]>;
}
