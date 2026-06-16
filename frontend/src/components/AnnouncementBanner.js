import React from 'react';
import { Paper, Typography, Box, Chip } from '@mui/material';
// import { Button } from '@mui/material';

const AnnouncementBanner = () => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, md: 2.75 },
      borderRadius: 2,
      background:
        'linear-gradient(135deg, rgba(255,248,225,0.98) 0%, rgba(255,236,179,0.96) 44%, rgba(232,245,233,0.96) 100%)',
      color: '#163226',
      border: '1px solid rgba(245,158,11,0.42)',
      boxShadow: '0 16px 42px rgba(15,23,42,0.14)',
      overflow: 'hidden',
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
          label="Knockout Stage"
          size="small"
          sx={{
            mb: 1.25,
            height: 24,
            borderRadius: 1.25,
            backgroundColor: '#1b5e20',
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
          Knockout selections coming soon
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
          }}
        >
          <Chip label="1 Favourite" size="small" sx={{ backgroundColor: '#d9fbe8', color: '#12372a', fontWeight: 800, borderRadius: 1.25 }} />
          <Chip label="3 More Teams" size="small" sx={{ backgroundColor: '#e8f5e9', color: '#1b5e20', fontWeight: 800, borderRadius: 1.25 }} />
          <Chip label="GD excludes penalties" size="small" sx={{ backgroundColor: '#fff3cd', color: '#8a5a00', fontWeight: 800, borderRadius: 1.25 }} />
          <Chip label="Deadline: June 28, 7pm" size="small" sx={{ backgroundColor: '#fff', color: '#b45309', fontWeight: 900, borderRadius: 1.25, border: '1px solid rgba(180,83,9,0.24)' }} />
        </Box>
      </Box>

      {/*<Button
        variant="contained"
        fullWidth
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
        }}
        onClick={() => {
          window.location.href = '/teams';
        }}
      >
        Make Knockout Picks
      </Button> */}
    </Box>
  </Paper>
);

export default AnnouncementBanner;