import { http } from "../base/http";
import type { Product } from "../../shared/types/Product";
import { toProduct } from "../../shared/types/Product";
import type { ProductInput, ProductOutput } from "../models/ProductModel";

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const data = await http.get<ProductOutput[]>("/products");
    return data.map(toProduct);
  },

  create: async (data: ProductInput): Promise<Product> => {
    return toProduct(
      await http.post<ProductOutput, ProductInput>("/products", data),
    );
  },

  update: async (id: number, data: ProductInput): Promise<Product> => {
    return toProduct(
      await http.put<ProductOutput, ProductInput>(`/products/${id}`, data),
    );
  },

  remove: async (id: number) => {
    await http.remove<void>(`/products/${id}`);
  },

  getById: async (id: number): Promise<Product> => {
    return toProduct(await http.get<ProductOutput>(`/products/${id}`));
  },
};
