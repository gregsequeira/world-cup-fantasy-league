import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';
import axios from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

function SignupModal({ open, onClose, onOpenLogin }) {
  const [username, setUsername] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!username || !contactNumber || !password) {
      setError('All fields are required');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/auth/signup', {
        username,
        contact_number: contactNumber,
        password
      });

      if (res.status === 201) {
        // Save token and user info if returned
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }
        if (res.data.user) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
        }

        // ✅ Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Signup failed:', err);
      setError(
        err.response?.data?.message || 'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Sign Up
        </Typography>

        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          label="Contact Number"
          fullWidth
          margin="normal"
          value={contactNumber}
          onChange={e => setContactNumber(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
          <Button variant="text" onClick={onOpenLogin}>
            Already have an account? Log in
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default SignupModal;
