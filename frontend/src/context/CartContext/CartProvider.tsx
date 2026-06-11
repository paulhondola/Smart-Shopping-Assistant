import { useEffect, useState, type ReactNode } from "react";
import type { Cart } from "@/shared/types/Cart";
import { cartApi } from "@/api/client/CartApiClient";
import { CartContext } from "./cart-context";
import { useAuth } from "@/context/AuthContext/auth-context";

function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [open, setOpen] = useState(false);

  const loadCart = () => {
    cartApi.get().then(setCart).catch(() => setCart(null));
  };

  async function addItem(productId: number, quantity: number) {
    await cartApi.addItem({ productId, quantity });
    loadCart();
  }

  async function updateQuantity(productId: number, quantity: number) {
    await cartApi.updateItem(productId, { quantity });
    loadCart();
  }

  async function removeProduct(productId: number) {
    await cartApi.removeItem(productId);
    loadCart();
  }

  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [user?.id]);

  return (
    <CartContext.Provider
      value={{
        cart,
        open,
        openCart: () => setOpen(true),
        closeCart: () => setOpen(false),
        addItem,
        updateQuantity,
        removeProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
