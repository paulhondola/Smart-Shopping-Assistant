import { Box, Container, Grid, Skeleton, Button } from '@mui/material';
import { SectionHeading } from '../parts/SectionHeading';
import { ProductCard } from '../parts/ProductCard';
import { Link as RouterLink } from 'react-router';
import type { Product } from '@/shared/types/Product';

interface FeaturedProductsSectionProps {
  products: Product[];
  loading: boolean;
}

export function FeaturedProductsSection({ products, loading }: FeaturedProductsSectionProps) {
  return (
    <Box
      component="section"
      aria-labelledby="featured-heading"
      sx={{ py: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="xl">
        <SectionHeading
          id="featured-heading"
          eyebrow="Hand-picked"
          title="Featured Products"
          description="Top picks from our catalog — updated with live pricing."
          action={
            <Button component={RouterLink} to="/products" variant="text" size="small">
              View all →
            </Button>
          }
        />

        <Grid container spacing={3}>
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Grid key={i} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <Skeleton variant="rectangular" height={420} sx={{ borderRadius: 2 }} />
                </Grid>
              ))
            : products.map((p) => (
                <Grid key={p.id} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <ProductCard product={p} />
                </Grid>
              ))}
        </Grid>
      </Container>
    </Box>
  );
}
