import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin") === "true"; // ✅ Check if user is admin
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    updateCartQuantity();
    window.addEventListener("storage", updateCartQuantity);

    const interval = setInterval(updateCartQuantity, 1000);

    return () => {
      window.removeEventListener("storage", updateCartQuantity);
      clearInterval(interval);
    };
  }, []);

  const updateCartQuantity = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    setCartQuantity(totalQuantity);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("is_admin"); // ✅ Remove admin status on logout
    navigate("/login");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#000", padding: "10px 0", height: "10vh" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography 
          variant="h5"
          component={Link}
          to="/"
          sx={{ 
            textDecoration: "none",
            color: "#D4AF37",
            fontWeight: "bold",
            letterSpacing: "1px",
            fontSize: "1.8rem",
          }}
        >
          Jewelry Shop
        </Typography>

        <div>
          <Button component={Link} to="/shop" sx={navButtonStyle}>Shop</Button>

          {/* ✅ Cart Button with Badge */}
          <Button component={Link} to="/cart" sx={navButtonStyle}>
            {cartQuantity > 0 ? (
              <Badge badgeContent={cartQuantity} color="primary" sx={badgeStyle}>
                Cart
              </Badge>
            ) : (
              "Cart"
            )}
          </Button>

          {/* ✅ History Button */}
          {token && <Button component={Link} to="/history" sx={navButtonStyle}>History</Button>}

          {/* ✅ Admin Button (Only for Admins) */}
          {isAdmin && (
            <Button component={Link} to="/admin" sx={adminButtonStyle}>
              Manage Products
            </Button>
          )}

          {token ? (
            <Button onClick={handleLogout} sx={navButtonStyle}>Logout</Button>
          ) : (
            <Button component={Link} to="/login" sx={navButtonStyle}>Login</Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

// 🔹 Button Style
const navButtonStyle = {
  color: "#D4AF37",
  fontWeight: "bold",
  fontSize: "1rem",
  textTransform: "uppercase",
  padding: "8px 16px",
  '&:hover': {
    color: "white",
    backgroundColor: "#D4AF37",
    borderRadius: "5px",
  }
};

// 🔹 Badge Style
const badgeStyle = {
  '& .MuiBadge-badge': {
    backgroundColor: "#D4AF37",
    color: "black",
    fontSize: "0.8rem",
    fontWeight: "bold"
  }
};

// 🔹 Admin Button Style (Highlighted)
const adminButtonStyle = {
  backgroundColor: "#ff5733", // ✅ Unique color for admin button
  color: "white",
  fontWeight: "bold",
  fontSize: "0.7rem",
  textTransform: "uppercase",
  padding: "10px 18px",
  borderRadius: "5px",
  marginLeft: "10px",
  '&:hover': {
    backgroundColor: "#c70039",
  }
};

export default Navbar;
