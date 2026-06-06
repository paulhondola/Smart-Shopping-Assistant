export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface AppliedPromotion {
  promotionId: number;
  promotionName: string;
  discount: number;
}

export interface CartModel {
  items: CartItem[];
  subtotal: number;
  appliedPromotions: AppliedPromotion[];
  totalDiscount: number;
  total: number;
}

export interface AddCartItemInput {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}
