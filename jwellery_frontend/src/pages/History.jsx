import React, { useEffect, useState } from "react";
import { Container, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import "../styles/History.css";

function History() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/history/${userId}`);
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  return (
    <Container className="history-container">
      <Typography variant="h4" gutterBottom className="history-title">Order History</Typography>

      {loading ? (
        <CircularProgress />
      ) : orders.length === 0 ? (
        <Typography variant="h6" className="no-orders">No orders found</Typography>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="order-card">
            <CardContent>
              <Typography variant="h6" className="order-id">Order ID: {order._id}</Typography>
              <Typography variant="body1">Status: <b>{order.status}</b></Typography>
              <Typography variant="body1">Total Amount: ₹{order.totalAmount}</Typography>
              <Typography variant="body2">Placed on: {new Date(order.createdAt).toLocaleDateString()}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}

export default History;
