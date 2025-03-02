import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

const Header = ({ isAuth, userName, setIsAuth, userRoles }) => {
  const navigate = useNavigate();
  const isCustomer = userRoles.includes("CUSTOMER");
  const isAdmin = userRoles.includes("ADMIN");

  const menuItems = [
    {
      key: "home",
      label: <Link to="/">Home</Link>,
    },
    {
      key: "about",
      label: <Link to="/about">About</Link>,
    },
    ...(isAuth && (isCustomer || isAdmin)
      ? [
          {
            key: "bookings",
            label: <Link to="/bookings">My Bookings</Link>,
          },
          {
            key: "book-cab",
            label: <Link to="/book-cab">Book a Cab</Link>,
          },
        ]
      : []),
    ...(isAdmin
      ? [
          {
            key: "cars",
            label: <Link to="/cars">Manage Cars</Link>,
          },
          {
            key: "drivers",
            label: <Link to="/drivers">Manage Drivers</Link>,
          },
        ]
      : []),
  ];

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("roles");
    setIsAuth(false);
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#252525", boxShadow: "none" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#FFCC00" }}>
          MegaCabs
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {menuItems.map((item) => (
            <Button key={item.key} color="inherit" sx={{ color: "white" }}>
              {item.label}
            </Button>
          ))}

          {isAuth ? (
            <>
              <Typography variant="body1" color="white">
                Welcome, {userName}!
              </Typography>
              <Button color="inherit" onClick={handleLogout} sx={{ color: "white" }}>
                Logout
              </Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login" sx={{ color: "white" }}>
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
