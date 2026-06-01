import type {
  PromotionGetDto,
  PromotionType,
  PromotionReward,
} from "../../api/models/PromotionsModel";

export interface Promotion {
  id: number;
  name: string;
  type: PromotionType;
  threshold: number;
  reward: PromotionReward;
  rewardValue: number;
  productId?: number;
  categoryId?: number;
  isActive: boolean;
}

export const promotionTypeLabel: Record<PromotionType, string> = {
  0: "Quantity",
  1: "Cart Total",
};

export const promotionRewardLabel: Record<PromotionReward, string> = {
  0: "Free Items",
  1: "% Discount",
};

export const toPromotion = (dto: PromotionGetDto): Promotion => ({ ...dto });
