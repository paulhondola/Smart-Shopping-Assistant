import { http } from "../base/http";
import type { Product } from "../../shared/types/Product";
import { toProduct } from "../../shared/types/Product";
import type {
  ProductGetDto,
  ProductCreateDto,
  ProductUpdateDto,
} from "../models/ProductModel";

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const data = await http.get<ProductGetDto[]>("/products");
    return data.map(toProduct);
  },

  create: async (data: ProductCreateDto): Promise<Product> => {
    return toProduct(
      await http.post<ProductGetDto, ProductCreateDto>("/products", data),
    );
  },

  update: async (id: number, data: ProductUpdateDto): Promise<Product> => {
    return toProduct(
      await http.put<ProductGetDto, ProductUpdateDto>(`/products/${id}`, data),
    );
  },

  remove: async (id: number) => {
    await http.remove<void>(`/products/${id}`);
  },
};
