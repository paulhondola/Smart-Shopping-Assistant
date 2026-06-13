import { Box, Container, Typography, Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router";

export function FinalCtaSection() {
  return (
    <Box
      component="section"
      aria-labelledby="final-cta-heading"
      sx={{
        py: { xs: 10, md: 18 },
        textAlign: "center",
        background: (t) =>
          `radial-gradient(ellipse at 50% 0%, ${t.palette.primary.main}10 0%, transparent 60%), linear-gradient(to bottom, ${t.palette.background.default}, #0e0e0c)`,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          id="final-cta-heading"
          sx={{
            fontFamily: "Georgia, serif",
            fontSize: { xs: "2.25rem", md: "3.5rem" },
            mb: 2,
          }}
        >
          Start Building Your PC
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: "1.1rem", mb: 5 }}
        >
          Thousands of parts. Smart deals. AI recommendations.
        </Typography>
        <Button
          component={RouterLink}
          to="/shop"
          variant="contained"
          size="large"
          sx={{
            px: 6,
            py: 1.75,
            fontSize: "1rem",
            transition: "transform 200ms, box-shadow 200ms",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: (t) => `0 8px 24px ${t.palette.primary.main}44`,
            },
          }}
        >
          Shop Now
        </Button>
        <Box sx={{ mt: 3 }}>
          <Link
            component="a"
            href="#categories-heading"
            color="text.secondary"
            underline="hover"
            sx={{ fontSize: "0.9rem" }}
          >
            or browse by category
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
