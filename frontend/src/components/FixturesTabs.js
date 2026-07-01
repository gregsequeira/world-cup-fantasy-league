import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Tabs,
  Tab,
} from '@mui/material';

import SportsSoccerRoundedIcon from '@mui/icons-material/SportsSoccerRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';

import FixturesByRound from './FixturesByRound';

const FixturesTabs = () => {
  const [tab, setTab] = useState(0);

  /*
    Current tournament round.

    1 = Round 1
    2 = Round 2
    3 = Round 3
    4 = Round of 32
    5 = Round of 16
    6 = Quarter-finals
    7 = Semi-finals
    8 = Final

    For now this is hard coded.
    Later we'll fetch it automatically from the backend.
  */
  const currentRound = 6;

  const rounds = useMemo(() => [
    {
      value: 1,
      label: 'Round 1',
      icon: <SportsSoccerRoundedIcon fontSize="small" />,
    },
    {
      value: 2,
      label: 'Round 2',
      icon: <SportsSoccerRoundedIcon fontSize="small" />,
    },
    {
      value: 3,
      label: 'Round 3',
      icon: <SportsSoccerRoundedIcon fontSize="small" />,
    },
    {
      value: 4,
      label: 'Round of 32',
      icon: <EmojiEventsRoundedIcon fontSize="small" />,
    },
    {
      value: 5,
      label: 'Round of 16',
      icon: <WorkspacePremiumRoundedIcon fontSize="small" />,
    },
    {
      value: 6,
      label: 'Quarter-finals',
      icon: <MilitaryTechRoundedIcon fontSize="small" />,
    },
    {
      value: 7,
      label: 'Semi-finals',
      icon: <MilitaryTechRoundedIcon fontSize="small" />,
    },
    {
      value: 8,
      label: 'Final',
      icon: <FlagRoundedIcon fontSize="small" />,
    },
  ], []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const currentStage =
    rounds.find(r => r.value === currentRound) || rounds[0];

  const teamsRemaining = {
    1: 48,
    2: 48,
    3: 48,
    4: 32,
    5: 16,
    6: 8,
    7: 4,
    8: 2,
  };

  const getTabStyles = (roundValue) => {
    const completed = roundValue < currentRound;
    const current = roundValue === currentRound;

    if (current) {
      return {
        color: '#ffffff',
        background:
          'linear-gradient(135deg,#b45309 0%,#f59e0b 55%,#1b5e20 100%)',
        boxShadow: '0 8px 22px rgba(180,83,9,0.35)',
        transform: 'translateY(-2px)',
      };
    }

    if (completed) {
      return {
        color: '#ffffff',
        background:
          'linear-gradient(135deg,#1b5e20 0%,#2e7d32 100%)',
      };
    }

    return {
      color: '#33584b',
      background: 'rgba(255,255,255,0.82)',
    };
  };

  return (
  <Paper
    elevation={0}
    sx={{
      borderRadius: 5,
      overflow: 'hidden',
      background:
        'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(243,248,245,0.96) 100%)',
      border: '1px solid rgba(217,251,232,0.75)',
      boxShadow: '0 18px 40px rgba(15,23,42,0.14)',
    }}
  >

    {/* ================= Tournament Header ================= */}

    <Box
      sx={{
        background:
          'linear-gradient(135deg,#0f3d2e 0%,#0f766e 55%,#1b5e20 100%)',
        color: '#fff',
        textAlign: 'center',
        py: { xs: 3, md: 4 },
        px: 2,
      }}
    >
      <Typography
        sx={{
          fontWeight: 900,
          letterSpacing: 2,
          fontSize: {
            xs: '1.25rem',
            md: '2rem',
          },
        }}
      >
        🏆 WORLD CUP FANTASY LEAGUE
      </Typography>

      <Typography
        sx={{
          mt: 1,
          opacity: 0.9,
          fontSize: {
            xs: '.85rem',
            md: '1rem',
          },
        }}
      >
        Tournament Centre
      </Typography>
    </Box>

    {/* ================= Current Stage ================= */}

    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: -3,
        mb: 3,
        px: 2,
      }}
    >
      <Paper
        elevation={5}
        sx={{
          px: 4,
          py: 2.5,
          borderRadius: 4,
          textAlign: 'center',
          background:
            'linear-gradient(145deg,#fff8e1 0%,#ffffff 100%)',
          border: '2px solid rgba(245,158,11,0.45)',
          maxWidth: 420,
          width: '100%',
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: '#8a5a00',
            fontWeight: 900,
            letterSpacing: 2,
          }}
        >
          CURRENT TOURNAMENT STAGE
        </Typography>

        <Typography
          sx={{
            mt: 1,
            fontWeight: 900,
            color: '#12372a',
            fontSize: {
              xs: '1.2rem',
              md: '1.6rem',
            },
          }}
        >
          {currentStage.icon}
          <Box
            component="span"
            sx={{ ml: 1 }}
          >
            {currentStage.label}
          </Box>
        </Typography>

        <Chip
          label={`${teamsRemaining[currentRound]} Teams Remaining`}
          sx={{
            mt: 2,
            background: '#1b5e20',
            color: '#fff',
            fontWeight: 800,
          }}
        />
      </Paper>
    </Box>

    {/* ================= Round Navigation ================= */}

    <Box sx={{ px: { xs: 1, md: 3 }, pb: 3 }}>

      <Tabs
        value={tab}
        onChange={handleTabChange}
        variant="scrollable"
        allowScrollButtonsMobile
        scrollButtons="auto"
        sx={{
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >

        {rounds.map((round) => {

          const completed = round.value < currentRound;

          return (
            <Tab
              key={round.value}
              label={
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: .75,
                  }}
                >
                  {completed ? "✓" : round.icon}

                  <Typography
                    sx={{
                      fontWeight: 800,
                      fontSize: '.82rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {round.label}
                  </Typography>
                </Box>
              }
              sx={{
                mx: .5,
                my: 1,
                borderRadius: 999,
                minHeight: 48,
                px: 2,
                textTransform: 'none',
                transition: '.25s',
                ...getTabStyles(round.value),

                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow:
                    '0 10px 22px rgba(15,23,42,0.16)',
                },
              }}
            />
          );

        })}

      </Tabs>

    </Box>

    {/* ================= Fixtures ================= */}

    <Box
      sx={{
        px: {
          xs: 1,
          md: 2,
        },
        pb: 2,
      }}
    >
          <FixturesByRound round={rounds[tab].value} />
    </Box>

  </Paper>
);

};

export default FixturesTabs;
