import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';

function Navbar() {
  const [user, setUser] = useState(null);
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

  // Load user info from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({
        role: localStorage.getItem('role'),
        verified: localStorage.getItem('verified'),
      });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('verified');
    setUser(null);
    navigate('/');
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#7FC8A9', boxShadow: 4 }}>
      <Toolbar>
        {/* Logo / Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}
        >
          World Cup Fantasy League
        </Typography>

        {/* Navigation Links */}
        <Box>
  <Button color="inherit" component={Link} to="/">
    Home
  </Button>
  {user ? (
    <>
      <Button color="inherit" component={Link} to="/dashboard">
        Dashboard
      </Button>
      {user.role === 'admin' && (
        <Button color="inherit" component={Link} to="/admin">
          Admin Dashboard
        
        </Button>
      )}
      <Button color="inherit" component={Link} to="/overall-leaderboard">
    Leaderboard
  </Button>
      <Button color="inherit" onClick={handleLogout}>
        Logout
      </Button>
    </>
  ) : (
    <>
      <Button color="inherit" onClick={() => setOpenSignup(true)}>
        Sign Up
      </Button>
      <Button color="inherit" onClick={() => setOpenLogin(true)}>
        Login
      </Button>
    </>
  )}
</Box>

      </Toolbar>

      {/* Modals */}
      <SignupModal
        open={openSignup}
        onClose={() => setOpenSignup(false)}
        onLogin={setUser}
        onOpenLogin={() => setOpenLogin(true)} 
      />
      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onLogin={setUser}
      />
    </AppBar>
  );
}

export default Navbar;
