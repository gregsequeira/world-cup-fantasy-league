import React, { useState } from 'react';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

function SignupModal({ open, onClose, onLogin, onOpenLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !contactNumber) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/auth/signup', { 
        name, 
        email, 
        password, 
        contact_number: contactNumber
      });
      const { token, user } = res.data;

      // Save token + role + verified status
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('verified', user.verified);

      // Clear form fields
      setName('');
      setEmail('');
      setPassword('');
      setContactNumber('');

      if (typeof onLogin === 'function') {
        onLogin(user);
      }

      onClose();
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.error || 'Signup failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="signup-modal-title">
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
          <Typography id="signup-modal-title" variant="h6" fontWeight={700}>
            Join the League
          </Typography>
          <Button onClick={onClose} size="small" color="inherit">
            Close
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create your account to pick teams and compete once approved.
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
          <TextField
            label="Contact Number"
            fullWidth
            margin="normal"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="+27 82 123 4567"
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
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
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account?{' '}
            <Button 
              onClick={() => {
                onClose();
                if (typeof onOpenLogin === 'function') {
                  onOpenLogin();
                }
              }}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Log in
            </Button>
          </Typography>
        </form>
      </Box>
    </Modal>
  );
}

export default SignupModal;
