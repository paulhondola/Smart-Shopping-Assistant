import { createContext, useContext } from "react";
import type { Cart } from "@/shared/types/Cart";

export interface CartContextValue {
  cart: Cart | null;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  analyzeOpen: boolean;
  openAnalyze: () => void;
  closeAnalyze: () => void;
  addItem: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeProduct: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const context = useContext(CartContext);
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
