import type { User } from "@weyfarer/types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
