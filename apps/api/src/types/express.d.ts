import type { GetPlacesQuery, User } from "@weyfarer/types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validQuery?: GetPlacesQuery;
    }
  }
}

export {};
