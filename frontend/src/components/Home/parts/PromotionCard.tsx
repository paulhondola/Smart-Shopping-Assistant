import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import {
  formatPromotionReward,
  promotionTypeLabel,
} from '@/shared/types/Promotion';
import type { Promotion } from '@/shared/types/Promotion';

interface PromotionCardProps {
  promotion: Promotion;
  categoryName?: string;
}

function formatThreshold(promotion: Promotion): string {
  if (promotion.type === 0) return `Buy ${promotion.threshold} items`;
  return `Spend ${promotion.threshold} RON`;
}

function formatRewardShort(promotion: Promotion): string {
  if (promotion.reward === 0) return `${promotion.rewardValue} Free`;
  return `${promotion.rewardValue}% off`;
}

export function PromotionCard({ promotion, categoryName }: PromotionCardProps) {
  const shopLink =
    promotion.categoryId && categoryName
      ? `/shop?category=${encodeURIComponent(categoryName)}`
      : '/shop';

  return (
    <Card
      variant="outlined"
      component={RouterLink}
      to={shopLink}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderLeft: '4px solid',
        borderLeftColor: 'primary.main',
        transition: 'box-shadow 200ms, border-color 200ms',
        textDecoration: 'none',
        color: 'inherit',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: (t) => `0 4px 20px ${t.palette.primary.main}30`,
          borderLeftColor: 'primary.light',
        },
      }}
    >
      <CardContent sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Chip
            label={promotionTypeLabel[promotion.type]}
            size="small"
            variant="outlined"
            color="primary"
            sx={{ fontSize: '0.7rem', height: 20 }}
          />
          <Typography
            variant="h4"
            component="span"
            color="primary.main"
            sx={{ fontWeight: 700, lineHeight: 1 }}
          >
            {formatRewardShort(promotion)}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ lineHeight: 1.3, mb: 0.5 }}>
          {promotion.name}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {formatPromotionReward(promotion)}
        </Typography>

        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: 'block', mt: 1 }}
        >
          {formatThreshold(promotion)}
        </Typography>
      </CardContent>

      <Box sx={{ px: 2, pb: 1.5 }}>
        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 500 }}>
          Shop now →
        </Typography>
      </Box>
    </Card>
  );
}
