import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'left',
  action,
}: SectionHeadingProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: align === 'left' ? 'row' : 'column' },
        alignItems: align === 'center' ? 'center' : { xs: 'flex-start', sm: 'flex-end' },
        justifyContent: 'space-between',
        mb: 5,
        gap: 1,
        textAlign: align,
      }}
    >
      <Box>
        {eyebrow && (
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', letterSpacing: '0.15em', display: 'block', mb: 0.5 }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography
          variant="h2"
          id={id}
          sx={{ fontSize: { xs: '1.75rem', md: '2.25rem' }, fontFamily: 'Georgia, serif' }}
        >
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 480 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action && <Box sx={{ flexShrink: 0 }}>{action}</Box>}
    </Box>
  );
}
