import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Fade, Paper } from '@mui/material';
import FixturesByRound from './FixturesByRound';

const FixturesTabs = () => {
  const [tab, setTab] = useState(0);
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
          <Tab label="Round 1" />
          <Tab label="Round 2" />
          <Tab label="Round 3" />
        </Tabs>
      </AppBar>

      {/* Round Content */}
      <Fade in={tab === 0} timeout={500} unmountOnExit>
        <Box sx={{ py: 1 }}>
          <FixturesByRound round={1} />
        </Box>
      </Fade>
      <Fade in={tab === 1} timeout={500} unmountOnExit>
        <Box sx={{ py: 1 }}>
          <FixturesByRound round={2} />
        </Box>
      </Fade>
      <Fade in={tab === 2} timeout={500} unmountOnExit>
        <Box sx={{ py: 1 }}>
          <FixturesByRound round={3} />
        </Box>
      </Fade>
    </Paper>
  );
};

export default FixturesTabs;
