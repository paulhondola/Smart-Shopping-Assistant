import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { NavLink, useNavigate, Link } from "react-router-dom";
import logo from "../../assets/logo.png";

function NavBar() {
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Link to="/">
          <Box
            component="img"
            src={logo}
            alt="Smart Shopping Assistant Logo"
            sx={{ width: 52, height: 2 }}
          />
        </Link>
        <Button component={NavLink} to="/" variant="contained">
          Home
        </Button>
        <Button component={NavLink} to="/products" variant="contained">
          Products
        </Button>
        <Button component={NavLink} to="/categories" variant="contained">
          Categories
        </Button>
        <Button component={NavLink} to="/promotions" variant="contained">
          Promotions
        </Button>
        <Button component={NavLink} to="/cart" variant="contained">
          Cart
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
