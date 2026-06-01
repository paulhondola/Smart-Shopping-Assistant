import type { ProductGetDto } from "../../api/models/ProductModel";

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  price: number;
  categories: string[];
}

export const toProduct = (dto: ProductGetDto): Product => ({ ...dto });
