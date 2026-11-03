import type { Category, User } from "@weyfarer/types";

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

export interface PlaceRepository {
  findAll(): Promise<PlaceWithReviews[]>;
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
}
