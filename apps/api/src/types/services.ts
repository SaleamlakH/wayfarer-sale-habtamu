import type { Place, User } from "@weyfarer/types";

export interface UserService {
  listUsers(): Promise<User[]>;
}

export interface PlaceService {
  listPlaces(): Promise<Place[]>;
}
