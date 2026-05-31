import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginModal({ open, onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setError('');
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!email || !password) {
    setError('Please enter both email and password.');
    return;
  }

  setLoading(true);
  try {
    const res = await axios.post('http://localhost:5000/auth/login', { email, password });
    const { token, user } = res.data;

    // ✅ Save user info in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('role', user.role);
    localStorage.setItem('verified', user.verified);

    if (onLogin) onLogin(user);
    handleClose();

    // ✅ Redirect based on role
    if (user.role === 'admin') {
      navigate('/admin');       // Admin Dashboard
    } else {
      navigate('/dashboard');   // Normal user Dashboard
    }
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
  } finally {
    setLoading(false);
  }
};

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="login-modal-title">
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 420 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
          outline: 'none',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography id="login-modal-title" variant="h6" fontWeight={700}>
            Login
          </Typography>
          <Button onClick={onClose} size="small" color="inherit">
            Close
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Enter your account details to sign in.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Button
            variant="text"
            fullWidth
            sx={{ mt: 1 }}
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default LoginModal;
