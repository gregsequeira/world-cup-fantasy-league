import React from 'react';
import { Paper, Box } from '@mui/material';
import StandingsPage from './StandingsPage';

const StandingsSection = () => (
  <Paper
    elevation={3}
    sx={{
      p: { xs: 2, md: 3 },
      borderRadius: 4,
      background: '#ffffffcc',
    }}
  >
    <Box>
      <StandingsPage />
    </Box>
  </Paper>
);

export default StandingsSection;
