import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Badge, IconButton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ProfileSidebar from "../pages/ProfileSidebar"; // ✅ Import Profile Sidebar

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("is_admin") === "true"; // ✅ Check if user is admin
  const [cartQuantity, setCartQuantity] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false); // ✅ Profile Sidebar State

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

  return (
    <>
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

            {/* ✅ Profile Button (Opens Sidebar) */}
            {token && (
              <IconButton sx={profileButtonStyle} onClick={() => setProfileOpen(true)}>
                <AccountCircleIcon />
              </IconButton>
            )}

            {!token && (
              <Button component={Link} to="/login" sx={navButtonStyle}>Login</Button>
            )}
          </div>
        </Toolbar>
      </AppBar>

      {/* ✅ Profile Sidebar (Opens from Right) */}
      <ProfileSidebar open={profileOpen} handleClose={() => setProfileOpen(false)} />
    </>
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

// 🔹 Profile Button Style
const profileButtonStyle = {
  color: "#D4AF37",
  fontSize: "2rem",
  ml: 2,
  '&:hover': {
    color: "white",
  }
};

export default Navbar;
