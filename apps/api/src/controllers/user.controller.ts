import type { Request, Response } from "express";
import type { UserController } from "../types/controllers.js";
import type { UserService } from "../types/services.js";

function createUserController(userService: UserService): UserController {
  return {
    list: async (_req: Request, res: Response): Promise<void> => {
      const users = await userService.listUsers();
      res.json(users);
    },
  };
}

export { createUserController };
