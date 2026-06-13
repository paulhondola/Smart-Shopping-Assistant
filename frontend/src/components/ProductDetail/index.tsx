import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import { useProduct } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext/cart-context";
import { formatRON } from "@/shared/format/currency";

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const id = parseInt(productId ?? "", 10);

  const { data: product, isLoading, isError } = useProduct(id);
  const { addItem } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        component={Link}
        to="/shop"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Back to Shop
      </Button>

      {isLoading && <CircularProgress />}
      {isError && <Alert severity="error">Failed to load product.</Alert>}
      {product && (
        <Box
          sx={{
            display: "flex",
            gap: 4,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* Image */}
          <Box sx={{ flexShrink: 0, width: { xs: "100%", md: 360 } }}>
            {product.imageUrl ? (
              <Box
                component="img"
                src={product.imageUrl}
                alt={product.name}
                sx={{
                  width: "100%",
                  borderRadius: 2,
                  objectFit: "cover",
                  maxHeight: 400,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <Box
                sx={{
                  width: "100%",
                  height: 300,
                  bgcolor: "action.hover",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BrokenImageIcon sx={{ fontSize: 64, color: "text.disabled" }} />
              </Box>
            )}
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
              {product.name}
            </Typography>

            {product.categories.length > 0 && (
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                {product.categories.map((cat) => (
                  <Chip key={cat} label={cat} size="small" />
                ))}
              </Box>
            )}

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {product.description}
            </Typography>

            <Typography
              variant="h5"
              color="primary"
              sx={{ fontWeight: 700, mb: 3 }}
            >
              {formatRON(product.price)}
            </Typography>

            {/* Quantity + Add to Cart */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <TextField
                type="number"
                label="Qty"
                value={quantity}
                onChange={(e) => {
                  const parsed = parseInt(e.target.value, 10);
                  if (!isNaN(parsed)) setQuantity(Math.max(1, Math.min(10, parsed)));
                }}
                slotProps={{ htmlInput: { min: 1, max: 10 } }}
                sx={{ width: 80 }}
                size="small"
              />
              <Button
                variant="contained"
                startIcon={<AddShoppingCartIcon />}
                disabled={adding}
                onClick={async () => {
                  setAdding(true);
                  try {
                    await addItem(product.id, quantity);
                  } finally {
                    setAdding(false);
                  }
                }}
              >
                {adding ? "Adding..." : "Add to Cart"}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}
