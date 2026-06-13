import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClientProvider } from "@tanstack/react-query";
import { SnackbarProvider } from "notistack";
import "./index.css";
import App from "./App.tsx";
import { theme } from "./themes/theme.ts";
import { queryClient } from "./lib/queryClient.ts";
import {
  ErrorBoundary,
  AppCrashFallback,
} from "./components/common/ErrorBoundary/index.tsx";

document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider maxSnack={3}>
          <ErrorBoundary FallbackComponent={AppCrashFallback}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </ErrorBoundary>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
