import { Box, Alert, Container } from '@mui/material';
import { useLandingData } from './hooks/useLandingData';
import { HeroSection } from './sections/HeroSection';
import { StatsBar } from './sections/StatsBar';
import { FeaturedProductsSection } from './sections/FeaturedProductsSection';
import { CategoryGridSection } from './sections/CategoryGridSection';
import { DealsBannerSection } from './sections/DealsBannerSection';
import { AiFeatureSection } from './sections/AiFeatureSection';
import { FinalCtaSection } from './sections/FinalCtaSection';

function Home() {
  const { data, loading, error } = useLandingData();

  return (
    <Box sx={{ background: (t) => `linear-gradient(160deg, ${t.palette.primary.main}0e 0%, transparent 30%, transparent 70%, ${t.palette.primary.main}0a 100%)` }}>
      {error && (
        <Container maxWidth="lg" sx={{ pt: 2 }}>
          <Alert severity="warning" variant="outlined">
            Some content could not be loaded: {error}
          </Alert>
        </Container>
      )}

      <HeroSection />
      <StatsBar counts={data?.counts} loading={loading} />
      <FeaturedProductsSection products={data?.featuredProducts ?? []} loading={loading} />
      <CategoryGridSection categories={data?.categories ?? []} loading={loading} />
      <DealsBannerSection promotions={data?.activePromotions ?? []} categories={data?.categories ?? []} loading={loading} />
      <AiFeatureSection />
      <FinalCtaSection />
    </Box>
  );
}

export default Home;
