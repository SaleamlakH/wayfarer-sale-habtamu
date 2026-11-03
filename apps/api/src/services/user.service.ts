import type { User } from "@weyfarer/types";
import type { UserRepository } from "../types/repositories.js";
import type { UserService } from "../types/services.js";

function createUserService(userRepository: UserRepository): UserService {
  return {
    listUsers(): Promise<User[]> {
      return userRepository.findAll();
    },
  };
}

export { createUserService };
