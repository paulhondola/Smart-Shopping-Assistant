import { Box, Container, Skeleton, Chip } from '@mui/material';
import { SectionHeading } from '../parts/SectionHeading';
import { PromotionCard } from '../parts/PromotionCard';
import type { Promotion } from '@/shared/types/Promotion';
import type { Category } from '@/shared/types/Category';

interface DealsBannerSectionProps {
  promotions: Promotion[];
  categories: Category[];
  loading: boolean;
}

export function DealsBannerSection({ promotions, categories, loading }: DealsBannerSectionProps) {
  if (!loading && promotions.length === 0) return null;

  return (
    <Box
      component="section"
      aria-labelledby="deals-heading"
      sx={{ py: { xs: 8, md: 12 } }}
    >
      <Container maxWidth="xl">
        <SectionHeading
          id="deals-heading"
          eyebrow="Limited time"
          title="Active Deals"
          action={
            !loading && promotions.length > 0 ? (
              <Chip
                label={`${promotions.length} active`}
                size="small"
                color="primary"
                variant="outlined"
              />
            ) : undefined
          }
        />

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            overflowX: { xs: 'auto', md: 'visible' },
            flexWrap: { xs: 'nowrap', md: 'wrap' },
            scrollSnapType: { xs: 'x mandatory', md: 'none' },
            pb: { xs: 1, md: 0 },
          }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  width={280}
                  height={180}
                  sx={{ borderRadius: 2, flexShrink: 0 }}
                />
              ))
            : promotions.map((p) => {
                const categoryName = p.categoryId
                  ? categories.find((c) => c.id === p.categoryId)?.name
                  : undefined;
                return (
                  <Box
                    key={p.id}
                    sx={{
                      scrollSnapAlign: { xs: 'start', md: 'none' },
                      flex: { xs: '0 0 280px', md: '1 1 300px' },
                      maxWidth: { md: 360 },
                    }}
                  >
                    <PromotionCard promotion={p} categoryName={categoryName} />
                  </Box>
                );
              })}
        </Box>
      </Container>
    </Box>
  );
}
