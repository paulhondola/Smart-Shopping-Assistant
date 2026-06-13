import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Box, Button, Typography } from "@mui/material";

function AppCrashFallback() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <Typography variant="h5">Something went wrong</Typography>
      <Button variant="contained" onClick={() => window.location.reload()}>
        Reload page
      </Button>
    </Box>
  );
}

function RouteFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "50vh",
        gap: 2,
      }}
    >
      <Typography>Failed to load this page.</Typography>
      <Button variant="outlined" onClick={resetErrorBoundary}>
        Try again
      </Button>
    </Box>
  );
}

export { ErrorBoundary, AppCrashFallback, RouteFallback };
