import { Card, CardContent, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import { formatPromotionReward } from '@/shared/types/Promotion';
import type { Promotion } from '@/shared/types/Promotion';

interface PromotionCardProps {
  promotion: Promotion;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '4px solid',
        borderLeftColor: 'primary.main',
        transition: 'box-shadow 200ms',
        '&:hover': {
          boxShadow: (t) => `0 4px 16px ${t.palette.primary.main}22`,
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Typography
          variant="overline"
          color="primary.main"
          sx={{ letterSpacing: '0.1em' }}
        >
          Active Deal
        </Typography>
        <Typography variant="h6" sx={{ mt: 0.5, lineHeight: 1.3 }}>
          {promotion.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {formatPromotionReward(promotion)}
        </Typography>
      </CardContent>
      <Button
        component={RouterLink}
        to="/products"
        size="small"
        sx={{ m: 1, mt: 0, alignSelf: 'flex-start' }}
      >
        Shop now →
      </Button>
    </Card>
  );
}
