import type { Request, Response } from "express";

interface UserController {
  list: (req: Request, res: Response) => Promise<void>;
}

export type { UserController };
