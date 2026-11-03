import type { Request, Response } from "express";

export interface UserController {
  list: (req: Request, res: Response) => Promise<void>;
}

export interface PlaceController {
  list: (req: Request, res: Response) => Promise<void>;
}

export interface CategoryController {
  list: (req: Request, res: Response) => Promise<void>;
}
