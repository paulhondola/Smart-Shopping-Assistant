import { http } from "../base/http";
import type { Promotion } from "../../shared/types/Promotion";
import { toPromotion } from "../../shared/types/Promotion";
import type {
  PromotionGetDto,
  PromotionCreateDto,
  PromotionUpdateDto,
} from "../models/PromotionsModel";

export const promotionsApi = {
  getAll: async (): Promise<Promotion[]> => {
    const data = await http.get<PromotionGetDto[]>("/promotions");
    return data.map(toPromotion);
  },

  create: async (data: PromotionCreateDto): Promise<Promotion> => {
    return toPromotion(
      await http.post<PromotionGetDto, PromotionCreateDto>("/promotions", data),
    );
  },

  update: async (id: number, data: PromotionUpdateDto): Promise<Promotion> => {
    return toPromotion(
      await http.put<PromotionGetDto, PromotionUpdateDto>(
        `/promotions/${id}`,
        data,
      ),
    );
  },

  remove: async (id: number) => {
    await http.remove<void>(`/promotions/${id}`);
  },
};
