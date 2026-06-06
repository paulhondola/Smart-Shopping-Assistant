import { useState, useMemo } from "react";
import type { Promotion } from "../../../shared/types/Promotion";

export type ActiveFilter = "all" | "active" | "inactive";
export type SortOrder = "none" | "asc" | "desc";

export interface PromotionFilters {
  searchText: string;
  activeFilter: ActiveFilter;
  sortOrder: SortOrder;
}

const EMPTY_FILTERS: PromotionFilters = {
  searchText: "",
  activeFilter: "all",
  sortOrder: "none",
};

export function usePromotionFilters(promotions: Promotion[]) {
  const [filters, setFilters] = useState<PromotionFilters>(EMPTY_FILTERS);

  const filteredPromotions = useMemo(() => {
    let result = promotions.filter((p) => {
      if (
        filters.searchText !== "" &&
        !p.name.toLowerCase().includes(filters.searchText.toLowerCase())
      ) {
        return false;
      }
      if (filters.activeFilter === "active" && !p.isActive) return false;
      if (filters.activeFilter === "inactive" && p.isActive) return false;
      return true;
    });

    if (filters.sortOrder === "asc") {
      result = [...result].sort((a, b) => a.rewardValue - b.rewardValue);
    } else if (filters.sortOrder === "desc") {
      result = [...result].sort((a, b) => b.rewardValue - a.rewardValue);
    }

    return result;
  }, [promotions, filters]);

  const activeFilterCount =
    (filters.searchText !== "" ? 1 : 0) +
    (filters.activeFilter !== "all" ? 1 : 0) +
    (filters.sortOrder !== "none" ? 1 : 0);

  function updateFilter<K extends keyof PromotionFilters>(
    key: K,
    value: PromotionFilters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
  }

  return { filters, filteredPromotions, activeFilterCount, updateFilter, clearFilters };
}
