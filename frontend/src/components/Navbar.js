import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Chip,
  useMediaQuery,
} from '@mui/material';

import {
  HomeRounded,
  DashboardRounded,
  EmojiEventsRounded,
  AdminPanelSettingsRounded,
  LoginRounded,
  LogoutRounded,
  VerifiedRounded,
  MenuRounded,
  SportsSoccerRounded,
  TableChartRounded,
} from '@mui/icons-material';

import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

import LoginModal from './LoginModal';
import logo from '../logo.png';

function Navbar() {
  const [user, setUser] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

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
    setDrawerOpen(false);

    navigate('/');
  };

  const verified =
    user?.verified === true ||
    user?.verified === 'true';

  const navButtonStyle = (active = false) => ({
    px: 2.5,
    py: 1,
    borderRadius: 50,
    fontWeight: 800,
    letterSpacing: '.03em',
    textTransform: 'none',
    color: active ? '#12372a' : '#ffffff',
    background: active
      ? 'linear-gradient(135deg,#FFD54F,#F5B301)'
      : 'transparent',

    boxShadow: active
      ? '0 6px 18px rgba(245,179,1,.35)'
      : 'none',

    transition: '.25s',

    '&:hover': {
      background: active
        ? 'linear-gradient(135deg,#FFD54F,#F5B301)'
        : 'rgba(255,255,255,.12)',

      transform: 'translateY(-2px)',
    },
  });

  const drawerItem = (
    icon,
    text,
    path
  ) => (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => {
          navigate(path);
          setDrawerOpen(false);
        }}
        selected={location.pathname === path}
        sx={{
          mx: 1,
          my: .5,
          borderRadius: 3,

          '&.Mui-selected': {
            background:
              'linear-gradient(135deg,#FFD54F,#F5B301)',
            color: '#12372a',

            '& .MuiListItemIcon-root': {
              color: '#12372a',
            },
          },

          '&:hover': {
            background: 'rgba(255,255,255,.10)',
          },
        }}
      >
        <ListItemIcon
          sx={{
            color: '#fff',
            minWidth: 42,
          }}
        >
          {icon}
        </ListItemIcon>

        <ListItemText
          primary={text}
          primaryTypographyProps={{
            fontWeight: 700,
          }}
        />
      </ListItemButton>
    </ListItem>
  );

  const phaseChip = (
    <Chip
      label="KNOCKOUT STAGE"
      size="small"
      sx={{
        bgcolor: '#FFD54F',
        color: '#12372a',
        fontWeight: 900,
        letterSpacing: .6,
      }}
    />
  );

  const verifiedChip = user && (
    <Chip
      icon={<VerifiedRounded />}
      label={verified ? 'Verified' : 'Pending'}
      size="small"
      sx={{
        bgcolor: verified ? '#1DBF73' : '#D97706',
        color: '#fff',
        fontWeight: 800,
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
            'linear-gradient(135deg, #0f3d2e 0%, #0f766e 45%, #1b5e20 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 8px 28px rgba(0,0,0,.28)',
        }}
      >
        <Toolbar
          sx={{
            minHeight: 72,
            px: { xs: 1.5, md: 3 },
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#fff',
              flexShrink: 0,
            }}
          >
            <Box
              sx={{
                width: 46,
                height: 46,
                borderRadius: 2,
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                boxShadow: '0 6px 18px rgba(0,0,0,.22)',
              }}
            >
              <img
                src={logo}
                alt="World Cup Fantasy League"
                style={{
                  width: 34,
                  height: 34,
                  objectFit: 'contain',
                }}
              />
            </Box>

            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography
                sx={{
                  fontWeight: 900,
                  fontSize: '1.15rem',
                  letterSpacing: '.04em',
                  lineHeight: 1.1,
                }}
              >
                WORLD CUP
              </Typography>

              <Typography
                sx={{
                  fontSize: '.78rem',
                  opacity: .85,
                  letterSpacing: '.15em',
                }}
              >
                FANTASY LEAGUE
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Button
                component={NavLink}
                to="/"
                sx={navButtonStyle(true)}
                startIcon={<HomeRounded />}
              >
                Home
              </Button>

              <Button
                component={NavLink}
                to="/fixtures"
                sx={navButtonStyle(location.pathname === '/fixtures')}
                startIcon={<SportsSoccerRounded />}
              >
                Fixtures
              </Button>

              <Button
                component={NavLink}
                to="/bracket"
                sx={navButtonStyle(location.pathname === '/bracket')}
                startIcon={<TableChartRounded />}
              >
                Knockout Bracket
              </Button>

              <Button
                component={NavLink}
                to="/overall-leaderboard"
                sx={navButtonStyle(location.pathname === '/overall-leaderboard')}
                startIcon={<EmojiEventsRounded />}
              >
                Leaderboard
              </Button>

              {user && (
                <Button
                  component={NavLink}
                  to="/dashboard"
                  sx={navButtonStyle(location.pathname === '/dashboard')}
                  startIcon={<DashboardRounded />}
                >
                  Dashboard
                </Button>
              )}

              {user?.role === 'admin' && (
                <Button
                  component={NavLink}
                  to="/admin"
                  sx={navButtonStyle(location.pathname === '/admin')}
                  startIcon={<AdminPanelSettingsRounded />}
                >
                  Admin
                </Button>
              )}

              <Box sx={{ ml: 2 }}>
                {phaseChip}
              </Box>

              {verifiedChip && (
                <Box sx={{ ml: 1 }}>
                  {verifiedChip}
                </Box>
              )}

              {!user ? (
                <Button
                  variant="contained"
                  startIcon={<LoginRounded />}
                  onClick={() => setOpenLogin(true)}
                  sx={{
                    ml: 2,
                    borderRadius: 999,
                    bgcolor: '#d9f5df',
                    color: '#12372a',
                    fontWeight: 800,
                    px: 3,
                    '&:hover': {
                      bgcolor: '#ffffff',
                    },
                  }}
                >
                  Login
                </Button>
              ) : (
                <Button
                  startIcon={<LogoutRounded />}
                  onClick={handleLogout}
                  sx={{
                    ml: 2,
                    borderRadius: 999,
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,.25)',
                    px: 3,
                  }}
                >
                  Logout
                </Button>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                color: '#fff',
                bgcolor: 'rgba(255,255,255,.08)',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,.18)',
                },
              }}
            >
              <MenuRounded />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
            {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 290,
            background:
              'linear-gradient(180deg, #0f3d2e 0%, #0f766e 55%, #1b5e20 100%)',
            color: '#fff',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: '1px solid rgba(255,255,255,.12)',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              letterSpacing: '.05em',
            }}
          >
            Menu
          </Typography>

          <IconButton
            onClick={() => setDrawerOpen(false)}
            sx={{ color: '#fff' }}
          >
            <MenuRounded />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          {phaseChip}

          {verifiedChip && (
            <Box sx={{ mt: 1 }}>
              {verifiedChip}
            </Box>
          )}
        </Box>

        <Divider
          sx={{
            borderColor: 'rgba(255,255,255,.15)',
          }}
        />

        <List sx={{ pt: 1 }}>
          {drawerItem(
            <HomeRounded />,
            'Home',
            '/'
          )}

          {drawerItem(
            <SportsSoccerRounded />,
            'Fixtures',
            '/fixtures'
          )}

          {drawerItem(
            <TableChartRounded />,
            'Knockout Bracket',
            '/bracket'
          )}

          {drawerItem(
            <EmojiEventsRounded />,
            'Leaderboard',
            '/overall-leaderboard'
          )}

          {user &&
            drawerItem(
              <DashboardRounded />,
              'Dashboard',
              '/dashboard'
            )}

          {user?.role === 'admin' &&
            drawerItem(
              <AdminPanelSettingsRounded />,
              'Admin Dashboard',
              '/admin'
            )}

          <Divider
            sx={{
              my: 1.5,
              borderColor: 'rgba(255,255,255,.15)',
            }}
          />

          {!user ? (
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  setDrawerOpen(false);
                  setOpenLogin(true);
                }}
              >
                <ListItemIcon
                  sx={{
                    color: '#fff',
                    minWidth: 42,
                  }}
                >
                  <LoginRounded />
                </ListItemIcon>

                <ListItemText
                  primary="Login"
                  primaryTypographyProps={{
                    fontWeight: 700,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ) : (
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
              >
                <ListItemIcon
                  sx={{
                    color: '#fff',
                    minWidth: 42,
                  }}
                >
                  <LogoutRounded />
                </ListItemIcon>

                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{
                    fontWeight: 700,
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <Box sx={{ flexGrow: 1 }} />

        <Box
          sx={{
            p: 2,
            textAlign: 'center',
            opacity: 0.75,
            fontSize: '.75rem',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#fff',
              fontWeight: 700,
            }}
          >
            World Cup Fantasy League
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,.65)',
            }}
          >
            © 2026
          </Typography>
        </Box>
      </Drawer>

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
