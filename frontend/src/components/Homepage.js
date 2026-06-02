import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import {
  AppBar,
  Tabs,
  Tab,
  Box,
  Typography,
  Button,
  Container,
  Fade,
  Paper,
  Chip
} from '@mui/material';
import GroupTable from './GroupTable';
import CategoryList from './CategoryList';
import FixturesPage from './FixturesPage';
import StandingsPage from './StandingsPage';
import SignupModal from './SignupModal';
import LoginModal from './LoginModal';
import PrizePool from './PrizePool';
import HowToPlayModal from './HowToPlayModal'; // ✅ new import

function Homepage() {
  const [teams, setTeams] = useState([]);
  const [tab, setTab] = useState(0);
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [howOpen, setHowOpen] = useState(false);

  useEffect(() => {
    axios.get('/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleTabChange = (event, newValue) => setTab(newValue);
  const openSignup = () => setSignupOpen(true);
  const closeSignup = () => setSignupOpen(false);
  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);
  const openHow = () => setHowOpen(true);
  const closeHow = () => setHowOpen(false);

  const isLoggedIn = !!localStorage.getItem('token');
  const handlePickTeams = () => {
    if (isLoggedIn) {
      window.location.href = '/dashboard';
    } else {
      openSignup();
    }
  };

  return (
    <Box sx={{ background: 'linear-gradient(180deg, rgba(247,252,249,0.15) 0%, rgba(244,251,246,0.15) 100%)', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, rgba(127,200,169,0.5) 0%, rgba(185,240,214,0.35) 65%, rgba(230,249,239,0.28) 100%), url(/images/header.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          color: 'white',
          py: { xs: 8, md: 12 },
          px: { xs: 4, md: 10 },
          textAlign: 'center',
          borderBottomLeftRadius: 48,
          borderBottomRightRadius: 48,
          boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 900, mx: 'auto' }}>
          <Typography variant="h2" sx={{ fontWeight: 900, mb: 3, color: '66FFE0', textShadow: '0 2px 6px rgba(0,0,0,0.6)', fontSize: { xs: '2rem', md: '3rem' } }}>
            World Cup Fantasy League
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.95, maxWidth: 700, mx: 'auto', mb: 4, color: '#FCEBB6', textShadow: '0 1px 4px rgba(0,0,0,0.5)', fontSize: { xs: '0.9rem', md: '1.2rem' } }}>
            Choose your four nations, double down on your favourites, and rise through the ranks as the world’s biggest tournament unfolds.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={openHow}
              sx={{ px: { xs: 3, md: 6 }, py: 1.8, fontSize: '1rem', fontWeight: 700, borderRadius: 4 }}
              fullWidth={{ xs: true, md: false }}
            >
              How to Play
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handlePickTeams}
              sx={{ px: { xs: 3, md: 6 }, py: 1.8, fontSize: '1rem', fontWeight: 700, borderRadius: 4 }}
              fullWidth={{ xs: true, md: false }}
            >
              Pick Your Teams
            </Button>
          </Box>
        </Box>
      </Box>

      <Container sx={{ py: { xs: 6, md: 8 } }}>
        <Box sx={{ textAlign: 'center', mb: 5, px: { xs: 0, md: 8 } }}>
          <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
            Four picks. Endless excitement.
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 720, mx: 'auto' }}>
            Choose your favourite, seeded, dark horse, and underdog — then cheer them on as the tournament drama drives your points.
          </Typography>
        </Box>
        {/* Chips */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap', mt: 4 }}>
          <Chip label="⚽ Pick your nations" sx={{ bgcolor: '#7FC8A9', color: '#fff', fontWeight: 700 }} />
          <Chip label="📊 Score with every match" sx={{ bgcolor: '#7FC8A9', color: '#fff', fontWeight: 700 }} />
          <Chip label="🏆 Climb the leaderboard" sx={{ bgcolor: '#7FC8A9', color: '#fff', fontWeight: 700 }} />
        </Box>

        <PrizePool />

        {/* Tabs Section */}
        <Paper elevation={3} sx={{ mt: 5, borderRadius: 5, p: { xs: 2, md: 4 }, background: '#ffffffcc' }}>
          <AppBar
  position="static"
  elevation={0}
  sx={{
    borderRadius: 5,
    bgcolor: '#7FC8A9',
    color: '#ffffff',
  }}
>
  <Tabs
    value={tab}
    onChange={handleTabChange}
    variant="scrollable"
    scrollButtons="auto"
    centered={true} // ✅ keeps tabs centered when they fit
    allowScrollButtonsMobile // ✅ ensures scroll buttons appear on mobile
    sx={{
      '& .MuiTab-root': {
        fontWeight: 700,
        minWidth: { xs: 'auto', md: 120 }, // ✅ smaller tabs on mobile
      },
      justifyContent: { xs: 'flex-start', sm: 'center' }, // ✅ left on very small screens, centered otherwise
    }}
  >
    <Tab label="Groups" />
    <Tab label="Categories" />
    <Tab label="Fixtures" />
    <Tab label="Standings" />
  </Tabs>
</AppBar>

          <Fade in={tab === 0} timeout={600} unmountOnExit>
            <Box sx={{ py: 3, overflowX: 'auto' }}>
              <GroupTable teams={teams} />
            </Box>
          </Fade>
          <Fade in={tab === 1} timeout={600} unmountOnExit>
            <Box sx={{ py: 3, overflowX: 'auto' }}>
              <CategoryList teams={teams} />
            </Box>
          </Fade>
          <Fade in={tab === 2} timeout={600} unmountOnExit>
            <Box sx={{ py: 3, overflowX: 'auto' }}>
              <FixturesPage />
            </Box>
          </Fade>
          <Fade in={tab === 3} timeout={600} unmountOnExit>
            <Box sx={{ py: 3, overflowX: 'auto' }}>
              <StandingsPage />
            </Box>
          </Fade>
        </Paper>

        {/* Final CTA */}
        <Paper elevation={0} sx={{ mt: 6, p: 4, borderRadius: 5, background: 'linear-gradient(135deg, #7FC8A9 0%, #B9F0D6 100%)', color: 'white', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Ready to dominate your league?</Typography>
            <Typography variant="body1" sx={{ opacity: 0.92, maxWidth: 560 }}>
              Sign up now and lock in your squad before the next matchday begins.
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={handlePickTeams}
            sx={{ px: { xs: 3, md: 5 }, py: 1.8, borderRadius: 4, fontWeight: 700 }}
            fullWidth={{ xs: true, md: false }}
          >
            Join the League
          </Button>
        </Paper>
      </Container>

      {/* Modals */}
      <SignupModal open={signupOpen} onClose={closeSignup} onOpenLogin={openLogin} />
      <LoginModal open={loginOpen} onClose={closeLogin} />
      <HowToPlayModal open={howOpen} onClose={closeHow} /> {/* ✅ new modal */}
    </Box>
  );
}

export default Homepage;
