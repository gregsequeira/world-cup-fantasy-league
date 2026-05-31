import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper
} from '@mui/material';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: connect to backend signup route
    console.log('Form submitted:', formData);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundColor: '#f5f5f5',
        padding: 3
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: '100%',
          borderRadius: 3
        }}
      >
        <Typography
          variant="h4"
          align="center"
          sx={{ marginBottom: 3, fontWeight: 'bold', color: 'primary.main' }}
        >
          Create Your Profile
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 3, paddingY: 1.5, fontSize: '1rem', boxShadow: 4 }}
          >
            Sign Up & Select Teams
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

export default Signup;
