import { Box, Typography } from '@mui/material';
import { useRef, useState, useEffect } from 'react';
import { useCountUp } from '../hooks/useCountUp';

interface StatItemProps {
  value: number;
  label: string;
}

export function StatItem({ value, label }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const displayed = useCountUp(value, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Box ref={ref} sx={{ textAlign: 'center', py: 3 }}>
      <Typography
        variant="h3"
        color="primary.main"
        sx={{ fontFamily: 'Georgia, serif', fontWeight: 700 }}
      >
        {value > 0 ? displayed : '—'}
      </Typography>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '0.12em' }}>
        {label}
      </Typography>
    </Box>
  );
}
