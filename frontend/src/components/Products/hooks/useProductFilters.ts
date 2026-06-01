import { useState, useMemo } from "react";
import type { Product } from "../../../shared/types/Product";

export interface ProductFilters {
  searchText: string;
  selectedCategories: string[];
  minPrice: string;
  maxPrice: string;
}

const EMPTY_FILTERS: ProductFilters = {
  searchText: "",
  selectedCategories: [],
  minPrice: "",
  maxPrice: "",
};

export function useProductFilters(products: Product[]) {
  const [filters, setFilters] = useState<ProductFilters>(EMPTY_FILTERS);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (
        filters.searchText !== "" &&
        !product.name.toLowerCase().includes(filters.searchText.toLowerCase()) &&
        !product.description.toLowerCase().includes(filters.searchText.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.selectedCategories.length > 0 &&
        !filters.selectedCategories.some((cat) =>
          product.categories.includes(cat)
        )
      ) {
        return false;
      }

      const min = parseFloat(filters.minPrice);
      if (!isNaN(min) && product.price < min) return false;

      const max = parseFloat(filters.maxPrice);
      if (!isNaN(max) && product.price > max) return false;

      return true;
    });
  }, [products, filters]);

  const activeFilterCount =
    (filters.searchText !== "" ? 1 : 0) +
    filters.selectedCategories.length +
    (filters.minPrice !== "" ? 1 : 0) +
    (filters.maxPrice !== "" ? 1 : 0);

  function updateFilter<K extends keyof ProductFilters>(
    key: K,
    value: ProductFilters[K]
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters(EMPTY_FILTERS);
  }

  return { filters, filteredProducts, activeFilterCount, updateFilter, clearFilters };
}
