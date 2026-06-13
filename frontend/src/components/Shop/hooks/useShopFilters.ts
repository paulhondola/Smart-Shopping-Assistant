import { useMemo, useState } from "react";
import type { Product } from "../../../shared/types/Product";

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc";

export interface ShopFilters {
  search: string;
  selectedCategories: string[];
  priceRange: [number, number];
  sort: SortOption;
}

function buildDefaultFilters(products: Product[], initialCategory?: string): ShopFilters {
  const prices = products.map((p) => p.price);
  const min = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const max = prices.length ? Math.ceil(Math.max(...prices)) : 10000;
  return {
    search: "",
    selectedCategories: initialCategory ? [initialCategory] : [],
    priceRange: [min, max],
    sort: "price-asc",
  };
}

export function useShopFilters(products: Product[], initialCategory?: string) {
  const [filters, setFilters] = useState<ShopFilters>(() =>
    buildDefaultFilters(products, initialCategory)
  );

  const priceMin = useMemo(
    () => (products.length ? Math.floor(Math.min(...products.map((p) => p.price))) : 0),
    [products]
  );
  const priceMax = useMemo(
    () => (products.length ? Math.ceil(Math.max(...products.map((p) => p.price))) : 10000),
    [products]
  );

  // Reset range when products first load (after async fetch resolves)
  const hasProducts = products.length > 0;
  useMemo(() => {
    if (hasProducts) {
      setFilters((prev) => {
        const isDefaultRange = prev.priceRange[0] === 0 && prev.priceRange[1] === 10000;
        if (isDefaultRange) {
          return { ...prev, priceRange: [priceMin, priceMax] };
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasProducts]);

  const filteredProducts = useMemo(() => {
    const { search, selectedCategories, priceRange, sort } = filters;
    const term = search.trim().toLowerCase();

    const matched = products.filter((product) => {
      if (term && !product.name.toLowerCase().includes(term) && !product.description.toLowerCase().includes(term)) {
        return false;
      }
      if (selectedCategories.length > 0 && !selectedCategories.some((cat) => product.categories.includes(cat))) {
        return false;
      }
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false;
      }
      return true;
    });

    return matched.sort((a, b) => {
      switch (sort) {
        case "price-asc":  return a.price - b.price;
        case "price-desc": return b.price - a.price;
        case "name-asc":   return a.name.localeCompare(b.name);
        case "name-desc":  return b.name.localeCompare(a.name);
      }
    });
  }, [products, filters]);

  function updateFilter<K extends keyof ShopFilters>(key: K, value: ShopFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    setFilters({ search: "", selectedCategories: [], priceRange: [priceMin, priceMax], sort: "price-asc" });
  }

  return { filters, filteredProducts, priceMin, priceMax, updateFilter, clearFilters };
}
