import type { User } from "@weyfarer/types";

declare global {
  namespace Express {
    interface Request {
      user?: User;
      validQuery?: unknown;
      validBody?: unknown;
    }
  }
}

export {};
