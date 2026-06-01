import { Box, Button, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

function NotFound() {
  const { pathname } = useLocation();

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        py: 12,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h1"
        sx={{ fontSize: "6rem", fontWeight: 700, color: "text.secondary", opacity: 0.3 }}
      >
        404
      </Typography>
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Page not found
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300 }}>
        <Box component="span" sx={{ fontFamily: "monospace", color: "text.primary", opacity: 0.7 }}>
          {pathname}
        </Box>{" "}
        doesn&apos;t exist.
      </Typography>
      <Button component={Link} to="/" variant="contained">
        Go home
      </Button>
    </Box>
  );
}

export default NotFound;
