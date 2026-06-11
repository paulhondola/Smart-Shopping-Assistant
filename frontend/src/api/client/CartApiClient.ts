import { type Cart, toCartModel } from "@/shared/types/Cart";
import { http } from "@/api/base/http";
import type {
  AddCartItemInput,
  CartModel,
  UpdateCartItemInput,
} from "@/api/models/CartModel";
import { type Analysis, toAnalysis } from "@/shared/types/Analysis";
import type { AnalysisModel } from "@/api/models/AnalysisModel";

export const cartApi = {
  get: async (): Promise<Cart> => {
    return toCartModel(await http.get<CartModel>("/cart"));
  },
  addItem: async (data: AddCartItemInput): Promise<void> => {
    await http.post("/cart/items", data);
  },
  updateItem: async (
    itemId: number,
    data: UpdateCartItemInput,
  ): Promise<void> => {
    await http.put(`/cart/items/${itemId}`, data);
  },
  removeItem: (itemId: number) => http.remove<void>(`/cart/items/${itemId}`),
  analyze: async (): Promise<Analysis> => {
    return toAnalysis(await http.get<AnalysisModel>("/cart/analyze"));
  },
};
