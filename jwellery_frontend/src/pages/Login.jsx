import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/'); // Redirect if already logged in
  }, [navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setError('Both fields are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.message || 'Login failed');
      } else {
        // ✅ Store token, user ID, and is_admin in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('is_admin', data.is_admin);

        alert('Login Successful!');
        navigate('/');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 400,
          padding: 4,
          textAlign: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          borderRadius: 2,
          boxShadow: '0px 4px 12px rgba(212, 175, 55, 0.5)',
        }}
      >
        <Typography variant="h4" sx={{ color: '#D4AF37', fontWeight: 'bold', mb: 2 }}>
          Login
        </Typography>
        {error && <Typography sx={{ color: 'red', mb: 2 }}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 1,
              },
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 1,
              },
            }}
          />
          <Button
            fullWidth
            type="submit"
            disabled={loading}
            sx={{
              backgroundColor: '#D4AF37',
              color: 'black',
              fontWeight: 'bold',
              marginTop: 2,
              padding: 1.5,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'transparent',
                border: '2px solid #D4AF37',
                color: '#D4AF37',
              },
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: 2, color: 'white' }}>
          New User? <Link to="/register" style={{ color: '#D4AF37', textDecoration: 'none' }}>Register Here</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Login;
