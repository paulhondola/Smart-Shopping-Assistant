import { Box, Container, Grid, Typography, Button, Paper } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Link as RouterLink } from 'react-router';

const mockOutput = [
  '> Analyzing cart (3 items)...',
  '',
  '+ GPU Promo active — 15% off GPU',
  '~ Add 1 more CPU cooler to unlock',
  '  "Buy 3 Get 1 Free" deal',
  '',
  '-> Suggested: Noctua NH-D15',
  '   Saves you ~120 RON',
];

const lineColor = (line: string) => {
  if (line.startsWith('+')) return '#28c840';
  if (line.startsWith('~') || line.startsWith('  ')) return '#febc2e';
  if (line.startsWith('->')) return 'primary.main';
  return 'text.secondary';
};

export function AiFeatureSection() {
  return (
    <Box
      component="section"
      aria-labelledby="ai-heading"
      sx={{
        py: { xs: 8, md: 14 },
        background: (t) =>
          `radial-gradient(ellipse at 20% 50%, ${t.palette.primary.main}14 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, ${t.palette.primary.main}0a 0%, transparent 50%), #181816`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                bgcolor: '#0d0d0b',
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', gap: 0.75, mb: 2 }}>
                {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
                  <Box key={c} sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: c }} />
                ))}
              </Box>
              {mockOutput.map((line, i) => (
                <Typography
                  key={i}
                  component="div"
                  color={lineColor(line)}
                  sx={{
                    fontFamily: '"JetBrains Mono", "Fira Code", ui-monospace, monospace',
                    fontSize: '0.8rem',
                    lineHeight: 1.9,
                    whiteSpace: 'pre',
                  }}
                >
                  {line || ' '}
                </Typography>
              ))}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Typography
              variant="overline"
              color="primary.main"
              sx={{ letterSpacing: '0.15em', display: 'block', mb: 1 }}
            >
              AI-Powered
            </Typography>
            <Typography
              variant="h2"
              id="ai-heading"
              sx={{
                fontFamily: 'Georgia, serif',
                fontSize: { xs: '2rem', md: '2.75rem' },
                mb: 2,
              }}
            >
              Smart Cart Analysis
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
              Our AI reviews your cart against all active promotions, spots near-miss deals, and
              suggests products that unlock extra savings — automatically.
            </Typography>
            <Button
              component={RouterLink}
              to="/cart"
              variant="contained"
              size="large"
              startIcon={<AutoAwesomeIcon />}
              sx={{
                px: 4,
                py: 1.5,
                transition: 'transform 200ms, box-shadow 200ms',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (t) => `0 8px 24px ${t.palette.primary.main}44`,
                },
              }}
            >
              Analyze my Cart
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
