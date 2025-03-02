import React, { useEffect, useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if (!loggedInUser) {
      navigate('/login');
    } else {
      setUser(loggedInUser);
      fetchOrders(loggedInUser._id);
    }
  }, [navigate]);

  const fetchOrders = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${userId}`);
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('loggedInUser');
    navigate('/login');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>User Dashboard</Typography>
      {user && (
        <>
          <Typography variant="h6">Welcome, {user.name}</Typography>
          <Typography variant="body1">Email: {user.email}</Typography>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </>
      )}

      <Typography variant="h5" gutterBottom style={{ marginTop: '20px' }}>
        Order History
      </Typography>
      {orders.length === 0 ? (
        <Typography variant="body1">No orders placed yet.</Typography>
      ) : (
        orders.map((order, index) => (
          <Typography key={index} variant="body1">
            {index + 1}. {order.items.length} items - ₹{order.totalAmount} - {order.status}
          </Typography>
        ))
      )}
    </Container>
  );
}

export default Dashboard;
