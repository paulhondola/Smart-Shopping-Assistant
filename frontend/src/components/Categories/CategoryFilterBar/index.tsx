import { Box, Button, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import type { CategoryFilters } from "../hooks/useCategoryFilters";

interface CategoryFilterBarProps {
  filters: CategoryFilters;
  activeFilterCount: number;
  onFilterChange: <K extends keyof CategoryFilters>(
    key: K,
    value: CategoryFilters[K]
  ) => void;
  onClearFilters: () => void;
}

export default function CategoryFilterBar({
  filters,
  activeFilterCount,
  onFilterChange,
  onClearFilters,
}: CategoryFilterBarProps) {
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
