import { http } from "../base/http";
import type { Promotion } from "../../shared/types/Promotion";
import { toPromotion } from "../../shared/types/Promotion";
import type { PromotionInput, PromotionOutput } from "../models/PromotionsModel";

export const promotionsApi = {
  getAll: async (): Promise<Promotion[]> => {
    const data = await http.get<PromotionOutput[]>("/promotions");
    return data.map(toPromotion);
  },

  create: async (data: PromotionInput): Promise<Promotion> => {
    return toPromotion(
      await http.post<PromotionOutput, PromotionInput>("/promotions", data),
    );
  },

  update: async (id: number, data: PromotionInput): Promise<Promotion> => {
    return toPromotion(
      await http.put<PromotionOutput, PromotionInput>(
        `/promotions/${id}`,
        data,
      ),
    );
  },

  remove: async (id: number) => {
    await http.remove<void>(`/promotions/${id}`);
  },
};
