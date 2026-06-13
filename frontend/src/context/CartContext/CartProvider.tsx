import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Cart } from "@/shared/types/Cart";
import { cartApi } from "@/api/client/CartApiClient";
import { CartContext } from "./cart-context";
import { useAuth } from "@/context/AuthContext/auth-context";
import { queryKeys } from "@/lib/queryKeys";
import { showToast } from "@/lib/toast";

function ron(v: number) {
  return `${v.toFixed(2)} RON`;
}

function applyQuantityUpdate(cart: Cart, itemId: number, quantity: number): Cart {
  const items = cart.items.map((item) =>
    item.id === itemId
      ? { ...item, quantity, subtotal: item.unitPrice * quantity, subtotalLabel: ron(item.unitPrice * quantity) }
      : item,
  );
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  return {
    ...cart,
    items,
    subtotal,
    subtotalLabel: ron(subtotal),
    total: subtotal - cart.totalDiscount,
    totalLabel: ron(subtotal - cart.totalDiscount),
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
  };
}

function applyRemoveItem(cart: Cart, itemId: number): Cart {
  const items = cart.items.filter((item) => item.id !== itemId);
  const subtotal = items.reduce((s, i) => s + i.subtotal, 0);
  const promotions = items.length > 0 ? cart.appliedPromotions : [];
  const totalDiscount = promotions.reduce((s, p) => s + p.discount, 0);
  return {
    ...cart,
    items,
    subtotal,
    subtotalLabel: ron(subtotal),
    appliedPromotions: promotions,
    totalDiscount,
    totalDiscountLabel: ron(totalDiscount),
    total: subtotal - totalDiscount,
    totalLabel: ron(subtotal - totalDiscount),
    itemCount: items.reduce((s, i) => s + i.quantity, 0),
  };
}

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
    mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
      cartApi.updateItem(productId, { quantity }),
    onMutate: async ({ productId, quantity }) => {
      await qc.cancelQueries({ queryKey: queryKeys.cart });
      const prev = qc.getQueryData<Cart | null>(queryKeys.cart);
      if (prev) qc.setQueryData<Cart | null>(queryKeys.cart, applyQuantityUpdate(prev, productId, quantity));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(queryKeys.cart, ctx.prev);
      showToast("Cart update failed", "error");
    },
    onSettled: () => void qc.invalidateQueries({ queryKey: queryKeys.cart }),
  });

  const removeProductMutation = useMutation({
    mutationFn: (productId: number) => cartApi.removeItem(productId),
    onMutate: async (itemId) => {
      await qc.cancelQueries({ queryKey: queryKeys.cart });
      const prev = qc.getQueryData<Cart | null>(queryKeys.cart);
      if (prev) qc.setQueryData<Cart | null>(queryKeys.cart, applyRemoveItem(prev, itemId));
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev !== undefined) qc.setQueryData(queryKeys.cart, ctx.prev);
      showToast("Cart update failed", "error");
    },
    onSettled: () => void qc.invalidateQueries({ queryKey: queryKeys.cart }),
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
