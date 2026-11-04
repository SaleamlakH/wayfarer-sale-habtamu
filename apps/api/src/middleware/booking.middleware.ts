import type { RequestHandler } from "express";
import type { CreateBookingRequest } from "@weyfarer/types";
import { AppError } from "../errors/app-error.js";

export const bookingBodyMiddleware: RequestHandler = (req, _res, next) => {
  const { seats } = (req.body ?? {}) as { seats?: unknown };

  if (typeof seats !== "number" || !Number.isInteger(seats) || seats <= 0) {
    throw new AppError("VALIDATION_ERROR", "Invalid booking input.", 400, {
      seats: "must be a positive integer.",
    });
  }

  const validBody: CreateBookingRequest = { seats };
  req.validBody = validBody;

  next();
};
