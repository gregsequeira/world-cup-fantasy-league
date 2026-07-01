import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import {
  Box,
  Typography,
  List,
  ListItem,
  Paper,
  Chip,
} from '@mui/material';
import Flag from 'react-world-flags';
import { formatShortDate, formatShortTime } from '../utils/dateUtils';

function FixturesPage({ fixturesOverride }) {
  const [fixtures, setFixtures] = useState([]);

  // Used only to refresh countdown timers every minute
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (!fixturesOverride) {
      axios
        .get('/fixtures')
        .then((res) => setFixtures(res.data))
        .catch((err) => console.error(err));
    }
  }, [fixturesOverride]);

  // Refresh countdown every minute
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const data = fixturesOverride || fixtures;

  // Group fixtures by round
  const groupedByRound = data.reduce((acc, fixture) => {
    const round = fixture.round || 'UNASSIGNED';

    if (!acc[round]) acc[round] = [];

    acc[round].push(fixture);

    return acc;
  }, {});

  const sortedRounds = Object.keys(groupedByRound).sort((a, b) => {
    if (a === 'UNASSIGNED') return 1;
    if (b === 'UNASSIGNED') return -1;

    return Number(a) - Number(b);
  });

  const roundTitles = {
    1: 'Round 1',
    2: 'Round 2',
    3: 'Round 3',
    4: 'Round of 32',
    5: 'Round of 16',
    6: 'Quarter-Finals',
    7: 'Semi-Finals',
    8: 'Final',
  };

  // ------------------------
  // Helper Functions
  // ------------------------

  const getMatchDateTime = (fixture) => {
    return new Date(`${fixture.match_date}T${fixture.match_time}`);
  };

  const getCountdown = (fixture) => {
    const now = new Date();
    const kickoff = getMatchDateTime(fixture);

    const diff = kickoff - now;

    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    if (days > 0) {
      return `${days}d ${hours}h`;
    }

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }

    return `${mins}m`;
  };

  const isCompleted = (fixture) => {
    return fixture.status === 'Completed';
  };

  const isWinner = (fixture, side) => {
    if (!isCompleted(fixture)) return false;

    if (side === 'home') {
      return fixture.home_score > fixture.away_score;
    }

    return fixture.away_score > fixture.home_score;
  };

  const statusChip = (fixture) => {
    if (fixture.status === 'Completed') {
      return {
        label: 'FULL TIME',
        background: '#1b5e20',
        color: '#fff',
      };
    }

    if (fixture.status === 'Live') {
      return {
        label: 'LIVE',
        background: '#d32f2f',
        color: '#fff',
      };
    }

    return {
      label: `Kick-off ${getCountdown(fixture) ?? ''}`,
      background: '#f59e0b',
      color: '#fff',
    };
  };

  const formatScore = (fixture, side) => {
    if (fixture.status === 'Upcoming') {
      return '-';
    }

    if (side === 'home') {
      if (
        fixture.decided_by === 'penalties' &&
        fixture.penalty_home !== null
      ) {
        return `${fixture.home_score} (${fixture.penalty_home})`;
      }

      return fixture.home_score;
    }

    if (
      fixture.decided_by === 'penalties' &&
      fixture.penalty_away !== null
    ) {
      return `${fixture.away_score} (${fixture.penalty_away})`;
    }

    return fixture.away_score;
  };

    return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: 1120,
        mx: 'auto',

        backgroundImage: 'url(/images/background1.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',

        borderRadius: 4,

        '@keyframes pulse': {
          '0%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '50%': {
            transform: 'scale(1.08)',
            opacity: 0.75,
          },
          '100%': {
            transform: 'scale(1)',
            opacity: 1,
          },
        },
      }}
    >
      {sortedRounds.map((round) => (
        <Paper
          key={round}
          elevation={3}
          sx={{
            mb: 4,
            overflow: 'hidden',
            borderRadius: 5,
            background:
              'linear-gradient(180deg, rgba(255,255,255,.96) 0%, rgba(247,250,248,.96) 100%)',
          }}
        >
          {/* Round Header */}

          <Box
            sx={{
              py: 2,
              textAlign: 'center',
              background:
                'linear-gradient(135deg,#0f3d2e 0%,#1b5e20 100%)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontWeight: 900,
                letterSpacing: 1,
              }}
            >
              {round === 'UNASSIGNED'
                ? 'UNASSIGNED ROUND'
                : roundTitles[Number(round)]}
            </Typography>
          </Box>

          <Box
            sx={{
              p: {
                xs: 2,
                md: 3,
              },
            }}
          >
            <List
              disablePadding
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {groupedByRound[round]
                .sort((a, b) => {
                  const dateA = new Date(
                    `${a.match_date}T${a.match_time || '00:00'}`
                  );

                  const dateB = new Date(
                    `${b.match_date}T${b.match_time || '00:00'}`
                  );

                  return dateA - dateB;
                })
                .map((fixture) => {
                  const chip = statusChip(fixture);

                  return (
                    <ListItem
                      key={fixture.id}
                      sx={{
                        flexDirection: {
                          xs: 'column',
                          md: 'row',
                        },

                        alignItems: {
                          xs: 'stretch',
                          md: 'center',
                        },

                        width: '100%',

                        p: {
                          xs: 2.5,
                          md: 3,
                        },

                        mb: 1,

                        borderRadius: 4,

                        overflow: 'hidden',

                        background:
                          'linear-gradient(145deg, rgba(255,255,255,.98) 0%, rgba(236,247,241,.98) 100%)',

                        border: isCompleted(fixture)
                          ? '2px solid rgba(27,94,32,.35)'
                          : '1px solid rgba(217,251,232,.80)',

                        boxShadow: isCompleted(fixture)
                          ? '0 16px 34px rgba(27,94,32,.18)'
                          : '0 10px 26px rgba(15,23,42,.12)',

                        transition: '.25s',

                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow:
                            '0 22px 40px rgba(15,23,42,.18)',
                        },
                      }}
                    >
                      {/* Status Chip */}

                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={chip.label}
                          sx={{
                            background: chip.background,
                            color: chip.color,
                            fontWeight: 900,
                            letterSpacing: 1,
                            px: 1,

                            ...(fixture.status === 'Live'
                              ? {
                                  animation:
                                    'pulse 1.3s infinite',
                                }
                              : {}),
                          }}
                        />
                      </Box>
                                            {/* Match Details */}

                      <Box
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: {
                            xs: 'column',
                            md: 'row',
                          },
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 3,
                        }}
                      >

                        {/* Match Date */}

                        <Box
                          sx={{
                            minWidth: { xs: '100%', md: 120 },
                            textAlign: { xs: 'center', md: 'left' },
                          }}
                        >
                          <Typography
                            sx={{
                              fontWeight: 900,
                              color: '#12372a',
                              fontSize: '.95rem',
                            }}
                          >
                            {formatShortDate(fixture.match_date)}
                          </Typography>

                          <Typography
                            sx={{
                              color: '#5c7267',
                              fontSize: '.82rem',
                            }}
                          >
                            {formatShortTime(fixture.match_time)}
                          </Typography>
                        </Box>

                        {/* Match Centre */}

                        <Box
                          sx={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2,
                          }}
                        >

                          {/* Teams */}

                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >

                            {/* Home Team */}

                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                width: '42%',
                              }}
                            >
                              <Flag
                                code={fixture.home_flag}
                                style={{
                                  width: 34,
                                  height: 24,
                                  borderRadius: 3,
                                }}
                              />

                              <Typography
                                sx={{
  fontWeight: isWinner(fixture, 'home') ? 900 : 700,
  color: isWinner(fixture, 'home')
    ? '#1b5e20'
    : '#12372a',
  transition: '.25s',
}}
                              >
                                {fixture.home_team}
                              </Typography>

                              {isWinner(fixture, 'home') && (
                                <Typography
                                  sx={{
                                    color: '#1b5e20',
                                    fontWeight: 900,
                                  }}
                                >
                                  ✓
                                </Typography>
                              )}
                            </Box>

                            {/* Away Team */}

                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                alignItems: 'center',
                                gap: 1,
                                width: '42%',
                              }}
                            >
                              {isWinner(fixture, 'away') && (
                                <Typography
                                  sx={{
                                    color: '#1b5e20',
                                    fontWeight: 900,
                                  }}
                                >
                                  ✓
                                </Typography>
                              )}

                              <Typography
                                sx={{
  fontWeight: isWinner(fixture, 'away') ? 900 : 700,
  color: isWinner(fixture, 'away')
    ? '#1b5e20'
    : '#12372a',
  transition: '.25s',
}}
                              >
                                {fixture.away_team}
                              </Typography>

                              <Flag
                                code={fixture.away_flag}
                                style={{
                                  width: 34,
                                  height: 24,
                                  borderRadius: 3,
                                }}
                              />
                            </Box>

                          </Box>

                          {/* Score */}

                          <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    px: 3,
    py: 1.25,
    borderRadius: 3,
    background:
      fixture.status === 'Completed'
        ? 'linear-gradient(135deg,#0f3d2e,#1b5e20)'
        : 'linear-gradient(135deg,#607d8b,#78909c)',
    boxShadow:
      fixture.status === 'Completed'
        ? '0 10px 28px rgba(27,94,32,.35)'
        : '0 8px 20px rgba(96,125,139,.25)',
    minWidth: 190,
  }}
>

  <Typography
    sx={{
      color: '#fff',
      fontWeight: 900,
      fontSize: {
        xs: '2rem',
        md: '2.8rem',
      },
      minWidth: 45,
      textAlign: 'center',
    }}
  >
    {formatScore(fixture, 'home')}
  </Typography>

  <Typography
    sx={{
      color: 'rgba(255,255,255,.8)',
      fontSize: '2rem',
      fontWeight: 300,
    }}
  >
    —
  </Typography>

  <Typography
    sx={{
      color: '#fff',
      fontWeight: 900,
      fontSize: {
        xs: '2rem',
        md: '2.8rem',
      },
      minWidth: 45,
      textAlign: 'center',
    }}
  >
    {formatScore(fixture, 'away')}
  </Typography>

</Box>

                          </Box>

                        </Box>

                        {/* Venue & Result */}

<Box
  sx={{
    minWidth: { xs: '100%', md: 190 },
    textAlign: { xs: 'center', md: 'right' },
  }}
>
  {fixture.venue && (
    <Typography
      sx={{
        color: '#5c7267',
        fontWeight: 700,
        fontSize: '.82rem',
        mb: 1,
      }}
    >
      📍 {fixture.venue}
    </Typography>
  )}

  {fixture.status === 'Completed' &&
 Number(fixture.round) >= 4 &&
 Number(fixture.round) < 8 && (
  <Chip
    label={
      fixture.home_score > fixture.away_score
        ? `${fixture.home_team} Advances`
        : `${fixture.away_team} Advances`
    }
    size="small"
    sx={{
      background:
        'linear-gradient(135deg,#1b5e20,#2e7d32)',
      color: '#fff',
      fontWeight: 900,
      borderRadius: 4,
      boxShadow: '0 6px 18px rgba(27,94,32,.35)',
    }}
  />
)}

{fixture.status === 'Completed' &&
 Number(fixture.round) === 8 && (
  <Chip
    label="🏆 World Champions"
    size="small"
    sx={{
      background:
        'linear-gradient(135deg,#b8860b,#f5c542)',
      color: '#fff',
      fontWeight: 900,
      borderRadius: 4,
      boxShadow: '0 8px 24px rgba(184,134,11,.40)',
    }}
  />
)}
</Box>
                                          </ListItem>
                  );
                })}
            </List>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default FixturesPage;