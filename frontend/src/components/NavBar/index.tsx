import type { ComponentType } from "react";
import { AppBar, Box, Button, Toolbar } from "@mui/material";
import type { ButtonProps, SxProps, Theme } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link, NavLink } from "react-router-dom";
import type { NavLinkProps } from "react-router-dom";
import logo from "../../assets/logo.png";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/promotions", label: "Promotions" },
];

type RouterButtonProps = ButtonProps & Pick<NavLinkProps, "to" | "end">;
const RouterButton = Button as ComponentType<RouterButtonProps>;

const navLinkSx: SxProps<Theme> = {
  fontSize: "1.0625rem",
  color: "text.secondary",
  fontWeight: 400,
  textTransform: "none",
  "&.active": {
    color: "text.primary",
    fontWeight: 500,
  },
  "&:hover": {
    backgroundColor: "transparent",
    color: "text.primary",
  },
};

function NavBar() {
  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: "divider" }}
    >
      <Toolbar
        sx={{
          maxWidth: "1280px",
          width: "100%",
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
          minHeight: { xs: 56 },
          gap: 0.5,
        }}
      >
        <Box
          component={Link}
          to="/"
          sx={{
            mr: 3,
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={logo}
            alt="Smart Shopping Assistant Logo"
            sx={{ height: 32, width: "auto" }}
          />
        </Box>

        <Box
          component="nav"
          aria-label="Main navigation"
          sx={{ display: "flex", flex: 1, gap: 0.5 }}
        >
          {navLinks.map(({ to, label, end }) => (
            <RouterButton
              key={to}
              component={NavLink}
              to={to}
              end={end}
              variant="text"
              sx={navLinkSx}
            >
              {label}
            </RouterButton>
          ))}
        </Box>

        <RouterButton
          component={NavLink}
          to="/cart"
          variant="contained"
          startIcon={<ShoppingCartIcon />}
        >
          Cart
        </RouterButton>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
