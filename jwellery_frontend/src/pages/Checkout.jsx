import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../styles/checkout.css';

function Checkout() {
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalAmount(total);
    setCartItems(cart);
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    const userId = localStorage.getItem("userId");
    
    if (!userId || cartItems.length === 0) {
      alert("Invalid request: User not logged in or cart is empty.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Step 1: Create Order on Backend
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, cartItems }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const { orderId, amount, currency } = data;

      // ✅ Step 2: Open Razorpay Payment Window
      const options = {
        key: "rzp_test_c98LbkyLfw1dEr", // Replace with your Razorpay Key
        amount: amount,
        currency: currency,
        name: "Jewelry Shop",
        description: "Secure Payment for Your Order",
        order_id: orderId,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;

          // ✅ Step 3: Verify Payment with Backend
          const verifyResponse = await fetch("http://localhost:5000/api/payment/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: razorpay_order_id,
              paymentId: razorpay_payment_id,
              signature: razorpay_signature,
            }),
          });

          const verifyData = await verifyResponse.json();
          if (!verifyResponse.ok) throw new Error(verifyData.message);

          alert("Payment Successful! Your order has been placed.");

          // ✅ Step 4: Clear Cart and Redirect
          localStorage.removeItem("cart");
          navigate("/dashboard");
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#D4AF37",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      setLoading(false);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <Container className="checkout-container">
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Typography variant="h6" className="checkout-total">Total Amount: ₹{totalAmount}</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Button 
          variant="contained" 
          onClick={handlePayment} 
          className="checkout-button"
          sx={{
            backgroundColor: "#D4AF37",
            color: "black",
            fontWeight: "bold",
            textTransform: "uppercase",
            padding: "12px 24px",
            borderRadius: "5px",
            "&:hover": { backgroundColor: "transparent", border: "2px solid #D4AF37", color: "#D4AF37" }
          }}
        >
          Pay with Razorpay
        </Button>
      )}
    </Container>
  );
}

export default Checkout;
