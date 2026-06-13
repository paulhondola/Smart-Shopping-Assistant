import type { CategoryOutput } from "@/api/models/CategoryModel";

export interface Category {
  id: number;
  name: string;
  description: string;
}

export const toCategory = (dto: CategoryOutput): Category => ({
  id: dto.id,
  name: dto.name,
  description: dto.description ?? "",
});
