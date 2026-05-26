export interface CategoryModel {
  id: number;
  name: string;
  description?: string;
}

export interface CategoryInput {
  name: string;
  description?: string;
}
