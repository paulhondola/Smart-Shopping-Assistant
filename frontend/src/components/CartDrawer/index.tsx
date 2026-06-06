import {
  Box,
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
import { useCart } from "../../context/CartContext/cart-context";

function CartDrawer() {
  const { cart, open, closeCart, updateQuantity, removeProduct } = useCart();

  const isEmpty = cart === null || cart.items.length === 0;

  return (
    <Drawer anchor="right" open={open} onClose={closeCart}>
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
          <IconButton onClick={closeCart}>
            <CloseIcon />
          </IconButton>
        </Box>

        {isEmpty ? (
          <Typography color="text.secondary">Your cart is empty.</Typography>
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
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography>{item.productName}</Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeProduct(item.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {/* Unit price + item total on the same row */}
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
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography
                      sx={{ mx: 1, minWidth: 24, textAlign: "center" }}
                    >
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
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

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
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
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
}

export default CartDrawer;
