import type { Category } from "@weyfarer/types";
import type { CategoryRepository } from "../types/repositories.js";
import type { CategoryService } from "../types/services.js";

export function createCategoryService(
  categoryRepository: CategoryRepository,
): CategoryService {
  return {
    listCategories(): Promise<Category[]> {
      return categoryRepository.findAll();
    },
  };
}
