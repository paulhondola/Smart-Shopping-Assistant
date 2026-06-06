import {
  Autocomplete,
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import type { Product } from "../../../shared/types/Product";
import type { ProductFilters } from "../hooks/useProductFilters";

interface ProductFilterBarProps {
  products: Product[];
  filters: ProductFilters;
  activeFilterCount: number;
  onFilterChange: <K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K],
  ) => void;
  onClearFilters: () => void;
}

export default function ProductFilterBar({
  products,
  filters,
  activeFilterCount,
  onFilterChange,
  onClearFilters,
}: ProductFilterBarProps) {
  const allCategories = Array.from(
    new Set(products.flatMap((p) => p.categories)),
  ).sort();

  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        flexWrap: "wrap",
        alignItems: "center",
        mb: 2,
        p: 2,
        bgcolor: "background.paper",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <TextField
        size="small"
        placeholder="Search by name or description…"
        value={filters.searchText}
        onChange={(e) => onFilterChange("searchText", e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
        sx={{ minWidth: 300 }}
      />

      <Autocomplete
        multiple
        size="small"
        options={allCategories}
        value={filters.selectedCategories}
        onChange={(_, value) => onFilterChange("selectedCategories", value)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option}
              size="small"
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} placeholder="Filter by category" />
        )}
        sx={{ minWidth: 240 }}
        disableCloseOnSelect
      />

      <TextField
        size="small"
        label="Min price"
        type="number"
        value={filters.minPrice}
        onChange={(e) => onFilterChange("minPrice", e.target.value)}
        slotProps={{ htmlInput: { min: 0, step: 100 } }}
        sx={{ width: 130 }}
      />

      <TextField
        size="small"
        label="Max price"
        type="number"
        value={filters.maxPrice}
        onChange={(e) => onFilterChange("maxPrice", e.target.value)}
        slotProps={{ htmlInput: { min: 0, step: 100 } }}
        sx={{ width: 130 }}
      />

      {activeFilterCount > 0 && (
        <Button
          size="small"
          variant="outlined"
          color="inherit"
          startIcon={<FilterListOffIcon />}
          onClick={onClearFilters}
        >
          Clear ({activeFilterCount})
        </Button>
      )}
    </Box>
  );
}
