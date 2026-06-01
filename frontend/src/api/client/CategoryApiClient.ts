import { http } from "../base/http";
import type { Category } from "../../shared/types/Category";
import { toCategory } from "../../shared/types/Category";
import type {
  CategoryGetDto,
  CategoryCreateDto,
  CategoryUpdateDto,
} from "../models/CategoryModel";

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const data = await http.get<CategoryGetDto[]>("/categories");
    return data.map(toCategory);
  },

  create: async (data: CategoryCreateDto): Promise<Category> => {
    return toCategory(
      await http.post<CategoryGetDto, CategoryCreateDto>("/categories", data),
    );
  },

  update: async (id: number, data: CategoryUpdateDto): Promise<Category> => {
    return toCategory(
      await http.put<CategoryGetDto, CategoryUpdateDto>(
        `/categories/${id}`,
        data,
      ),
    );
  },

  remove: async (id: number) => {
    await http.remove<void>(`/categories/${id}`);
  },
};
