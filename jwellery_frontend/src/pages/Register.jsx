import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [user, setUser] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.message || 'Registration failed');
      } else {
        alert('Registration Successful!');
        navigate('/login');
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
          Register
        </Typography>
        {error && <Typography sx={{ color: 'red', mb: 2 }}>{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: 2, color: 'white' }}>
          Already have an account? <Link to="/login" style={{ color: '#D4AF37', textDecoration: 'none' }}>Login Here</Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default Register;
