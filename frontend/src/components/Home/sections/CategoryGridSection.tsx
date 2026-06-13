import { Box, Container, Grid, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import { SectionHeading } from '../parts/SectionHeading';
import { CategoryTile } from '../parts/CategoryTile';
import type { Category } from '@/shared/types/Category';

interface CategoryGridSectionProps {
  categories: Category[];
  loading: boolean;
}

// All named areas must be contiguous rectangles — L-shapes are CSS-invalid and silently dropped.
const BENTO_AREAS: Record<number, string> = {
  4: '"a a b c" "a a d c"',
  3: '"a a b" "a a c"',
};

const GRID_AREAS = ['a', 'b', 'c', 'd'];

export function CategoryGridSection({ categories, loading }: CategoryGridSectionProps) {
  const theme = useTheme();
  const isMd = useMediaQuery(theme.breakpoints.up('md'));
  const featured = categories.slice(0, 4);
  const useBento = isMd && featured.length >= 3;
  const count = Math.min(featured.length, 4);
  const bentoTemplate = BENTO_AREAS[count] ?? BENTO_AREAS[3];

  return (
    <Box
      component="section"
      aria-labelledby="categories-heading"
      sx={{ py: { xs: 8, md: 12 }, background: (t) => `radial-gradient(ellipse at 85% 15%, ${t.palette.primary.main}12 0%, transparent 55%), #181816` }}
    >
      <Container maxWidth="xl">
        <SectionHeading id="categories-heading" eyebrow="Browse" title="Shop by Category" />

        {loading ? (
          <Grid container spacing={2}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Grid key={i} size={{ xs: 6, md: 3 }}>
                <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 2 }} />
              </Grid>
            ))}
          </Grid>
        ) : useBento ? (
          <div
            style={{
              display: 'grid',
              gap: '16px',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gridTemplateRows: 'repeat(2, 200px)',
              gridTemplateAreas: bentoTemplate,
            }}
          >
            {featured.map((cat, i) => (
              <div key={cat.id} style={{ gridArea: GRID_AREAS[i] }}>
                <CategoryTile category={cat} sx={{ height: '100%' }} />
              </div>
            ))}
          </div>
        ) : (
          <Grid container spacing={2}>
            {featured.map((cat) => (
              <Grid key={cat.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <CategoryTile category={cat} sx={{ minHeight: 160 }} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
