import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  Stack,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link as RouterLink } from 'react-router';
import { formatRON } from '@/shared/format/currency';
import type { Product } from '@/shared/types/Product';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 200ms, box-shadow 200ms',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: (t) => `0 0 0 1px ${t.palette.primary.main}40`,
        },
      }}
    >
      <CardActionArea
        component={RouterLink}
        to="/products"
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <CardMedia
          component="img"
          height={220}
          image={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          loading="lazy"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = '/placeholder.png';
          }}
          sx={{ objectFit: 'contain', bgcolor: '#1a1916', p: 2 }}
        />
        <CardContent sx={{ flex: 1 }}>
          <Stack direction="row" spacing={0.5} flexWrap="wrap" mb={1}>
            {product.categories.slice(0, 2).map((cat) => (
              <Chip
                key={cat}
                label={cat}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem' }}
              />
            ))}
          </Stack>
          <Typography variant="h6" sx={{ fontSize: '0.95rem', lineHeight: 1.3, mb: 1 }}>
            {product.name}
          </Typography>
          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 700 }}>
            {formatRON(product.price)}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCartIcon />}
          size="small"
          onClick={(e) => e.stopPropagation()}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}
