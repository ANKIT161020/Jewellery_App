import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Card, CardMedia, CardContent, Grid, IconButton, Divider, Box, TextField } from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import '../styles/cart.css';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  };

  const updateQuantity = (index, newQuantity) => {
    let updatedCart = [...cart];

    if (newQuantity <= 0) {
      updatedCart.splice(index, 1); // Remove item if quantity reaches 0
    } else {
      updatedCart[index].quantity = newQuantity;
    }

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (index) => {
    let updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  // Calculate total price (No Taxes)
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <Container className="cart-container">
      <Typography variant="h4" gutterBottom className="cart-title">Your Cart ({cart.length} items)</Typography>

      {cart.length === 0 ? (
        <Typography variant="h6" className="empty-cart">Your cart is empty</Typography>
      ) : (
        <>
          <Grid container spacing={2} className="cart-grid">
            {cart.map((product, index) => (
              <Grid item xs={12} key={index}>
                <Card className="cart-card">
                  {/* ✅ Smaller Product Image */}
                  <CardMedia 
                    component="img" 
                    image={product.image} 
                    alt={product.name} 
                    sx={{ 
                    width: "70px",   // ✅ Smaller image width
                    height: "70px",  // ✅ Smaller image height
                    objectFit: "cover",
                    borderRadius: "10px",
                    marginRight: "15px"
                    }} 
                />

                  
                  {/* Product Details */}
                  <CardContent className="cart-content">
                    <Typography variant="h6" className="product-name">{product.name}</Typography>
                    <Typography variant="body1" className="cart-price">₹{product.price * product.quantity}</Typography>
                  </CardContent>

                  {/* Quantity Controls */}
                  <Box className="quantity-controls">
                    <IconButton onClick={() => updateQuantity(index, product.quantity - 1)} sx={{ color: "#D4AF37" }}>
                      <Remove />
                    </IconButton>
                    <TextField
                      type="number"
                      value={product.quantity}
                      onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                      inputProps={{ min: 1 }}
                      className="quantity-input"
                      sx={{ width: "50px", textAlign: "center", background: "white", borderRadius: "5px" }}
                    />
                    <IconButton onClick={() => updateQuantity(index, product.quantity + 1)} sx={{ color: "#D4AF37" }}>
                      <Add />
                    </IconButton>
                  </Box>

                  {/* Remove Button */}
                  <Button 
                    onClick={() => removeFromCart(index)} 
                    startIcon={<Delete />} 
                    sx={{ color: "red", fontWeight: "bold" }}
                  >
                    Remove
                  </Button>
                </Card>

                <Divider sx={{ marginY: 2 }} />
              </Grid>
            ))}
          </Grid>

          {/* ✅ Total Section (NO TAXES) */}
          <div className="cart-total-container">
            <Typography variant="h5" className="grand-total">Total: ₹{totalAmount.toFixed(2)}</Typography>
            <Button variant="contained" className="checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}
    </Container>
  );
}

export default Cart;
