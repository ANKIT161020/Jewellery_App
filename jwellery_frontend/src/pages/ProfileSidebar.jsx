import React, { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function ProfileSidebar({ open, handleClose }) {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ newPassword: "", confirmPassword: "" });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${userId}`);
      const data = await response.json();
      setUser(data);
      setFormData({ name: data.name, email: data.email });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchUser();
        setEditing(false);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handlePasswordReset = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/auth/forgot-password/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      if (response.ok) {
        alert("Password updated successfully");
        setPasswordReset(false);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;

    try {
      await fetch(`http://localhost:5000/api/auth/${userId}`, { method: "DELETE" });

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <Box sx={{ width: 320, padding: 3, backgroundColor: "#000", color: "#D4AF37", height: "100vh" }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Profile
        </Typography>
        <Divider sx={{ backgroundColor: "#D4AF37", mb: 2 }} />

        {editing ? (
          <>
            <TextField 
              fullWidth 
              margin="normal" 
              label="Name" 
              value={formData.name} 
              onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
              sx={inputStyle}
            />
            <TextField 
              fullWidth 
              margin="normal" 
              label="Email" 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              sx={inputStyle}
            />
            <Button fullWidth variant="contained" sx={buttonStyle} onClick={handleSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6">Name: {user.name}</Typography>
            <Typography variant="h6">Email: {user.email}</Typography>
            <Button fullWidth sx={buttonStyle} onClick={handleEdit}>
              Edit Profile
            </Button>
          </>
        )}

        {passwordReset ? (
          <>
            <TextField 
              fullWidth 
              margin="normal" 
              label="New Password" 
              type="password" 
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} 
              sx={inputStyle}
            />
            <TextField 
              fullWidth 
              margin="normal" 
              label="Confirm Password" 
              type="password" 
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} 
              sx={inputStyle}
            />
            <Button fullWidth variant="contained" sx={buttonStyle} onClick={handlePasswordReset}>
              Reset Password
            </Button>
          </>
        ) : (
          <Button fullWidth sx={buttonStyle} onClick={() => setPasswordReset(true)}>
            Forgot Password?
          </Button>
        )}

        <Button fullWidth sx={{ color: "red", mt: 2 }} onClick={handleDelete}>
          Delete Account
        </Button>
        <Button fullWidth sx={buttonStyle} onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}>
          Logout
        </Button>
      </Box>
    </Drawer>
  );
}

// ✅ Input Field Styling for Visibility
const inputStyle = {
  "& label": { color: "#D4AF37" }, // Gold label text
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#222", // Dark background
    color: "#fff", // White text
    borderRadius: "5px",
    "& fieldset": { borderColor: "#D4AF37" }, // Gold border
    "&:hover fieldset": { borderColor: "#fff" }, // White border on hover
    "&.Mui-focused fieldset": { borderColor: "#D4AF37" }, // Gold border on focus
  },
  "& input": { color: "#fff" }, // White input text
};

// ✅ Button Styling for Better Visibility
const buttonStyle = {
  backgroundColor: "#D4AF37",
  color: "black",
  fontWeight: "bold",
  mt: 2,
  padding: 1.5,
  borderRadius: 1,
  "&:hover": {
    backgroundColor: "transparent",
    border: "2px solid #D4AF37",
    color: "#D4AF37",
  },
};

export default ProfileSidebar;
