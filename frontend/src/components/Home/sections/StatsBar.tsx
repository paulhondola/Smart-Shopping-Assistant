import { Box, Container, Grid } from '@mui/material';
import { StatItem } from '../parts/StatItem';

interface StatsBarProps {
  counts: { products: number; categories: number; activePromotions: number } | undefined;
  loading: boolean;
}

export function StatsBar({ counts, loading }: StatsBarProps) {
  const stats = [
    { value: counts?.products ?? 0, label: 'Products' },
    { value: counts?.categories ?? 0, label: 'Categories' },
    { value: counts?.activePromotions ?? 0, label: 'Active Deals' },
  ];

  return (
    <Box
      component="section"
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container>
          {stats.map((s, i) => (
            <Grid
              key={s.label}
              size={{ xs: 12, sm: 4 }}
              sx={{
                borderRight: { sm: i < 2 ? '1px solid' : 'none' },
                borderColor: { sm: 'divider' },
              }}
            >
              {loading ? (
                <Box sx={{ py: 3, textAlign: 'center', color: 'text.disabled' }}>—</Box>
              ) : (
                <StatItem value={s.value} label={s.label} />
              )}
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
