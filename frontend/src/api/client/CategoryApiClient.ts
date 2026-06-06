import { http } from "../base/http";
import type { Category } from "../../shared/types/Category";
import { toCategory } from "../../shared/types/Category";
import type { CategoryInput, CategoryOutput } from "../models/CategoryModel";

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const data = await http.get<CategoryOutput[]>("/categories");
    return data.map(toCategory);
  },

  create: async (data: CategoryInput): Promise<Category> => {
    return toCategory(
      await http.post<CategoryOutput, CategoryInput>("/categories", data),
    );
  },

  update: async (id: number, data: CategoryInput): Promise<Category> => {
    return toCategory(
      await http.put<CategoryOutput, CategoryInput>(
        `/categories/${id}`,
        data,
      ),
    );
  },

  remove: async (id: number) => {
    await http.remove<void>(`/categories/${id}`);
  },
};
