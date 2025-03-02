import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Card, CardMedia, CardContent, TextField, CircularProgress } from '@mui/material';
import '../styles/productDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(0); // ✅ Default: 0 (Not in Cart Initially)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProduct();
    loadCart();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
    const cartItem = storedCart.find(item => item._id === id);
    if (cartItem) {
      setQuantity(cartItem.quantity); // ✅ If in cart, set its quantity
    }
  };

  const handleAddToCart = () => {
    let updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(item => item._id === id);

    if (existingItemIndex === -1) {
      updatedCart.push({ ...product, quantity: 1 });
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setQuantity(1); // ✅ Show Quantity Controls after clicking "Add to Cart"
    alert('Added to cart!');
  };

  const updateQuantity = (newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart();
      return;
    }

    let updatedCart = [...cart];
    const existingItemIndex = updatedCart.findIndex(item => item._id === id);

    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity = newQuantity;
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    setQuantity(newQuantity);
  };

  const handleRemoveFromCart = () => {
    let updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setQuantity(0); // ✅ Hide Quantity Controls if removed
    alert('Removed from cart!');
  };

  if (loading) {
    return (
      <Container className="loading-container">
        <CircularProgress />
      </Container>
    );
  }

  if (!product) {
    return <Typography variant="h5" align="center">Product Not Found</Typography>;
  }

  return (
    <Container>
      <Card className="product-card">
        <CardMedia component="img" height="350" image={product.image} alt={product.name} />
        <CardContent>
          <Typography variant="h4" sx={{ color: "#D4AF37", fontWeight: "bold" }}>{product.name}</Typography>
          <Typography variant="h6" sx={{ color: "black" }}>₹{product.price}</Typography>
          <Typography variant="body1" paragraph>{product.description}</Typography>

          {/* ✅ Show Add to Cart initially, show quantity controls after adding */}
          {quantity === 0 ? (
            <Button 
              variant="contained" 
              onClick={handleAddToCart} 
              className="add-to-cart-button"
              sx={{
                backgroundColor: "#D4AF37",
                color: "black",
                fontWeight: "bold",
                textTransform: "uppercase",
                borderRadius: "5px",
                '&:hover': { backgroundColor: "transparent", border: "2px solid #D4AF37", color: "#D4AF37" }
              }}
            >
              Add to Cart
            </Button>
          ) : (
            <div className="quantity-controls">
              <Button
                onClick={() => updateQuantity(quantity - 1)}
                sx={{
                  backgroundColor: "#D4AF37", color: "black", fontWeight: "bold",
                  minWidth: "40px", '&:hover': { backgroundColor: "#b99630" }
                }}
              >
                -
              </Button>
              <TextField
                type="number"
                value={quantity}
                onChange={(e) => updateQuantity(parseInt(e.target.value) || 1)}
                inputProps={{ min: 1 }}
                className="quantity-input"
                sx={{ background: "white", borderRadius: "5px", width: "80px", textAlign: "center", margin: "0 10px" }}
              />
              <Button
                onClick={() => updateQuantity(quantity + 1)}
                sx={{
                  backgroundColor: "#D4AF37", color: "black", fontWeight: "bold",
                  minWidth: "40px", '&:hover': { backgroundColor: "#b99630" }
                }}
              >
                +
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default ProductDetails;
