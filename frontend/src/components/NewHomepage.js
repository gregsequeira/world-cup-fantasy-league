import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import AnnouncementBanner from '../components/AnnouncementBanner';
import FixturesTabs from '../components/FixturesTabs';
import StandingsPage from '../components/StandingsPage';
import OverallLeaderboard from '../components/OverallLeaderboard';
import KnockoutBracket from '../components/KnockoutBracket';
import { Tabs, Tab, Box, Fade, Paper } from '@mui/material';

const tabs = [
  { label: 'Leaderboard', component: <OverallLeaderboard /> },
  { label: 'Fixtures', component: <FixturesTabs /> },
  { label: 'Standings', component: <StandingsPage /> },
  { label: 'Knockout Bracket', component: <KnockoutBracket /> },
];

const NewHomepage = () => {
  const [tab, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

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
        sx={{
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 1.5, sm: 2, md: 3 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 4, md: 6 },
        }}
      >
        <AnnouncementBanner />

        <Paper
          elevation={0}
          sx={{
            mt: { xs: 2, md: 3 },
            borderRadius: 2,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.94)',
            border: '1px solid rgba(27,94,32,0.14)',
            boxShadow: '0 18px 50px rgba(15, 23, 42, 0.12)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              px: { xs: 1, md: 2 },
              pt: { xs: 1, md: 1.5 },
              background:
                'linear-gradient(135deg, #0f3d2e 0%, #1b5e20 48%, #0f766e 100%)',
              borderBottom: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              TabIndicatorProps={{ sx: { display: 'none' } }}
              sx={{
                minHeight: 52,
                '& .MuiTabs-flexContainer': {
                  gap: 1,
                },
                '& .MuiTab-root': {
                  minHeight: 44,
                  minWidth: { xs: 'auto', md: 138 },
                  px: { xs: 1.5, md: 2.5 },
                  mb: 1,
                  borderRadius: 1.5,
                  color: 'rgba(255,255,255,0.76)',
                  fontWeight: 800,
                  fontSize: { xs: '0.78rem', md: '0.88rem' },
                  textTransform: 'none',
                  letterSpacing: 0,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    color: '#fff',
                    backgroundColor: 'rgba(255,255,255,0.12)',
                  },
                },
                '& .Mui-selected': {
                  color: '#113829 !important',
                  backgroundColor: '#d9fbe8',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.18)',
                },
              }}
            >
              {tabs.map(item => (
                <Tab key={item.label} label={item.label} />
              ))}
            </Tabs>
          </Box>

          <Box
           sx={{
        p: { xs: 1.25, md: 2 },
        borderRadius: 2,
        background:
          'linear-gradient(135deg, rgba(15,61,46,0.90) 0%, rgba(27,94,32,0.58) 42%, rgba(245,158,11,0.22) 100%)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
      }}
          >
            {tabs.map((item, index) => (
              <Fade key={item.label} in={tab === index} timeout={350} unmountOnExit>
                <Box>{item.component}</Box>
              </Fade>
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default NewHomepage;