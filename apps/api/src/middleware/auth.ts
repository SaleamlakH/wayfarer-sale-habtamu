import type { RequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import type { UserRepository } from "../types/repositories.js";

function createAuthMiddleware(userRepository: UserRepository): RequestHandler {
  return async (req, _res, next) => {
    const userId = req.header("X-User-Id")?.trim();

    if (!userId) {
      throw new AppError(
        "VALIDATION_ERROR",
        "X-User-Id header is required.",
        400,
      );
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(
        "USER_NOT_FOUND",
        "The acting user was not found.",
        401,
      );
    }

    req.user = user;
    next();
  };
}

export { createAuthMiddleware };
