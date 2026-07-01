import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Paper,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import MilitaryTechRoundedIcon from '@mui/icons-material/MilitaryTechRounded';
import SportsSoccerRoundedIcon from '@mui/icons-material/SportsSoccerRounded';
import WorkspacePremiumRoundedIcon from '@mui/icons-material/WorkspacePremiumRounded';
import axios from '../axiosConfig';
import FixturesByRound from './FixturesByRound';

const ROUNDS = [
  { value: 1, label: 'Round 1', icon: SportsSoccerRoundedIcon, teams: 48 },
  { value: 2, label: 'Round 2', icon: SportsSoccerRoundedIcon, teams: 48 },
  { value: 3, label: 'Round 3', icon: SportsSoccerRoundedIcon, teams: 48 },
  { value: 4, label: 'Round of 32', icon: EmojiEventsRoundedIcon, teams: 32 },
  { value: 5, label: 'Round of 16', icon: WorkspacePremiumRoundedIcon, teams: 16 },
  { value: 6, label: 'Quarter-finals', icon: MilitaryTechRoundedIcon, teams: 8 },
  { value: 7, label: 'Semi-finals', icon: MilitaryTechRoundedIcon, teams: 4 },
  { value: 8, label: 'Final', icon: FlagRoundedIcon, teams: 2 },
];

const normaliseStatus = (status) => String(status || '').toLowerCase();

const FixturesTabs = () => {
  const [fixtures, setFixtures] = useState([]);
  const [selectedRound, setSelectedRound] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    axios
      .get('/fixtures')
      .then((response) => {
        if (active) setFixtures(Array.isArray(response.data) ? response.data : []);
      })
      .catch((requestError) => {
        console.error(requestError);
        if (active) setError('Fixtures could not be loaded. Please try again shortly.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const currentRound = useMemo(() => {
    if (!fixtures.length) return 1;

    const liveFixture = fixtures.find(
      (fixture) => normaliseStatus(fixture.status) === 'live'
    );
    if (liveFixture) return Number(liveFixture.round) || 1;

    const roundsWithFixtures = [...new Set(
      fixtures.map((fixture) => Number(fixture.round)).filter(Boolean)
    )].sort((a, b) => a - b);

    const firstUnfinishedRound = roundsWithFixtures.find((round) =>
      fixtures.some(
        (fixture) =>
          Number(fixture.round) === round &&
          normaliseStatus(fixture.status) !== 'completed'
      )
    );

    return firstUnfinishedRound || roundsWithFixtures.at(-1) || 1;
  }, [fixtures]);

  const activeRound = selectedRound || currentRound;
  const currentStage = ROUNDS.find((round) => round.value === currentRound) || ROUNDS[0];
  const CurrentStageIcon = currentStage.icon;

  const getTabStyles = (roundValue) => {
    if (roundValue === currentRound) {
      return {
        color: '#fff',
        background: 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
        boxShadow: '0 8px 20px rgba(180,83,9,0.24)',
      };
    }

    if (roundValue < currentRound) {
      return {
        color: '#fff',
        backgroundColor: '#1b5e20',
      };
    }

    return {
      color: '#33584b',
      backgroundColor: 'rgba(255,255,255,0.78)',
      border: '1px solid rgba(27,94,32,0.12)',
    };
  };

  return (
    <Paper
      elevation={0}
      sx={{
        overflow: 'hidden',
        borderRadius: 1,
        background: 'rgba(248,252,249,0.9)',
        border: '1px solid rgba(27,94,32,0.16)',
        boxShadow: '0 18px 44px rgba(15,23,42,0.13)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          pt: { xs: 3, md: 4 },
          pb: { xs: 5, md: 6 },
          color: '#fff',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0f3d2e 0%, #0f766e 58%, #1b5e20 100%)',
        }}
      >
        <Typography
          component="h2"
          sx={{ fontWeight: 950, fontSize: { xs: '1.35rem', md: '1.9rem' } }}
        >
          World Cup Fantasy League
        </Typography>
        <Typography sx={{ mt: 0.5, color: '#d9fbe8', fontWeight: 700 }}>
          Tournament Centre
        </Typography>
      </Box>

      <Box sx={{ px: 2, mt: -3.5, position: 'relative' }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 430,
            mx: 'auto',
            p: { xs: 2, md: 2.5 },
            borderRadius: 1,
            textAlign: 'center',
            background: 'linear-gradient(145deg, #fff8e1 0%, #fff 100%)',
            border: '1px solid rgba(245,158,11,0.46)',
            boxShadow: '0 12px 30px rgba(15,23,42,0.16)',
          }}
        >
          <Typography variant="overline" sx={{ color: '#8a5a00', fontWeight: 900 }}>
            Current tournament stage
          </Typography>
          <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <CurrentStageIcon sx={{ color: '#b45309' }} />
            <Typography sx={{ color: '#12372a', fontWeight: 950, fontSize: { xs: '1.15rem', md: '1.45rem' } }}>
              {currentStage.label}
            </Typography>
          </Box>
          <Chip
            label={`${currentStage.teams} teams remaining`}
            size="small"
            sx={{ mt: 1.5, borderRadius: 1, bgcolor: '#1b5e20', color: '#fff', fontWeight: 850 }}
          />
        </Paper>
      </Box>

      <Box sx={{ px: { xs: 1, md: 3 }, pt: 2.5 }}>
        <Tabs
          value={activeRound}
          onChange={(event, value) => {
            event.preventDefault();
            setSelectedRound(value);
          }}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Tournament rounds"
          sx={{
            minHeight: 54,
            '& .MuiTabs-indicator': { display: 'none' },
            '& .MuiTabs-flexContainer': { gap: 1 },
          }}
        >
          {ROUNDS.map((round) => {
            const RoundIcon = round.icon;
            const completed = round.value < currentRound;

            return (
              <Tab
                key={round.value}
                value={round.value}
                icon={completed ? <CheckRoundedIcon /> : <RoundIcon />}
                iconPosition="start"
                label={round.label}
                sx={{
                  minHeight: 42,
                  minWidth: 'max-content',
                  px: 1.5,
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 850,
                  fontSize: '0.8rem',
                  transition: 'transform 180ms ease, box-shadow 180ms ease',
                  ...getTabStyles(round.value),
                  '&.Mui-selected': { color: getTabStyles(round.value).color },
                  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 18px rgba(15,23,42,0.14)' },
                }}
              />
            );
          })}
        </Tabs>
      </Box>

      <Box sx={{ px: { xs: 1, md: 2 }, pb: 2 }}>
        <FixturesByRound
          fixtures={fixtures}
          loading={loading}
          error={error}
          round={activeRound}
        />
      </Box>
    </Paper>
  );
};

export default FixturesTabs;
