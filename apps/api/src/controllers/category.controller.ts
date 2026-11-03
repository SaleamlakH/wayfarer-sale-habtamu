import type { Request, Response } from "express";
import type { CategoryController } from "../types/controllers.js";
import type { CategoryService } from "../types/services.js";

export function createCategoryController(
  categoryService: CategoryService,
): CategoryController {
  return {
    list: async (_req: Request, res: Response): Promise<void> => {
      const categories = await categoryService.listCategories();
      res.json(categories);
    },
  };
}
