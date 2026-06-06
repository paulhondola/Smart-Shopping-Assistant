import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { formatRON } from "@/shared/format/currency";
import type { Product } from "@/shared/types/Product";

interface ShopProductCardProps {
  product: Product;
  onAddToCart: () => void;
  loading?: boolean;
}

export function ShopProductCard({ product, onAddToCart, loading }: ShopProductCardProps) {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {product.imageUrl ? (
        <CardMedia
          component="img"
          height="160"
          image={product.imageUrl}
          alt={product.name}
          sx={{ objectFit: "cover" }}
        />
      ) : (
        <Box
          sx={{
            height: 160,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "action.hover",
          }}
        >
          <Typography variant="h6" color="text.secondary" noWrap sx={{ px: 1 }}>
            {product.name}
          </Typography>
        </Box>
      )}

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom noWrap>
          {product.name}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 1,
          }}
        >
          {product.description}
        </Typography>
        <Typography variant="subtitle2" color="primary">
          {formatRON(product.price)}
        </Typography>
      </CardContent>

      <CardActions sx={{ pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={onAddToCart}
          disabled={loading}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}
