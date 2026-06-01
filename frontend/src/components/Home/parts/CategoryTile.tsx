import { ButtonBase, Typography, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router';
import type { Category } from '@/shared/types/Category';
import type { SxProps, Theme } from '@mui/material';

interface CategoryTileProps {
  category: Category;
  sx?: SxProps<Theme>;
}

export function CategoryTile({ category, sx }: CategoryTileProps) {
  return (
    <ButtonBase
      component={RouterLink}
      to="/products"
      focusRipple
      sx={{
        display: 'block',
        width: '100%',
        height: '100%',
        minHeight: 160,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'border-color 200ms',
        '&:hover': {
          borderColor: 'primary.main',
          '& .tile-bg': { filter: 'brightness(1.15)' },
        },
        '&:focus-visible': {
          outline: (t: Theme) => `2px solid ${t.palette.primary.main}`,
          outlineOffset: 2,
        },
        ...sx,
      }}
    >
      <Box
        className="tile-bg"
        sx={{
          position: 'absolute',
          inset: 0,
          background: (t) =>
            `radial-gradient(ellipse at 70% 30%, ${t.palette.primary.main}18 0%, transparent 70%), #1a1916`,
          transition: 'filter 200ms',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}
      >
        <Typography variant="h5" sx={{ fontFamily: 'Georgia, serif', color: 'text.primary' }}>
          {category.name}
        </Typography>
        {category.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.4 }}>
            {category.description}
          </Typography>
        )}
      </Box>
    </ButtonBase>
  );
}
