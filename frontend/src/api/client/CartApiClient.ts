import { type Cart, toCartModel } from "@/shared/types/Cart";
import { http } from "../base/http";
import type {
  AddCartItemInput,
  CartModel,
  UpdateCartItemInput,
} from "../models/CartModel";

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
};
