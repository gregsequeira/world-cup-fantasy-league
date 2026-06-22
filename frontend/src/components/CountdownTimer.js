import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

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

const TimeBlock = ({ value, label, pulse }) => (
  <Box
    sx={{
      minWidth: { xs: 64, sm: 82 },
      px: { xs: 1, sm: 1.5 },
      py: { xs: 1, sm: 1.25 },
      borderRadius: 1.75,
      background:
        'linear-gradient(145deg, rgba(255,255,255,0.18) 0%, rgba(217,251,232,0.14) 100%)',
      border: '1px solid rgba(255,255,255,0.22)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 24px rgba(15,23,42,0.14)',
      animation: pulse ? 'softPulse 1s ease-in-out infinite' : 'none',
    }}
  >
    <Typography
      sx={{
        color: '#fff7d6',
        fontWeight: 950,
        fontSize: { xs: '1.35rem', sm: '1.75rem', md: '2rem' },
        lineHeight: 1,
        textShadow: '0 3px 12px rgba(0,0,0,0.26)',
      }}
    >
      {String(value).padStart(2, '0')}
    </Typography>

    <Typography
      variant="caption"
      sx={{
        display: 'block',
        mt: 0.5,
        color: 'rgba(217,251,232,0.86)',
        fontWeight: 850,
        textTransform: 'uppercase',
        fontSize: { xs: '0.62rem', sm: '0.68rem' },
      }}
    >
      {label}
    </Typography>
  </Box>
);

const CountdownTimer = ({ cutoff }) => {
  const [timeParts, setTimeParts] = useState(null);

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
        mb: 3,
        p: { xs: 2, md: 2.75 },
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        background: closed
          ? 'linear-gradient(135deg, rgba(80,24,24,0.94) 0%, rgba(127,29,29,0.78) 55%, rgba(245,158,11,0.22) 100%)'
          : 'linear-gradient(135deg, rgba(15,61,46,0.94) 0%, rgba(27,94,32,0.72) 52%, rgba(245,158,11,0.30) 100%)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: '0 18px 50px rgba(15,23,42,0.16)',
        backdropFilter: 'blur(10px)',
        textAlign: 'center',
        '@keyframes softPulse': {
          '0%': {
            transform: 'scale(1)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 24px rgba(15,23,42,0.14)',
          },
          '50%': {
            transform: 'scale(1.035)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.24), 0 12px 30px rgba(245,158,11,0.22)',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 24px rgba(15,23,42,0.14)',
          },
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 18% 20%, rgba(255,247,214,0.18) 0%, transparent 28%), radial-gradient(circle at 82% 24%, rgba(217,251,232,0.14) 0%, transparent 30%)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Chip
          label={closed ? 'Closed' : 'Deadline approaching'}
          size="small"
          sx={{
            mb: 1.25,
            borderRadius: 1.25,
            backgroundColor: closed ? '#fee2e2' : '#fff3cd',
            color: closed ? '#991b1b' : '#8a5a00',
            fontWeight: 900,
          }}
        />

        <Typography
          variant="overline"
          sx={{
            display: 'block',
            color: '#d9fbe8',
            fontWeight: 900,
            letterSpacing: 0,
            lineHeight: 1.2,
          }}
        >
          Knockout Selection Deadline
        </Typography>

        {!timeParts ? (
          <Typography
            variant="h4"
            sx={{
              mt: 1,
              color: '#fff7d6',
              fontWeight: 950,
              fontSize: { xs: '1.35rem', md: '2rem' },
              textShadow: '0 3px 12px rgba(0,0,0,0.28)',
            }}
          >
            Loading deadline...
          </Typography>
        ) : closed ? (
          <Typography
            variant="h4"
            sx={{
              mt: 1,
              color: '#fecaca',
              fontWeight: 950,
              fontSize: { xs: '1.55rem', md: '2.25rem' },
              textShadow: '0 3px 12px rgba(0,0,0,0.28)',
            }}
          >
            Selections closed
          </Typography>
        ) : (
          <Box
            sx={{
              mt: 2,
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: { xs: 1, sm: 1.25 },
            }}
          >
            <TimeBlock value={timeParts.days} label="Days" />
            <TimeBlock value={timeParts.hours} label="Hours" />
            <TimeBlock value={timeParts.minutes} label="Mins" />
            <TimeBlock value={timeParts.seconds} label="Secs" pulse />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default CountdownTimer;