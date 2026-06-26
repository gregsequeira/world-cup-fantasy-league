import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Fade, Paper } from '@mui/material';
import FixturesByRound from './FixturesByRound';

const FixturesTabs = () => {
  const [tab, setTab] = useState(0);
  const rounds = [
  { value: 1, label: 'Round 1' },
  { value: 2, label: 'Round 2' },
  { value: 3, label: 'Round 3' },
  { value: 4, label: 'Round of 32' },
  { value: 5, label: 'Round of 16' },
  { value: 6, label: 'Quarter-Finals' },
  { value: 7, label: 'Semi-Finals' },
  { value: 8, label: 'Final' },
];
  const handleTabChange = (event, newValue) => setTab(newValue);

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 4,
        background: '#ffffffcc',
        p: { xs: 2, md: 3 },
      }}
    >
      {/* Round Tabs Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          borderRadius: 3,
          bgcolor: '#7FC8A9',
          color: '#ffffff',
          mb: 2, // ✅ small margin below bar
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              fontWeight: 700,
              minWidth: { xs: 'auto', md: 120 },
              color: '#fff',
            },
            '& .Mui-selected': {
              color: '#fff',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#fff',
              height: 3,
            },
          }}
        >
          {rounds.map(round => (
  <Tab
    key={round.value}
    label={round.label}
  />
))}
        </Tabs>
      </AppBar>

      {/* Round Content */}
      <Fade in timeout={500}>
  <Box sx={{ py: 1 }}>
    <FixturesByRound round={rounds[tab].value} />
  </Box>
</Fade>
    </Paper>
  );
};

export default FixturesTabs;
