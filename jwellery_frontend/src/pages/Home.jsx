import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/home.css'; // Import styles

function Home() {
  return (
    <Box className="hero-banner">
      <Container className="hero-content">
        <Typography variant="h2" className="hero-title">Exquisite Jewelry for Every Occasion</Typography>
        <Typography variant="h6" className="hero-subtitle">
          Discover timeless elegance and unmatched craftsmanship in our collection.
        </Typography>
        <Button 
          component={Link} 
          to="/shop" 
          size="large"
          sx={{
            backgroundColor: "#D4AF37",
            color: "#000",
            padding: "14px 36px",
            fontWeight: "bold",
            textTransform: "uppercase",
            borderRadius: "30px",
            transition: "all 0.3s ease-in-out",
            '&:hover': {
              backgroundColor: "transparent",
              border: "2px solid #D4AF37",
              color: "white",
            }
          }}
        >
          Browse Collection
        </Button>
      </Container>
    </Box>
  );
}

export default Home;
