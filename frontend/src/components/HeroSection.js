import React from 'react';
import { Box, Typography, Chip } from '@mui/material';

const HeroSection = () => (
  <Box
    sx={{
      position: 'relative',
      overflow: 'hidden',
      minHeight: { xs: 320, md: 430 },
      backgroundImage:
        'linear-gradient(90deg, rgba(8,32,24,0.86) 0%, rgba(14,70,49,0.66) 48%, rgba(14,70,49,0.28) 100%), url(/images/header.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center bottom',
      backgroundRepeat: 'no-repeat',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      borderBottomLeftRadius: { xs: 24, md: 36 },
      borderBottomRightRadius: { xs: 24, md: 36 },
      boxShadow: '0 24px 60px rgba(15,23,42,0.22)',
    }}
  >
    <Box
      sx={{
        width: '100%',
        maxWidth: 1280,
        mx: 'auto',
        px: { xs: 2.5, sm: 4, md: 6 },
        py: { xs: 6, md: 8 },
      }}
    >
      <Box sx={{ maxWidth: 760 }}>
        <Chip
          label="World Cup 2026 Fantasy"
          size="small"
          sx={{
            mb: 2,
            height: 28,
            color: '#093525',
            backgroundColor: '#d9fbe8',
            fontWeight: 900,
            borderRadius: 1.5,
          }}
        />

        <Typography
          variant="h1"
          sx={{
            fontWeight: 950,
            mb: 2,
            color: '#fff',
            textShadow: '0 3px 12px rgba(0,0,0,0.38)',
            fontSize: { xs: '2.2rem', sm: '2.8rem', md: '4rem' },
            lineHeight: 1.02,
            letterSpacing: 0,
          }}
        >
          World Cup Fantasy League
        </Typography>

        <Typography
          variant="h6"
          sx={{
            maxWidth: 660,
            color: '#fff7d6',
            textShadow: '0 2px 8px rgba(0,0,0,0.35)',
            fontSize: { xs: '0.98rem', md: '1.2rem' },
            lineHeight: 1.55,
            fontWeight: 600,
          }}
        >
          Choose your four nations, back your favourites, and climb the table as the tournament unfolds.
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default HeroSection;