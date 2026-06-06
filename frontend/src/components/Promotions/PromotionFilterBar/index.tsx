import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListOffIcon from "@mui/icons-material/FilterListOff";
import type { PromotionFilters } from "../hooks/usePromotionFilters";

interface PromotionFilterBarProps {
  filters: PromotionFilters;
  activeFilterCount: number;
  onFilterChange: <K extends keyof PromotionFilters>(
    key: K,
    value: PromotionFilters[K]
  ) => void;
  onClearFilters: () => void;
}

export default function PromotionFilterBar({
  filters,
  activeFilterCount,
  onFilterChange,
  onClearFilters,
}: PromotionFilterBarProps) {
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
        placeholder="Search by name…"
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
        sx={{ minWidth: 260 }}
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Active state</InputLabel>
        <Select
          label="Active state"
          value={filters.activeFilter}
          onChange={(e) =>
            onFilterChange(
              "activeFilter",
              e.target.value as PromotionFilters["activeFilter"]
            )
          }
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="active">Active only</MenuItem>
          <MenuItem value="inactive">Inactive only</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Sort by reward</InputLabel>
        <Select
          label="Sort by reward"
          value={filters.sortOrder}
          onChange={(e) =>
            onFilterChange(
              "sortOrder",
              e.target.value as PromotionFilters["sortOrder"]
            )
          }
        >
          <MenuItem value="none">None</MenuItem>
          <MenuItem value="asc">Reward value ↑</MenuItem>
          <MenuItem value="desc">Reward value ↓</MenuItem>
        </Select>
      </FormControl>

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
