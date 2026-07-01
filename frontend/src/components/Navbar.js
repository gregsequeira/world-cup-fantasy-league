import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  Divider,
} from '@mui/material';

import {
  HomeRounded,
  DashboardRounded,
  EmojiEventsRounded,
  AdminPanelSettingsRounded,
  LoginRounded,
  LogoutRounded,
  VerifiedRounded,
} from '@mui/icons-material';

import {
  Link,
  useNavigate,
  useLocation,
} from 'react-router-dom';

import LoginModal from './LoginModal';
import logo from '../logo.png';

function Navbar() {
  const [user, setUser] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  const isActive = (path) => location.pathname === path;

  const navButtonStyle = (active = false) => ({
    borderRadius: 30,
    px: 2.5,
    py: 1,
    fontWeight: 800,
    fontSize: {
      xs: '0.78rem',
      md: '0.9rem',
    },
    letterSpacing: 0.5,
    transition: 'all .25s',

    color: active ? '#fff' : '#eefcf5',

    background: active
      ? 'linear-gradient(135deg,#f5b301,#ffcf4a)'
      : 'transparent',

    boxShadow: active
      ? '0 6px 18px rgba(245,179,1,.35)'
      : 'none',

    '&:hover': {
      background: active
        ? 'linear-gradient(135deg,#f8bf27,#ffd76e)'
        : 'rgba(255,255,255,.12)',

      transform: 'translateY(-2px)',
    },
  });

  const phaseChip = (
    <Chip
      label="KNOCKOUT STAGE"
      color="warning"
      size="small"
      sx={{
        fontWeight: 800,
        letterSpacing: .6,
        bgcolor: '#f5b301',
        color: '#143a2b',
      }}
    />
  );
    return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background:
            'linear-gradient(135deg,#0b3d2e 0%, #146c43 45%, #1b5e20 100%)',
          backdropFilter: 'blur(16px)',
          borderBottom: '2px solid rgba(255,255,255,0.08)',
          boxShadow: '0 10px 30px rgba(0,0,0,.25)',
        }}
      >
        {/* ===== TOP BAR ===== */}

        <Toolbar
          sx={{
            minHeight: 78,
            px: { xs: 2, md: 4 },
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="World Cup Fantasy League"
              sx={{
                width: 54,
                height: 54,
                mr: 2,
                filter: 'drop-shadow(0 4px 10px rgba(0,0,0,.35))',
              }}
            />

            <Box>
              <Typography
                sx={{
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: {
                    xs: '1.05rem',
                    md: '1.45rem',
                  },
                  letterSpacing: 1,
                  lineHeight: 1.1,
                }}
              >
                World Cup Fantasy League
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(255,255,255,.75)',
                  fontSize: '.75rem',
                  letterSpacing: 1.5,
                }}
              >
                FIFA WORLD CUP 2026
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            {phaseChip}

            {user && (
              <Chip
                icon={<VerifiedRounded />}
                label={
                  user.verified === true ||
                  user.verified === 'true'
                    ? 'VERIFIED'
                    : 'UNVERIFIED'
                }
                size="small"
                sx={{
                  bgcolor:
                    user.verified === true ||
                    user.verified === 'true'
                      ? '#1fbf75'
                      : '#d97706',
                  color: '#fff',
                  fontWeight: 800,
                }}
              />
            )}
          </Box>
        </Toolbar>

        <Divider
          sx={{
            borderColor: 'rgba(255,255,255,.08)',
          }}
        />

        {/* ===== NAVIGATION ===== */}

        <Toolbar
          sx={{
            justifyContent: 'center',
            gap: 1.5,
            flexWrap: 'wrap',
            py: 1.2,
            px: 2,
          }}
        >
          <Button
            component={Link}
            to="/"
            startIcon={<HomeRounded />}
            sx={{
              ...navButtonStyle(isActive('/')),
              bgcolor: '#f5b301',
              color: '#143a2b',
              px: 3.5,
              fontSize: {
                xs: '.82rem',
                md: '.95rem',
              },
              '&:hover': {
                bgcolor: '#ffd34d',
                transform: 'translateY(-2px)',
              },
            }}
          >
            HOME
          </Button>

          {user && (
            <>
              <Button
                component={Link}
                to="/dashboard"
                startIcon={<DashboardRounded />}
                sx={navButtonStyle(isActive('/dashboard'))}
              >
                Dashboard
              </Button>

              <Button
                component={Link}
                to="/overall-leaderboard"
                startIcon={<EmojiEventsRounded />}
                sx={navButtonStyle(isActive('/overall-leaderboard'))}
              >
                Leaderboard
              </Button>

              {user.role === 'admin' && (
                <Button
                  component={Link}
                  to="/admin"
                  startIcon={<AdminPanelSettingsRounded />}
                  sx={navButtonStyle(isActive('/admin'))}
                >
                  Admin
                </Button>
              )}

              <Button
                startIcon={<LogoutRounded />}
                onClick={handleLogout}
                sx={navButtonStyle(false)}
              >
                Logout
              </Button>
            </>
          )}

          {!user && (
            <Button
              startIcon={<LoginRounded />}
              onClick={() => setOpenLogin(true)}
              sx={{
                ...navButtonStyle(false),
                border: '1px solid rgba(255,255,255,.18)',
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <LoginModal
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onLogin={(loggedInUser) => {
          setUser(loggedInUser);
        }}
      />
    </>
  );
}

export default Navbar;