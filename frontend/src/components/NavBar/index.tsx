import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useState } from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { IconButton, Badge } from "@mui/material";
import { useCart } from "@/context/CardContext/cart-context";

function NavBar() {
  const [mode, setMode] = useState<"user" | "admin">("user");
  const navigate = useNavigate();
  const { cart, openCart } = useCart();
  const handleModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: "user" | "admin",
  ) => {
    setMode(value);
    navigate("/");
  };

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

        <Box sx={{ display: "flex", flexGrow: 1 }}>
          <Button component={NavLink} to="/" end color="inherit">
            Home
          </Button>
          {mode === "admin" ? (
            <>
              <Button component={NavLink} to="/categories" end color="inherit">
                Categories
              </Button>
              <Button component={NavLink} to="/products" end color="inherit">
                Products
              </Button>
              <Button component={NavLink} to="/promotions" color="inherit">
                Promotions
              </Button>
            </>
          ) : (
            <Button component={NavLink} to="/shop" color="inherit">
              Shop
            </Button>
          )}
        </Box>

        <ToggleButtonGroup
          value={mode}
          exclusive
          size="small"
          sx={{ mr: 2 }}
          onChange={handleModeChange}
        >
          <ToggleButton value="user">User</ToggleButton>
          <ToggleButton value="admin">Admin</ToggleButton>
        </ToggleButtonGroup>

        {mode === "user" && (
          <IconButton color="inherit" onClick={openCart}>
            <Badge badgeContent={cart?.itemCount ?? 0} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
