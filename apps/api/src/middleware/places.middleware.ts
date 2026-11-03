import type { RequestHandler } from "express";
import type { CreateReviewRequest } from "@weyfarer/types";
import { AppError } from "../errors/app-error.js";

export const placesQueryMiddleware: RequestHandler = (req, _res, next) => {
  const { categoryId, sort } = req.query;

  const validCategoryId = typeof categoryId === "string" ? categoryId : null;
  const validSort = sort === "rate" ? "rate" : null;

  req.validQuery = {
    ...(validCategoryId && { categoryId: validCategoryId }),
    ...(validSort && { sort: validSort }),
  };

  next();
};

export const reviewBodyMiddleware: RequestHandler = (req, _res, next) => {
  const { rating, body } = (req.body ?? {}) as {
    rating?: unknown;
    body?: unknown;
  };

  const details: Record<string, string> = {};

  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    details.rating = "must be an integer between 1 and 5.";
  }

  if (typeof body !== "string" || body.trim().length === 0) {
    details.body = "must be a non-empty string.";
  }

  if (Object.keys(details).length > 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Invalid review input.",
      400,
      details,
    );
  }

  const validBody: CreateReviewRequest = {
    rating: rating as number,
    body: body as string,
  };
  req.validBody = validBody;

  next();
};
