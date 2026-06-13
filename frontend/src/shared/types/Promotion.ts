import type {
  PromotionOutput,
  PromotionType,
  PromotionReward,
} from "@/api/models/PromotionsModel";

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

export const toPromotion = (dto: PromotionOutput): Promotion => ({ ...dto });

export function formatPromotionReward(p: Promotion): string {
  if (p.reward === 0) {
    return `Buy ${p.threshold}, Get ${p.rewardValue} Free`;
  }
  const scope =
    p.type === 0
      ? `on ${p.threshold}+ items`
      : `on orders over ${p.threshold} RON`;
  return `${p.rewardValue}% off ${scope}`;
}
