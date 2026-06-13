import { Box, Container, Typography, Button, Stack } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link as RouterLink } from "react-router";

export function HeroSection() {
  return (
    <Box
      component="section"
      aria-labelledby="hero-heading"
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: (t) =>
          `radial-gradient(ellipse at 80% 60%, ${t.palette.primary.main}12 0%, transparent 60%), ${t.palette.background.default}`,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "256px 256px",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ maxWidth: { xs: "100%", md: "65%" } }}>
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              letterSpacing: "0.18em",
              mb: 2,
              display: "block",
            }}
          >
            Smart Shopping Assistant
          </Typography>

          <Typography
            variant="h1"
            id="hero-heading"
            sx={{
              fontSize: { xs: "2.8rem", sm: "4rem", md: "5.5rem" },
              fontFamily: "Georgia, serif",
              lineHeight: 1.1,
              mb: 3,
            }}
          >
            Shop Smarter.{" "}
            <Box component="span" sx={{ color: "primary.main" }}>
              Build Better.
            </Box>
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: "1.1rem", maxWidth: 480, lineHeight: 1.7, mb: 5 }}
          >
            AI-powered recommendations, exclusive promotions, and everything you
            need to build your perfect PC — all in one place.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              component={RouterLink}
              to="/shop"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                transition: "transform 200ms, box-shadow 200ms",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: (t) => `0 8px 24px ${t.palette.primary.main}44`,
                },
              }}
            >
              Browse Products
            </Button>
            <Button
              component="a"
              href="#deals-heading"
              variant="outlined"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                transition: "border-color 200ms, color 200ms",
                "&:hover": {
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              View Deals
            </Button>
          </Stack>
        </Box>
      </Container>

      <Box
        aria-hidden
        sx={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          color: "text.disabled",
          "@keyframes bounce": {
            "0%, 100%": { transform: "translateX(-50%) translateY(0)" },
            "50%": { transform: "translateX(-50%) translateY(6px)" },
          },
          "@media (prefers-reduced-motion: no-preference)": {
            animation: "bounce 2s ease-in-out infinite",
          },
        }}
      >
        <KeyboardArrowDownIcon />
      </Box>
    </Box>
  );
}
