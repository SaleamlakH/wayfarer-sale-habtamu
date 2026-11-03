import type {
  Category,
  GetPlacesQuery,
  Place,
  User,
} from "@weyfarer/types";

export interface UserService {
  listUsers(): Promise<User[]>;
}

export interface PlaceService {
  listPlaces(query: GetPlacesQuery): Promise<Place[]>;
}

export interface CategoryService {
  listCategories(): Promise<Category[]>;
}
