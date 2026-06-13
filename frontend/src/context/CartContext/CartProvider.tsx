import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Cart } from "@/shared/types/Cart";
import { cartApi } from "@/api/client/CartApiClient";
import { CartContext } from "./cart-context";
import { useAuth } from "@/context/AuthContext/auth-context";
import { queryKeys } from "@/lib/queryKeys";
import { showToast } from "@/lib/toast";

function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const { data: cart = null } = useQuery<Cart | null>({
    queryKey: queryKeys.cart,
    queryFn: cartApi.get,
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      qc.removeQueries({ queryKey: queryKeys.cart });
    }
  }, [user?.id, qc]);

  const addItemMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => cartApi.addItem({ productId, quantity }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.cart });
      showToast("Added to cart", "success");
    },
    onError: () => showToast("Cart update failed", "error"),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => cartApi.updateItem(productId, { quantity }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.cart });
      showToast("Quantity updated", "success");
    },
    onError: () => showToast("Cart update failed", "error"),
  });

  const removeProductMutation = useMutation({
    mutationFn: (productId: number) => cartApi.removeItem(productId),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.cart });
      showToast("Item removed", "success");
    },
    onError: () => showToast("Cart update failed", "error"),
  });

  const clearCartMutation = useMutation({
    mutationFn: cartApi.clearCart,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: queryKeys.cart });
      showToast("Cart cleared", "success");
    },
    onError: () => showToast("Failed to clear cart", "error"),
  });

  return (
    <CartContext.Provider
      value={{
        cart,
        open,
        openCart: () => setOpen(true),
        closeCart: () => setOpen(false),
        addItem: (productId, quantity) =>
          addItemMutation.mutateAsync({ productId, quantity }),
        updateQuantity: (productId, quantity) =>
          updateQuantityMutation.mutateAsync({ productId, quantity }),
        removeProduct: (productId) =>
          removeProductMutation.mutateAsync(productId),
        clearCart: () => clearCartMutation.mutateAsync(),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;
