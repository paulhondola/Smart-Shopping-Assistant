import { useMemo } from "react";
import { Box, Alert, Container } from "@mui/material";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { usePromotions } from "@/hooks/usePromotions";
import { HeroSection } from "./sections/HeroSection";
import { StatsBar } from "./sections/StatsBar";
import { FeaturedProductsSection } from "./sections/FeaturedProductsSection";
import { CategoryGridSection } from "./sections/CategoryGridSection";
import { DealsBannerSection } from "./sections/DealsBannerSection";
import { AiFeatureSection } from "./sections/AiFeatureSection";
import { FinalCtaSection } from "./sections/FinalCtaSection";

function Home() {
  const { data: products = [], isLoading: productsLoading, isError: productsError } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError } = useCategories();
  const { data: promotions = [], isLoading: promotionsLoading, isError: promotionsError } = usePromotions();

  const loading = productsLoading || categoriesLoading || promotionsLoading;
  const hasError = productsError || categoriesError || promotionsError;

  const featuredProducts = useMemo(() => products.slice(0, 4), [products]);
  const activePromotions = useMemo(() => promotions.filter((p) => p.isActive), [promotions]);
  const counts = useMemo(
    () => ({
      products: products.length,
      categories: categories.length,
      activePromotions: activePromotions.length,
    }),
    [products.length, categories.length, activePromotions.length],
  );

  return (
    <Box
      sx={{
        background: (t) =>
          `linear-gradient(160deg, ${t.palette.primary.main}0e 0%, transparent 30%, transparent 70%, ${t.palette.primary.main}0a 100%)`,
      }}
    >
      {hasError && (
        <Container maxWidth="lg" sx={{ pt: 2 }}>
          <Alert severity="warning" variant="outlined">
            Some content could not be loaded.
          </Alert>
        </Container>
      )}

      <HeroSection />
      <StatsBar counts={counts} loading={loading} />
      <FeaturedProductsSection products={featuredProducts} loading={loading} />
      <CategoryGridSection categories={categories} loading={loading} />
      <DealsBannerSection
        promotions={activePromotions}
        categories={categories}
        loading={loading}
      />
      <AiFeatureSection />
      <FinalCtaSection />
    </Box>
  );
}

export default Home;
