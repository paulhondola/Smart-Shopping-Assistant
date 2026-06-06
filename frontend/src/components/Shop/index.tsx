import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { productsApi } from "../../api/client/ProductApiClient";
import type { Product } from "../../shared/types/Product";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useCart } from "@/context/CardContext/cart-context";

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const { addItem } = useCart();

  const visibleProducts = useMemo(() => {
    return products.filter((product) =>
      product.name
        .toLocaleLowerCase()
        .includes(search.trim().toLocaleLowerCase()),
    );
  }, [products, search]);

  const handleAddToCart = async (product: Product) => {
    addItem(product.id, 1);
  };

  function loadProducts() {
    productsApi
      .getAll()
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error !== "" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Shop</Typography>
      </Box>
      <TextField
        label="Search products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            flexGrow: 1,
            alignContent: "start",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          {visibleProducts.map((product) => (
            <Card
              key={product.id}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                height="160"
                image={product.imageUrl}
                alt={product.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {product.description}
                </Typography>
                <Typography variant="subtitle1" sx={{ pt: 1 }}>
                  {product.priceLabel}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          ))}
          {visibleProducts.length === 0 && (
            <Typography>No products found.</Typography>
          )}
        </Box>
      )}
    </Container>
  );
}

export default Shop;
