import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Select, MenuItem, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import '../styles/shop.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products'); // Adjust if needed
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const filteredProducts = filter === 'All' ? products : products.filter(product => product.category === filter);

  return (
    <Container>
      <Typography variant="h4" gutterBottom className="shop-title">Discover Our Collection</Typography>
      
      <Select 
        value={filter} 
        onChange={(e) => setFilter(e.target.value)} 
        className="shop-filter"
        sx={{
          backgroundColor: "black",
          color: "#D4AF37",  // ✅ Text color fix
          border: "1px solid #D4AF37",
          '& .MuiSelect-icon': { color: "#D4AF37" }, // Fix dropdown arrow color
          '& .MuiMenuItem-root': { color: "#D4AF37" }, // Fix menu item text color
        }}
      >
        <MenuItem value="All">All</MenuItem>
        <MenuItem value="Necklace">Necklaces</MenuItem>
        <MenuItem value="Ring">Rings</MenuItem>
        <MenuItem value="Earrings">Earrings</MenuItem>
      </Select>

      {loading ? (
        <div className="loading-container">
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <Grid container spacing={4} className="shop-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <Grid item key={product._id} xs={12} sm={6} md={4}>
                <Card className="shop-card">
                  <CardMedia
                    component="img"
                    height="250"
                    image={product.image}
                    alt={product.name}
                    className="shop-card-image"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" className="product-name">
                      {product.name}
                    </Typography>
                    <Typography variant="body1" className="product-price">
                      ₹{product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                     <Button
                      component={Link} 
                      to={`/product/${product._id}`} 
                      className="shop-card-btn"
                      sx={{
                        backgroundColor: "#D4AF37",
                        color: "#000",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                        borderRadius: "5px",
                        padding: "8px 16px",
                        '&:hover': {
                          backgroundColor: "transparent",
                          border: "2px solid #D4AF37",
                          color: "#D4AF37",
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" className="no-products">No Products Found</Typography>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default Shop;
