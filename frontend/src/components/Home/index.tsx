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
    <Box>
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
      <DealsBannerSection promotions={data?.activePromotions ?? []} loading={loading} />
      <AiFeatureSection />
      <FinalCtaSection />
    </Box>
  );
}

export default Home;
