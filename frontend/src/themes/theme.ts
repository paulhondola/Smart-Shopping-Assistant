import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c96442",
      contrastText: "#faf9f5",
    },
    secondary: {
      main: "#30302e",
      contrastText: "#b0aea5",
    },
    error: {
      main: "#b53333",
    },
    background: {
      default: "#141413",
      paper: "#252420",
    },
    text: {
      primary: "#f0ede6",
      secondary: "#8a8880",
    },
    divider: "#272624",
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "system-ui, Arial, sans-serif",
    h1: { fontFamily: "Georgia, serif" },
    h2: { fontFamily: "Georgia, serif" },
    h3: { fontFamily: "Georgia, serif" },
    h4: { fontFamily: "Georgia, serif" },
    h5: { fontFamily: "Georgia, serif" },
    h6: { fontFamily: "Georgia, serif" },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0f0e0d",
        },
      },
    },
    MuiDialog: {
      defaultProps: {
        disableScrollLock: true,
      },
    },
  },
});
