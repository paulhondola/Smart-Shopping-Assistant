import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useCart } from "@/context/CardContext/cart-context";
import type { CartItem } from "@/shared/types/Cart";

// Per-item async action tracking
type ActionKey = `qty-${number}` | `rm-${number}`;

export default function Cart() {
  const { cart, open, closeCart, updateQuantity, removeProduct } = useCart();
  const [pending, setPending] = useState<Set<ActionKey>>(new Set());
  const [toast, setToast] = useState("");

  async function handleQty(item: CartItem, delta: number) {
    const next = item.quantity + delta;
    if (next < 1) return;
    const key: ActionKey = `qty-${item.id}`;
    setPending((s) => new Set(s).add(key));
    try {
      await updateQuantity(item.id, next);
    } catch {
      setToast("Failed to update quantity.");
    } finally {
      setPending((s) => { const n = new Set(s); n.delete(key); return n; });
    }
  }

  async function handleRemove(item: CartItem) {
    const key: ActionKey = `rm-${item.id}`;
    setPending((s) => new Set(s).add(key));
    try {
      await removeProduct(item.id);
    } catch {
      setToast("Failed to remove item.");
    } finally {
      setPending((s) => { const n = new Set(s); n.delete(key); return n; });
    }
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={closeCart}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "100vw", sm: 420 },
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.5)",
            },
          },
        }}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2.5,
            borderBottom: 1,
            borderColor: "divider",
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
              variant="h6"
              sx={{ fontFamily: "Georgia, serif", letterSpacing: 0.5 }}
            >
              Your Cart
            </Typography>
            {!isEmpty && (
              <Badge
                badgeContent={cart.itemCount}
                color="primary"
                sx={{ "& .MuiBadge-badge": { position: "static", transform: "none" } }}
              />
            )}
          </Box>
          <IconButton onClick={closeCart} size="small" edge="end" aria-label="Close cart">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* ── Scrollable items ────────────────────────────── */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 3, py: 2 }}>
          {isEmpty ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                gap: 2,
                color: "text.secondary",
                textAlign: "center",
                py: 8,
              }}
            >
              <ShoppingBagOutlinedIcon sx={{ fontSize: 64, opacity: 0.3 }} />
              <Typography variant="body1" sx={{ opacity: 0.6 }}>
                Your cart is empty.
              </Typography>
              <Button variant="outlined" color="inherit" onClick={closeCart} size="small">
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {cart.items.map((item, idx) => {
                const isQtyPending = pending.has(`qty-${item.id}`);
                const isRmPending = pending.has(`rm-${item.id}`);
                const isAnyPending = isQtyPending || isRmPending;

                return (
                  <Box key={item.id}>
                    {idx > 0 && <Divider sx={{ my: 2 }} />}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                        opacity: isAnyPending ? 0.5 : 1,
                        transition: "opacity 0.15s ease",
                      }}
                    >
                      {/* Product name + remove */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <Typography
                          variant="body1"
                          sx={{ fontFamily: "Georgia, serif", lineHeight: 1.35, pr: 1 }}
                        >
                          {item.productName}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleRemove(item)}
                          disabled={isAnyPending}
                          aria-label={`Remove ${item.productName}`}
                          sx={{ color: "text.secondary", flexShrink: 0, "&:hover": { color: "error.main" } }}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Unit price + qty controls + subtotal */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="caption" color="text.secondary">
                          {item.unitPriceLabel} × {item.quantity}
                        </Typography>

                        {/* Quantity controls */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            border: 1,
                            borderColor: "divider",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => handleQty(item, -1)}
                            disabled={isAnyPending || item.quantity <= 1}
                            sx={{ borderRadius: 0, px: 0.75 }}
                            aria-label="Decrease quantity"
                          >
                            <RemoveIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                          <Typography
                            variant="body2"
                            sx={{
                              minWidth: 28,
                              textAlign: "center",
                              fontVariantNumeric: "tabular-nums",
                              userSelect: "none",
                            }}
                          >
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQty(item, +1)}
                            disabled={isAnyPending}
                            sx={{ borderRadius: 0, px: 0.75 }}
                            aria-label="Increase quantity"
                          >
                            <AddIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>

                        <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums", minWidth: 90, textAlign: "right" }}>
                          {item.subtotalLabel}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}
        </Box>

        {/* ── Sticky footer: totals + checkout ───────────── */}
        {!isEmpty && (
          <Box
            sx={{
              flexShrink: 0,
              borderTop: 1,
              borderColor: "divider",
              px: 3,
              pt: 2.5,
              pb: 3,
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {/* Subtotal */}
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
                {cart.subtotalLabel}
              </Typography>
            </Box>

            {/* Applied promotions */}
            {cart.appliedPromotions.map((promo) => (
              <Box key={promo.promotionId} sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                  {promo.promotionName}
                </Typography>
                <Typography variant="body2" color="success.main" sx={{ fontVariantNumeric: "tabular-nums" }}>
                  −{promo.discountLabel}
                </Typography>
              </Box>
            ))}

            {cart.totalDiscount > 0 && (
              <>
                <Divider sx={{ my: 0.5 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">Discount</Typography>
                  <Typography variant="body2" color="success.main" sx={{ fontVariantNumeric: "tabular-nums" }}>
                    −{cart.totalDiscountLabel}
                  </Typography>
                </Box>
              </>
            )}

            <Divider sx={{ my: 0.5 }} />

            {/* Total */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <Typography variant="subtitle1" sx={{ fontFamily: "Georgia, serif" }}>
                Total
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Georgia, serif",
                  color: "primary.main",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {cart.totalLabel}
              </Typography>
            </Box>

            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                py: 1.5,
                fontFamily: "Georgia, serif",
                fontSize: "0.95rem",
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Proceed to Checkout
            </Button>
          </Box>
        )}
      </Drawer>

      <Snackbar
        open={toast !== ""}
        autoHideDuration={3500}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="error" onClose={() => setToast("")} variant="filled">
          {toast}
        </Alert>
      </Snackbar>
    </>
  );
}
