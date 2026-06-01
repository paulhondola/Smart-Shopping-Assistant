export interface AppliedPromotionDto {
  promotionName: string;
  discount: number;
}

export interface CartItemGetDto {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CartGetDto {
  items: CartItemGetDto[];
  subtotal: number;
  appliedPromotions: AppliedPromotionDto[];
  totalDiscount: number;
  total: number;
}

export interface AddCartItemDto {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
