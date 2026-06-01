import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import axios from '../axiosConfig';

function PrizePool() {
  const [pool, setPool] = useState(0);
  const [displayPool, setDisplayPool] = useState(0);

  useEffect(() => {
    axios.get('/auth/prize-pool')
      .then(res => {
        const target = res.data.prizePool;
        setPool(target);

        // Animate counter
        let start = 0;
        const step = Math.ceil(target / 50); // adjust speed
        const interval = setInterval(() => {
          start += step;
          if (start >= target) {
            start = target;
            clearInterval(interval);
          }
          setDisplayPool(start);
        }, 30); // 30ms per tick
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <Box
  sx={{
    mt: 6,
    p: 4,
    borderRadius: 5,
    background: 'linear-gradient(135deg, #B9F0D6 0%, #E6F9EF 100%)', // ✅ softer mint gradient
    color: '#004d40', // deep teal text for contrast
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
    animation: 'pulseGlow 3s infinite',
    '@keyframes pulseGlow': {
      '0%': { boxShadow: '0 0 12px rgba(185,240,214,0.4)' },
      '50%': { boxShadow: '0 0 24px rgba(185,240,214,0.6)' },
      '100%': { boxShadow: '0 0 12px rgba(185,240,214,0.4)' },
    }
  }}
>
  <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#00695c' }}>
    🏆 R200 Entry. Winner Takes All!
  </Typography>
  <Typography variant="h6" sx={{ mb: 3, color: '#00796b' }}>
    Current Prize Pool: <strong>R{displayPool}</strong>
  </Typography>
  <LinearProgress
    variant="determinate"
    value={Math.min(pool / 5000 * 100, 100)}
    sx={{
      height: 12,
      borderRadius: 6,
      backgroundColor: 'rgba(255,255,255,0.4)',
      '& .MuiLinearProgress-bar': {
        backgroundColor: '#00bfa5',
      },
    }}
  />
  <Typography variant="body1" sx={{ mt: 2, color: '#004d40' }}>
    The more verified players, the bigger the pot.  
    The champion with the most points and best goal difference takes it all!
  </Typography>
</Box>

  );
}

export default PrizePool;
