import { useState, useEffect } from "react";
import { productsApi } from "@/api/client/ProductApiClient";
import { categoriesApi } from "@/api/client/CategoryApiClient";
import { promotionsApi } from "@/api/client/PromotionsApiClient";
import type { Product } from "@/shared/types/Product";
import type { Category } from "@/shared/types/Category";
import type { Promotion } from "@/shared/types/Promotion";

interface LandingCounts {
  products: number;
  categories: number;
  activePromotions: number;
}

interface LandingData {
  featuredProducts: Product[];
  categories: Category[];
  activePromotions: Promotion[];
  counts: LandingCounts;
}

interface LandingDataState {
  data: LandingData | null;
  loading: boolean;
  error: string | null;
}

export const useLandingData = (): LandingDataState => {
  const [state, setState] = useState<LandingDataState>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function fetchAll() {
      try {
        const [products, categories, promotions] = await Promise.all([
          productsApi.getAll(),
          categoriesApi.getAll(),
          promotionsApi.getAll(),
        ]);
        const activePromotions = promotions.filter((p) => p.isActive);
        if (!cancelled) {
          setState({
            data: {
              featuredProducts: products.slice(0, 4),
              categories,
              activePromotions,
              counts: {
                products: products.length,
                categories: categories.length,
                activePromotions: activePromotions.length,
              },
            },
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Failed to load page data";
          setState({ data: null, loading: false, error: message });
        }
      }
    }

    fetchAll();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
};
