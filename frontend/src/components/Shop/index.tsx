import {
  Alert,
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { productsApi } from "../../api/client/ProductApiClient";
import { categoriesApi } from "../../api/client/CategoryApiClient";
import type { Product } from "../../shared/types/Product";
import { useCart } from "@/context/CartContext/cart-context";
import { useShopFilters, type SortOption } from "./hooks/useShopFilters";
import { ShopSidebar } from "./ShopSidebar";
import { ShopProductCard } from "./ShopProductCard";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
];

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingId, setAddingId] = useState<number | null>(null);

  const { addItem } = useCart();
  const {
    filters,
    filteredProducts,
    priceMin,
    priceMax,
    updateFilter,
    clearFilters,
  } = useShopFilters(products);

  useEffect(() => {
    let cancelled = false;

    Promise.all([productsApi.getAll(), categoriesApi.getAll()])
      .then(([prods, cats]) => {
        if (cancelled) return;
        setProducts(prods);
        setCategoryNames(cats.map((c) => c.name));
        setError("");
      })
      .catch((err) => {
        if (!cancelled) setError((err as Error).message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAddToCart(product: Product) {
    setAddingId(product.id);
    try {
      await addItem(product.id, 1);
    } finally {
      setAddingId(null);
    }
  }

  // Derive categories list: prefer API result, fall back to product categories field
  const availableCategories =
    categoryNames.length > 0
      ? categoryNames
      : [...new Set(products.flatMap((p) => p.categories))];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      {/* Header row: title + sort */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h4">Shop</Typography>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select
            label="Sort by"
            value={filters.sort}
            onChange={(e) => updateFilter("sort", e.target.value as SortOption)}
          >
            {SORT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Search bar */}
      <TextField
        label="Search products"
        value={filters.search}
        onChange={(e) => updateFilter("search", e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        slotProps={{ htmlInput: { "aria-label": "Search products" } }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
          {/* Left sidebar */}
          <ShopSidebar
            categories={availableCategories}
            filters={filters}
            priceMin={priceMin}
            priceMax={priceMax}
            onUpdate={updateFilter}
          />

          {/* Product grid */}
          <Box
            sx={{
              flexGrow: 1,
              display: "grid",
              gap: 2,
              alignContent: "start",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            }}
          >
            {filteredProducts.map((product) => (
              <ShopProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                loading={addingId === product.id}
              />
            ))}
            {filteredProducts.length === 0 && (
              <Box sx={{ gridColumn: "1/-1", textAlign: "center", mt: 4 }}>
                <Typography color="text.secondary">
                  No products match your filters.{" "}
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={clearFilters}
                  >
                    Clear filters
                  </Typography>
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default Shop;
