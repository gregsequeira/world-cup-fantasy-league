import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import SportsSoccerRoundedIcon from '@mui/icons-material/SportsSoccerRounded';
import Flag from 'react-world-flags';
import axios from '../axiosConfig';
import { formatShortDate, formatShortTime } from '../utils/dateUtils';

const ROUND_TITLES = {
  1: 'Round 1',
  2: 'Round 2',
  3: 'Round 3',
  4: 'Round of 32',
  5: 'Round of 16',
  6: 'Quarter-finals',
  7: 'Semi-finals',
  8: 'Final',
};

const normaliseStatus = (status) => String(status || '').toLowerCase();
const hasValue = (value) => value !== null && value !== undefined && value !== '';

const FixturesPage = ({ fixturesOverride, loadingOverride = false, errorOverride = '' }) => {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(!Array.isArray(fixturesOverride));
  const [error, setError] = useState('');
  const [, refreshCountdown] = useState(0);

  useEffect(() => {
    if (Array.isArray(fixturesOverride)) return undefined;

    let active = true;
    setLoading(true);

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
  }, [fixturesOverride]);

  useEffect(() => {
    const timer = setInterval(() => refreshCountdown((value) => value + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const data = Array.isArray(fixturesOverride) ? fixturesOverride : fixtures;
  const isLoading = Array.isArray(fixturesOverride) ? loadingOverride : loading;
  const requestError = Array.isArray(fixturesOverride) ? errorOverride : error;

  const groupedFixtures = useMemo(() => {
    const groups = data.reduce((result, fixture) => {
      const round = fixture.round || 'UNASSIGNED';
      if (!result[round]) result[round] = [];
      result[round].push(fixture);
      return result;
    }, {});

    Object.values(groups).forEach((roundFixtures) => {
      roundFixtures.sort((a, b) => {
        const aDate = `${String(a.match_date || '').slice(0, 10)}T${a.match_time || '00:00'}`;
        const bDate = `${String(b.match_date || '').slice(0, 10)}T${b.match_time || '00:00'}`;
        return new Date(aDate) - new Date(bDate);
      });
    });

    return groups;
  }, [data]);

  const sortedRounds = Object.keys(groupedFixtures).sort((a, b) => {
    if (a === 'UNASSIGNED') return 1;
    if (b === 'UNASSIGNED') return -1;
    return Number(a) - Number(b);
  });

  const getMatchDateTime = (fixture) => {
    const date = String(fixture.match_date || '').slice(0, 10);
    const time = fixture.match_time || '00:00:00';
    return new Date(`${date}T${time}`);
  };

  const getCountdown = (fixture) => {
    const difference = getMatchDateTime(fixture) - new Date();
    if (!Number.isFinite(difference) || difference <= 0) return '';

    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference / 3600000) % 24);
    const minutes = Math.floor((difference / 60000) % 60);

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getWinnerSide = (fixture) => {
    if (normaliseStatus(fixture.status) !== 'completed') return null;

    if (hasValue(fixture.winner_team_id)) {
      if (String(fixture.winner_team_id) === String(fixture.home_team_id)) return 'home';
      if (String(fixture.winner_team_id) === String(fixture.away_team_id)) return 'away';
    }

    const homeScore = Number(fixture.home_score);
    const awayScore = Number(fixture.away_score);
    if (homeScore > awayScore) return 'home';
    if (awayScore > homeScore) return 'away';

    const homePenalties = Number(fixture.penalty_home);
    const awayPenalties = Number(fixture.penalty_away);
    if (homePenalties > awayPenalties) return 'home';
    if (awayPenalties > homePenalties) return 'away';
    return null;
  };

  const getStatus = (fixture) => {
    const status = normaliseStatus(fixture.status);
    if (status === 'completed') return { label: 'Full time', color: '#fff', background: '#1b5e20' };
    if (status === 'live') return { label: 'Live', color: '#fff', background: '#c62828', live: true };

    const countdown = getCountdown(fixture);
    return {
      label: countdown ? `Kick-off in ${countdown}` : 'Upcoming',
      color: '#fff',
      background: '#b45309',
    };
  };

  const formatScore = (fixture, side) => {
    const status = normaliseStatus(fixture.status);
    if (!['live', 'completed'].includes(status)) return '-';

    const score = side === 'home' ? fixture.home_score : fixture.away_score;
    const penalties = side === 'home' ? fixture.penalty_home : fixture.penalty_away;
    if (!hasValue(score)) return '-';

    if (String(fixture.decided_by).toLowerCase() === 'penalties' && hasValue(penalties)) {
      return `${score} (${penalties})`;
    }

    return score;
  };

  const getTeam = (fixture, side) => ({
    name:
      fixture[`${side}_team`] ||
      fixture[`${side}_placeholder`] ||
      'To be confirmed',
    flag: fixture[`${side}_flag`],
  });

  if (isLoading) {
    return (
      <Box sx={{ minHeight: 240, display: 'grid', placeItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={34} sx={{ color: '#0f766e' }} />
          <Typography sx={{ mt: 1, color: '#375448', fontWeight: 700 }}>Loading fixtures...</Typography>
        </Box>
      </Box>
    );
  }

  if (requestError) return <Alert severity="error" sx={{ my: 2 }}>{requestError}</Alert>;

  if (!sortedRounds.length) {
    return (
      <Box sx={{ py: 7, textAlign: 'center' }}>
        <SportsEmptyState />
        <Typography sx={{ mt: 1.5, color: '#375448', fontWeight: 800 }}>
          No fixtures have been added for this round yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        py: { xs: 2, md: 3 },
        maxWidth: 1120,
        mx: 'auto',
        '@keyframes livePulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(198,40,40,0.35)' },
          '50%': { boxShadow: '0 0 0 7px rgba(198,40,40,0)' },
        },
      }}
    >
      {sortedRounds.map((round) => (
        <Box key={round} component="section" sx={{ mb: 3 }}>
          <Box
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: '8px 8px 0 0',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #0f3d2e 0%, #1b5e20 100%)',
            }}
          >
            <Typography component="h3" sx={{ color: '#fff', fontWeight: 900, fontSize: { xs: '1rem', md: '1.2rem' } }}>
              {round === 'UNASSIGNED' ? 'Unassigned round' : ROUND_TITLES[Number(round)]}
            </Typography>
          </Box>

          <List
            disablePadding
            sx={{
              p: { xs: 1, md: 1.5 },
              display: 'flex',
              flexDirection: 'column',
              gap: 1.25,
              border: '1px solid rgba(27,94,32,0.13)',
              borderTop: 0,
              borderRadius: '0 0 8px 8px',
              background: 'rgba(255,255,255,0.44)',
            }}
          >
            {groupedFixtures[round].map((fixture) => {
              const status = getStatus(fixture);
              const winnerSide = getWinnerSide(fixture);
              const home = getTeam(fixture, 'home');
              const away = getTeam(fixture, 'away');
              const completed = normaliseStatus(fixture.status) === 'completed';
              const winnerName = winnerSide ? (winnerSide === 'home' ? home.name : away.name) : '';

              return (
                <ListItem
                  key={fixture.id}
                  sx={{
                    p: { xs: 1.5, md: 2 },
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: '125px minmax(0, 1fr) 175px' },
                    gap: { xs: 1.5, md: 2.5 },
                    alignItems: 'center',
                    borderRadius: 1,
                    background: completed
                      ? 'linear-gradient(135deg, rgba(232,245,233,0.98) 0%, rgba(255,255,255,0.98) 100%)'
                      : 'rgba(255,255,255,0.94)',
                    border: completed ? '1px solid rgba(27,94,32,0.32)' : '1px solid rgba(15,118,110,0.14)',
                    boxShadow: '0 8px 22px rgba(15,23,42,0.09)',
                    transition: 'transform 180ms ease, box-shadow 180ms ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 13px 28px rgba(15,23,42,0.13)' },
                  }}
                >
                  <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                    <Typography sx={{ color: '#12372a', fontWeight: 900, fontSize: '0.9rem' }}>
                      {formatShortDate(fixture.match_date)}
                    </Typography>
                    <Typography sx={{ mt: 0.2, color: '#5c7267', fontSize: '0.8rem', fontWeight: 700 }}>
                      {formatShortTime(fixture.match_time)}
                    </Typography>
                  </Box>

                  <Box>
                    <Box sx={{ mb: 1.25, display: 'flex', justifyContent: 'center' }}>
                      <Chip
                        label={status.label}
                        size="small"
                        sx={{
                          height: 24,
                          borderRadius: 1,
                          color: status.color,
                          bgcolor: status.background,
                          fontWeight: 900,
                          fontSize: '0.68rem',
                          textTransform: 'uppercase',
                          ...(status.live ? { animation: 'livePulse 1.4s ease-in-out infinite' } : {}),
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: 'minmax(0,1fr) 48px 20px 48px minmax(0,1fr)', sm: 'minmax(130px,1fr) 62px 26px 62px minmax(130px,1fr)' },
                        gap: { xs: 0.5, sm: 1 },
                        alignItems: 'center',
                      }}
                    >
                      <TeamIdentity team={home} winner={winnerSide === 'home'} side="home" />
                      <Score value={formatScore(fixture, 'home')} winner={winnerSide === 'home'} />
                      <Typography sx={{ textAlign: 'center', color: '#6b7f75', fontWeight: 900, fontSize: '0.75rem' }}>VS</Typography>
                      <Score value={formatScore(fixture, 'away')} winner={winnerSide === 'away'} />
                      <TeamIdentity team={away} winner={winnerSide === 'away'} side="away" />
                    </Box>
                  </Box>

                  <Box sx={{ minWidth: 0, textAlign: { xs: 'center', md: 'right' } }}>
                    {fixture.venue && (
                      <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, alignItems: 'center', gap: 0.5 }}>
                        <PlaceRoundedIcon sx={{ color: '#0f766e', fontSize: 16 }} />
                        <Typography noWrap title={fixture.venue} sx={{ color: '#5c7267', fontWeight: 750, fontSize: '0.78rem' }}>
                          {fixture.venue}
                        </Typography>
                      </Box>
                    )}

                    {completed &&
                      winnerName &&
                      Number(fixture.round) >= 4 &&
                      Number(fixture.round) < 8 && (
                      <Chip
                        icon={<CheckCircleRoundedIcon />}
                        label={`${winnerName} advances`}
                        size="small"
                        sx={{ mt: fixture.venue ? 1 : 0, maxWidth: '100%', borderRadius: 1, bgcolor: '#d9fbe8', color: '#12372a', fontWeight: 850 }}
                      />
                    )}

                    {completed && winnerName && Number(fixture.round) === 8 && (
                      <Chip
                        icon={<EmojiEventsRoundedIcon />}
                        label={`${winnerName} - World champions`}
                        size="small"
                        sx={{ mt: fixture.venue ? 1 : 0, maxWidth: '100%', borderRadius: 1, bgcolor: '#fff3cd', color: '#8a5a00', fontWeight: 900 }}
                      />
                    )}
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Box>
      ))}
    </Box>
  );
};

const TeamIdentity = ({ team, winner, side }) => (
  <Box
    sx={{
      minWidth: 0,
      display: 'flex',
      flexDirection: side === 'away' ? 'row-reverse' : 'row',
      justifyContent: side === 'away' ? 'flex-start' : 'flex-start',
      alignItems: 'center',
      gap: { xs: 0.5, sm: 0.8 },
    }}
  >
    {team.flag && (
      <Flag
        code={team.flag}
        style={{ width: 28, height: 19, borderRadius: 2, flexShrink: 0, objectFit: 'cover' }}
      />
    )}
    <Typography
      noWrap
      title={team.name}
      sx={{
        minWidth: 0,
        color: winner ? '#1b5e20' : '#12372a',
        fontWeight: winner ? 950 : 750,
        fontSize: { xs: '0.72rem', sm: '0.9rem' },
        textAlign: side === 'away' ? 'right' : 'left',
      }}
    >
      {team.name}
    </Typography>
  </Box>
);

const Score = ({ value, winner }) => (
  <Box
    sx={{
      minHeight: { xs: 40, sm: 48 },
      px: 0.5,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 1,
      color: '#fff',
      bgcolor: winner ? '#1b5e20' : '#375448',
      boxShadow: winner ? '0 7px 16px rgba(27,94,32,0.24)' : 'none',
    }}
  >
    <Typography sx={{ fontWeight: 950, fontSize: { xs: '0.95rem', sm: '1.2rem' }, whiteSpace: 'nowrap' }}>
      {value}
    </Typography>
  </Box>
);

const SportsEmptyState = () => (
  <SportsSoccerRoundedIcon sx={{ color: '#0f766e', fontSize: 42, opacity: 0.7 }} />
);

export default FixturesPage;
