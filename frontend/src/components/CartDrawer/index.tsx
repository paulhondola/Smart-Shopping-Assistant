import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useCart } from "@/context/CartContext/cart-context";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AnalyzeDialog from "./AnalyzeDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import EmptyState from "@/components/common/EmptyState";

function CartDrawer() {
  const { cart, open, closeCart, analyzeOpen, openAnalyze, closeAnalyze, updateQuantity, removeProduct, clearCart } = useCart();
  const navigate = useNavigate();

  const isEmpty = cart === null || cart.items.length === 0;

  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  return (
    <Drawer anchor="right" open={open} onClose={closeCart} slotProps={{ paper: { sx: { bgcolor: "background.default" } } }} aria-label="Shopping cart">
      <Box
        sx={{
          width: 800,
          p: 2,
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="h6">Your Cart</Typography>
          <IconButton onClick={closeCart} aria-label="Close cart">
            <CloseIcon />
          </IconButton>
        </Box>

        {isEmpty ? (
          <EmptyState
            icon={<ShoppingBagIcon />}
            title="Your cart is empty"
            description="Browse the shop and add items to get started."
            action={{ label: "Go to Shop", onClick: () => { closeCart(); navigate("/shop"); } }}
          />
        ) : (
          <>
            <List sx={{ flexGrow: 1, overflowY: "auto" }}>
              {cart.items.map((item) => (
                <ListItem
                  key={item.id}
                  divider
                  disableGutters
                  sx={{ display: "block", py: 1.5 }}
                >
                  <Box sx={{ display: "flex", gap: 1.5 }}>
                    <Avatar
                      src={item.imageUrl}
                      alt={item.productName}
                      variant="rounded"
                      sx={{ width: 64, height: 64, flexShrink: 0 }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography noWrap>{item.productName}</Typography>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => removeProduct(item.id)}
                          aria-label={`Remove ${item.productName}`}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      {/* Unit price + item total */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "baseline",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {item.unitPriceLabel} × {item.quantity}
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {item.subtotalLabel}
                        </Typography>
                      </Box>

                      {/* Quantity controls */}
                      <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1, minWidth: 24, textAlign: "center" }}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              ))}
            </List>

            <Divider />

            <Box sx={{ pt: 2 }}>
              {/* Subtotal */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 0.5,
                }}
              >
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography>{cart.subtotalLabel}</Typography>
              </Box>

              {/* Promotions block — only shown when at least one promo is applied */}
              {cart.appliedPromotions.length > 0 && (
                <Box
                  sx={{
                    bgcolor: "action.hover",
                    borderRadius: 1,
                    px: 2,
                    py: 1.5,
                    my: 1.5,
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: "block",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      mb: 1,
                    }}
                  >
                    Promotions Applied
                  </Typography>

                  {cart.appliedPromotions.map((promotion) => (
                    <Box
                      key={promotion.promotionId}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="body2">
                        {promotion.promotionName}
                      </Typography>
                      <Typography variant="body2" color="success.main">
                        −{promotion.discountLabel}
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 1 }} />

                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ fontWeight: 700 }}
                    >
                      You save
                    </Typography>
                    <Typography
                      variant="body2"
                      color="success.main"
                      sx={{ fontWeight: 700 }}
                    >
                      −{cart.totalDiscountLabel}
                    </Typography>
                  </Box>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              {/* Total */}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">{cart.totalLabel}</Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={() => setConfirmClearOpen(true)}
                sx={{ mt: 1 }}
              >
                Clear cart
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<AutoAwesomeIcon />}
                onClick={openAnalyze}
                sx={{ mt: 2 }}
              >
                AI Analyze
              </Button>
            </Box>
            <ConfirmDialog
              open={confirmClearOpen}
              title="Clear cart?"
              description="Remove all items from your cart?"
              confirmLabel="Clear"
              onConfirm={async () => {
                setConfirmClearOpen(false);
                await clearCart();
              }}
              onCancel={() => setConfirmClearOpen(false)}
            />
          </>
        )}
      </Box>
      {analyzeOpen && <AnalyzeDialog onClose={closeAnalyze} />}
    </Drawer>
  );
}

export default CartDrawer;
