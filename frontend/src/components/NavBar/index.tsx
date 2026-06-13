import { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Badge,
  Toolbar,
  Tooltip,
} from "@mui/material";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useCart } from "@/context/CartContext/cart-context";
import { useAuth } from "@/context/AuthContext/auth-context";

function NavBar() {
  const { cart, openCart } = useCart();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "Admin";

  const prevItemCount = useRef<number>(cart?.itemCount ?? 0);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    const currentCount = cart?.itemCount ?? 0;
    if (currentCount > prevItemCount.current) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 400);
      prevItemCount.current = currentCount;
      return () => clearTimeout(timer);
    }
    prevItemCount.current = currentCount;
  }, [cart?.itemCount]);

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

          {user && !isAdmin && (
            <Button component={NavLink} to="/shop" color="inherit">
              Shop
            </Button>
          )}

          {isAdmin && (
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
          )}
        </Box>

        {user ? (
          <>
            <Tooltip title={user.displayName}>
              <Box
                component={Link}
                to="/profile"
                sx={{ display: "flex", alignItems: "center", mr: 1, flexShrink: 0 }}
              >
                <Avatar
                  src={user.avatarUrl}
                  sx={{ width: 32, height: 32, fontSize: 14, bgcolor: "primary.main" }}
                >
                  {user.displayName.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            </Tooltip>
            <Button color="inherit" onClick={logout} size="small">
              Logout
            </Button>
            {!isAdmin && (
              <IconButton color="inherit" onClick={openCart} sx={{ ml: 0.5 }} aria-label="Open cart">
                <Badge badgeContent={cart?.itemCount ?? 0} color="primary" className={isPulsing ? "cart-badge-pulse" : undefined}>
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            )}
          </>
        ) : (
          <>
            <Button component={NavLink} to="/login" color="inherit" size="small">
              Login
            </Button>
            <Button
              component={NavLink}
              to="/register"
              variant="contained"
              size="small"
              sx={{ ml: 1 }}
            >
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
