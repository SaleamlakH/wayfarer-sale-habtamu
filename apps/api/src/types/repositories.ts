import type { User } from "@weyfarer/types";

interface UserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
}

export type { UserRepository };
