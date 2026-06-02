import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';

function Navbar() {
  const [user, setUser] = useState(null);
  const [openSignup, setOpenSignup] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const navigate = useNavigate();

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
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: '#7FC8A9',
        boxShadow: 4,
        px: { xs: 1, md: 2 }
      }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        {/* Logo / Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            letterSpacing: 1,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          World Cup Fantasy League
        </Typography>

        {/* Navigation Links */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: { xs: 0.5, md: 1 },
          }}
        >
          <Button color="inherit" component={Link} to="/" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
            Home
          </Button>
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                Dashboard
              </Button>
              {user.role === 'admin' && (
                <Button color="inherit" component={Link} to="/admin" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                  Admin Dashboard
                </Button>
              )}
              <Button color="inherit" component={Link} to="/overall-leaderboard" sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                Leaderboard
              </Button>
              <Button color="inherit" onClick={handleLogout} sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => setOpenSignup(true)} sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
                Sign Up
              </Button>
              <Button color="inherit" onClick={() => setOpenLogin(true)} sx={{ fontSize: { xs: '0.8rem', md: '0.9rem' } }}>
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
