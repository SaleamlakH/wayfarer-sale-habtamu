import type { RequestHandler } from "express";

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
