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
import { useState } from "react";
import { useSearchParams } from "react-router";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
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
  const { data: products = [], isLoading: productsLoading, isError, error } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const loading = productsLoading || categoriesLoading;
  const [addingId, setAddingId] = useState<number | null>(null);

  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") ?? undefined;

  const { addItem } = useCart();
  const {
    filters,
    filteredProducts,
    priceMin,
    priceMax,
    updateFilter,
    clearFilters,
  } = useShopFilters(products, initialCategory);

  const categoryNames = categories.map((c) => c.name);
  const availableCategories =
    categoryNames.length > 0
      ? categoryNames
      : [...new Set(products.flatMap((p) => p.categories))];

  async function handleAddToCart(product: Product) {
    setAddingId(product.id);
    try {
      await addItem(product.id, 1);
    } finally {
      setAddingId(null);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: (t) =>
          `radial-gradient(ellipse at 85% 10%, ${t.palette.primary.main}0e 0%, transparent 50%), radial-gradient(ellipse at 15% 85%, ${t.palette.primary.main}0a 0%, transparent 45%)`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(error as Error).message}
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
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              label="Sort by"
              value={filters.sort}
              onChange={(e) =>
                updateFilter("sort", e.target.value as SortOption)
              }
            >
              {SORT_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

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
            <ShopSidebar
              categories={availableCategories}
              filters={filters}
              priceMin={priceMin}
              priceMax={priceMax}
              onUpdate={updateFilter}
            />

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
    </Box>
  );
}

export default Shop;
