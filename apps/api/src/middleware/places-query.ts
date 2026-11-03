import type { RequestHandler } from "express";

export const placesQueryMiddleware: RequestHandler = (req, _res, next) => {
  const { categoryId } = req.query;

  const validCategoryId = typeof categoryId === "string" ? categoryId : null;

  req.validQuery = {
    ...(validCategoryId && { categoryId: validCategoryId }),
  };

  next();
};
