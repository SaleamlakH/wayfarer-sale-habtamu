import type {
  CreateReviewRequest,
  GetPlacesQuery,
  User,
} from "@weyfarer/types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validQuery?: GetPlacesQuery;
      validBody?: CreateReviewRequest;
    }
  }
}

export {};
