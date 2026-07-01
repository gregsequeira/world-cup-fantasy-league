import React, { useEffect, useState } from 'react';
import { Alert, Box } from '@mui/material';
import axios from '../axiosConfig';
import AnnouncementBanner from '../components/AnnouncementBanner';
import HeroSection from '../components/HeroSection';
import TournamentPulse from '../components/TournamentPulse';

const NewHomepage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      axios.get('/fixtures'),
      axios.get('/user-scores'),
    ]).then(([fixturesResult, scoresResult]) => {
      if (!active) return;

      if (fixturesResult.status === 'fulfilled') {
        setFixtures(Array.isArray(fixturesResult.value.data) ? fixturesResult.value.data : []);
      } else {
        console.error('Fixtures could not be loaded', fixturesResult.reason);
      }

      if (scoresResult.status === 'fulfilled') {
        setScores(Array.isArray(scoresResult.value.data) ? scoresResult.value.data : []);
      } else {
        console.error('Leaderboard could not be loaded', scoresResult.reason);
      }

      if (fixturesResult.status === 'rejected' && scoresResult.status === 'rejected') {
        setError('Tournament information could not be loaded. Please refresh the page shortly.');
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <Box
      className="homepage"
      sx={{
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(180deg, rgba(244,251,247,0.88) 0%, rgba(238,247,242,0.94) 44%, rgba(230,241,236,0.96) 100%), url(/images/header.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        backgroundRepeat: 'no-repeat',
      }}
    >
      <HeroSection />

      <Box
        component="main"
        sx={{
          width: '100%',
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 1.5, sm: 2, md: 3 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 4, md: 6 },
        }}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <AnnouncementBanner
          fixtures={fixtures}
          scores={scores}
          loading={loading}
        />

        <TournamentPulse
          fixtures={fixtures}
          scores={scores}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default NewHomepage;
