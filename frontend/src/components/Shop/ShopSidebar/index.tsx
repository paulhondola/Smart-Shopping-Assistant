import {
  Box,
  Chip,
  Divider,
  Slider,
  Typography,
} from "@mui/material";
import type { ShopFilters } from "../hooks/useShopFilters";
import { formatRON } from "@/shared/format/currency";

interface ShopSidebarProps {
  categories: string[];
  filters: ShopFilters;
  priceMin: number;
  priceMax: number;
  onUpdate: <K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) => void;
}

export function ShopSidebar({ categories, filters, priceMin, priceMax, onUpdate }: ShopSidebarProps) {
  function toggleCategory(name: string) {
    const next = filters.selectedCategories.includes(name)
      ? filters.selectedCategories.filter((c) => c !== name)
      : [...filters.selectedCategories, name];
    onUpdate("selectedCategories", next);
  }

  function handlePriceChange(_: Event, value: number | number[]) {
    onUpdate("priceRange", value as [number, number]);
  }

  return (
    <Box sx={{ width: 200, flexShrink: 0 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }} gutterBottom>
        Filters
      </Typography>

      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
        Categories
      </Typography>
      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {[...categories].sort().map((cat) => {
          const selected = filters.selectedCategories.includes(cat);
          return (
            <Chip
              key={cat}
              label={cat}
              size="small"
              onClick={() => toggleCategory(cat)}
              color={selected ? "primary" : "default"}
              variant={selected ? "filled" : "outlined"}
              sx={{ cursor: "pointer" }}
            />
          );
        })}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
        Price
      </Typography>
      <Box sx={{ px: 1, mt: 1 }}>
        <Slider
          value={filters.priceRange}
          onChange={handlePriceChange}
          min={priceMin}
          max={priceMax}
          valueLabelDisplay="auto"
          valueLabelFormat={(v) => formatRON(v)}
          disableSwap
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="caption" color="text.secondary">
            {formatRON(filters.priceRange[0])}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatRON(filters.priceRange[1])}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
