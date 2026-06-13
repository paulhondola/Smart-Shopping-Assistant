import { useState, useMemo } from "react";
import type { Category } from "@/shared/types/Category";

export interface CategoryFilters {
  searchText: string;
}

const EMPTY_FILTERS: CategoryFilters = {
  searchText: "",
};

export function useCategoryFilters(categories: Category[]) {
  const [filters, setFilters] = useState<CategoryFilters>(EMPTY_FILTERS);

  const filteredCategories = useMemo(() => {
    if (filters.searchText === "") return categories;
    const q = filters.searchText.toLowerCase();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }, [categories, filters]);

  const activeFilterCount = filters.searchText !== "" ? 1 : 0;

  function updateFilter<K extends keyof CategoryFilters>(
    key: K,
    value: CategoryFilters[K],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
  }

  return {
    filters,
    filteredCategories,
    activeFilterCount,
    updateFilter,
    clearFilters,
  };
}
