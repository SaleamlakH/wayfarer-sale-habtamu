import type { User } from "@weyfarer/types";

interface UserRepository {
  findAll(): Promise<User[]>;
}

export type { UserRepository };
