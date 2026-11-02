import type { ErrorRequestHandler } from "express";
import type { ApiErrorResponse } from "@weyfarer/types";
import { AppError } from "../errors/app-error.js";

const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (!(error instanceof AppError)) {
    console.error(error);
  }

  const appError =
    error instanceof AppError
      ? error
      : new AppError("INTERNAL_ERROR", "An unexpected error occurred.", 500);

  const response: ApiErrorResponse = {
    error: {
      code: appError.code,
      message: appError.message,
      ...(appError.details !== undefined ? { details: appError.details } : {}),
    },
  };

  res.status(appError.status).json(response);
};

export { errorHandler };
