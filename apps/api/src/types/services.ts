import type { User } from "@weyfarer/types";

interface UserService {
  listUsers(): Promise<User[]>;
}

export type { UserService };
