import type { Category, Place, User } from "@weyfarer/types";

export interface UserService {
  listUsers(): Promise<User[]>;
}

export interface PlaceService {
  listPlaces(): Promise<Place[]>;
}

export interface CategoryService {
  listCategories(): Promise<Category[]>;
}
