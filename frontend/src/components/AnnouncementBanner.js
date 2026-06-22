import React, { useEffect, useState } from 'react';
import { Paper, Typography, Box, Chip, Button } from '@mui/material';
import axios from '../axiosConfig';

const getTimeParts = (cutoff) => {
  if (!cutoff) return null;

  const diff = cutoff - new Date();

  if (diff <= 0) {
    return {
      closed: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  return {
    closed: false,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
};

const CountdownChip = ({ value, label, pulse }) => (
  <Box
    sx={{
      minWidth: 54,
      px: 0.9,
      py: 0.65,
      borderRadius: 1.25,
      background:
        'linear-gradient(145deg, rgba(255,255,255,0.82) 0%, rgba(217,251,232,0.72) 100%)',
      border: '1px solid rgba(27,94,32,0.14)',
      boxShadow: '0 6px 14px rgba(15,23,42,0.08)',
      textAlign: 'center',
      animation: pulse ? 'bannerPulse 1s ease-in-out infinite' : 'none',
    }}
  >
    <Typography
      sx={{
        color: '#12372a',
        fontWeight: 950,
        fontSize: { xs: '0.95rem', md: '1.1rem' },
        lineHeight: 1,
      }}
    >
      {String(value).padStart(2, '0')}
    </Typography>

    <Typography
      variant="caption"
      sx={{
        display: 'block',
        mt: 0.25,
        color: '#60756b',
        fontWeight: 850,
        textTransform: 'uppercase',
        fontSize: '0.58rem',
        lineHeight: 1,
      }}
    >
      {label}
    </Typography>
  </Box>
);

const AnnouncementBanner = () => {
  const [cutoff, setCutoff] = useState(null);
  const [timeParts, setTimeParts] = useState(null);

  useEffect(() => {
    axios.get('/cutoff')
      .then(res => setCutoff(new Date(res.data.cutoff)))
      .catch(err => console.error('Cutoff fetch failed', err));
  }, []);

  useEffect(() => {
    if (!cutoff) return;

    const updateTimer = () => {
      setTimeParts(getTimeParts(cutoff));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [cutoff]);

  const closed = timeParts?.closed;

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 2.75 },
        borderRadius: 2,
        position: 'relative',
        background: closed
          ? 'linear-gradient(135deg, rgba(254,226,226,0.98) 0%, rgba(255,248,225,0.96) 52%, rgba(232,245,233,0.94) 100%)'
          : 'linear-gradient(135deg, rgba(255,248,225,0.98) 0%, rgba(255,236,179,0.96) 44%, rgba(232,245,233,0.96) 100%)',
        color: '#163226',
        border: '1px solid rgba(245,158,11,0.42)',
        boxShadow: '0 16px 42px rgba(15,23,42,0.14)',
        overflow: 'hidden',
        '@keyframes bannerPulse': {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 6px 14px rgba(15,23,42,0.08)',
          },
          '50%': {
            transform: 'scale(1.04)',
            boxShadow: '0 8px 18px rgba(245,158,11,0.18)',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 6px 14px rgba(15,23,42,0.08)',
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.35fr auto' },
          gap: { xs: 2, md: 3 },
          alignItems: 'center',
        }}
      >
        <Box>
          <Chip
            label={closed ? 'Selections Closed' : 'Knockout Stage'}
            size="small"
            sx={{
              mb: 1.25,
              height: 24,
              borderRadius: 1.25,
              backgroundColor: closed ? '#991b1b' : '#1b5e20',
              color: '#fff',
              fontWeight: 900,
              fontSize: '0.7rem',
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 950,
              mb: 0.75,
              color: '#12372a',
              fontSize: { xs: '1.18rem', md: '1.55rem' },
              letterSpacing: 0,
            }}
          >
            {closed ? 'Knockout selections are closed' : 'Knockout selections coming soon'}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#375448',
              fontWeight: 650,
              mb: 1.5,
              lineHeight: 1.45,
            }}
          >
            Choose your knockout favourite and three extra teams before the next stage begins.
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Chip label="1 Favourite" size="small" sx={{ backgroundColor: '#d9fbe8', color: '#12372a', fontWeight: 800, borderRadius: 1.25 }} />
            <Chip label="3 More Teams" size="small" sx={{ backgroundColor: '#e8f5e9', color: '#1b5e20', fontWeight: 800, borderRadius: 1.25 }} />
            <Chip label="GD excludes penalties" size="small" sx={{ backgroundColor: '#fff3cd', color: '#8a5a00', fontWeight: 800, borderRadius: 1.25 }} />

            {!timeParts ? (
              <Chip
                label="Loading deadline..."
                size="small"
                sx={{
                  backgroundColor: '#fff',
                  color: '#b45309',
                  fontWeight: 900,
                  borderRadius: 1.25,
                  border: '1px solid rgba(180,83,9,0.24)',
                }}
              />
            ) : closed ? (
              <Chip
                label="Selections closed"
                size="small"
                sx={{
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  fontWeight: 900,
                  borderRadius: 1.25,
                  border: '1px solid rgba(153,27,27,0.22)',
                }}
              />
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.75,
                  alignItems: 'center',
                }}
              >
                <CountdownChip value={timeParts.days} label="Days" />
                <CountdownChip value={timeParts.hours} label="Hrs" />
                <CountdownChip value={timeParts.minutes} label="Mins" />
                <CountdownChip value={timeParts.seconds} label="Secs" pulse />
              </Box>
            )}
          </Box>
        </Box>

        <Button
          variant="contained"
          fullWidth
          disabled={closed}
          sx={{
            minWidth: { md: 220 },
            py: 1.15,
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 900,
            color: '#fff',
            backgroundColor: '#0f766e',
            boxShadow: '0 10px 22px rgba(15,118,110,0.24)',
            '&:hover': {
              backgroundColor: '#0b625c',
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(15,118,110,0.32)',
              color: 'rgba(255,255,255,0.7)',
              boxShadow: 'none',
            },
          }}
          onClick={() => {
            window.location.href = '/knockout';
          }}
        >
          Make Knockout Picks
        </Button>
      </Box>
    </Paper>
  );
};

export default AnnouncementBanner;  