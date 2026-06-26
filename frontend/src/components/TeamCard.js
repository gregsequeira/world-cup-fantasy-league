import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip, Divider } from '@mui/material';
import Flag from 'react-world-flags';
import axios from '../axiosConfig';
import { formatDayMonth, formatShortTime } from '../utils/dateUtils';

export const TeamCard = ({ label, team }) => {
  const [fixtures, setFixtures] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!team?.id) return;

    axios.get(`/fixtures/team/${team.id}`)
  .then(res => {
    const groupStageFixtures = res.data.filter(
      fixture => Number(fixture.round) <= 3
    );

    setFixtures(groupStageFixtures);
  })
  .catch(() => setFixtures([]));

    setLoadingStats(true);
    axios.get(`/standings/${team.id}?maxRound=3`)
      .then(res => {
        const updatedStats = { ...res.data };

        if (label.toLowerCase().includes('favourite') || label.toLowerCase().includes('underdog')) {
          updatedStats.points = updatedStats.points * 2;
        }

        setStats(updatedStats);
      })
      .catch(() => setStats({ points: 0, goal_difference: 0, goals_for: 0, goals_against: 0 }))
      .finally(() => setLoadingStats(false));
  }, [team?.id, label]);

  const isBoosted = label.toLowerCase().includes('favourite') || label.toLowerCase().includes('underdog');

  const isFixtureCompleted = (fixture) => {
    const statusCompleted = String(fixture.status || '').trim().toLowerCase() === 'completed';
    const hasScores = fixture.home_score !== null && fixture.home_score !== undefined
      && fixture.away_score !== null && fixture.away_score !== undefined;

    return statusCompleted || hasScores;
  };

  const getFixtureDisplay = (fixture) => {
    if (isFixtureCompleted(fixture)) {
      return `${fixture.home_team} ${fixture.home_score} - ${fixture.away_score} ${fixture.away_team}`;
    }

    return `${fixture.home_team} vs ${fixture.away_team}`;
  };

  return (
    <Card
      elevation={0}
      sx={{
        width: '100%',
        minHeight: 430,
        borderRadius: 2,
        textAlign: 'center',
        overflow: 'hidden',
        position: 'relative',
        background: isBoosted
          ? 'linear-gradient(145deg, rgba(255,248,225,0.98) 0%, rgba(217,251,232,0.96) 60%, rgba(255,255,255,0.92) 100%)'
          : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(232,245,233,0.88) 56%, rgba(217,251,232,0.76) 100%)',
        border: isBoosted
          ? '1px solid rgba(245,158,11,0.62)'
          : '1px solid rgba(217,251,232,0.42)',
        boxShadow: '0 14px 32px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.58)',
      }}
    >
      <Box
        sx={{
          height: 54,
          background: isBoosted
            ? 'linear-gradient(135deg, #b45309 0%, #f59e0b 42%, #1b5e20 100%)'
            : 'linear-gradient(135deg, #0f3d2e 0%, #0f766e 46%, #1b5e20 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#fff',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: 0,
          }}
        >
          {label}
        </Typography>
      </Box>

      <CardContent
        sx={{
          px: 2,
          pt: 0,
          pb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            mt: -1.25,
            mb: 1.25,
            p: 0.55,
            borderRadius: 1.5,
            background: 'rgba(255,255,255,0.86)',
            boxShadow: '0 10px 22px rgba(15,23,42,0.18)',
            border: isBoosted
              ? '1px solid rgba(245,158,11,0.42)'
              : '1px solid rgba(27,94,32,0.16)',
          }}
        >
          {team.flag_code && (
            <Flag
              code={team.flag_code}
              style={{
                width: 72,
                height: 48,
                borderRadius: 4,
                display: 'block',
                objectFit: 'cover',
              }}
            />
          )}
        </Box>

        <Chip
          label={isBoosted ? 'Double Points' : 'Standard Points'}
          size="small"
          sx={{
            mb: 1,
            height: 22,
            borderRadius: 1.25,
            backgroundColor: isBoosted ? '#fff3cd' : '#d9fbe8',
            color: isBoosted ? '#8a5a00' : '#12372a',
            fontWeight: 900,
            fontSize: '0.68rem',
          }}
        />

        <Typography
          title={team.name}
          sx={{
            fontWeight: 950,
            color: '#12372a',
            mb: 0.75,
            fontSize: '1.05rem',
            lineHeight: 1.15,
            maxWidth: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {team.name}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 0.75,
            flexWrap: 'wrap',
            justifyContent: 'center',
            mb: 1.5,
          }}
        >
          {team.ranking && (
            <Chip
              label={`Rank ${team.ranking}`}
              size="small"
              sx={{
                borderRadius: 1.25,
                backgroundColor: 'rgba(15,118,110,0.10)',
                color: '#12372a',
                fontWeight: 850,
              }}
            />
          )}

          {team.group_name && (
            <Chip
              label={team.group_name}
              size="small"
              sx={{
                borderRadius: 1.25,
                backgroundColor: 'rgba(27,94,32,0.10)',
                color: '#12372a',
                fontWeight: 850,
              }}
            />
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0.75,
            width: '100%',
            mb: 2,
          }}
        >
          {loadingStats ? (
            <Chip
              label="Loading stats..."
              size="small"
              sx={{
                gridColumn: '1 / -1',
                borderRadius: 1.25,
                backgroundColor: 'rgba(15,118,110,0.10)',
                color: '#12372a',
                fontWeight: 850,
              }}
            />
          ) : (
            <>
              <Chip label={`Pts ${stats?.points ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(15,118,110,0.12)', color: '#12372a', fontWeight: 900 }} />
              <Chip label={`GD ${stats?.goal_difference ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(245,158,11,0.12)', color: '#6b3f00', fontWeight: 900 }} />
              <Chip label={`GF ${stats?.goals_for ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(27,94,32,0.10)', color: '#12372a', fontWeight: 850 }} />
              <Chip label={`GA ${stats?.goals_against ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(180,83,9,0.10)', color: '#6b3f00', fontWeight: 850 }} />
            </>
          )}
        </Box>

        <Divider sx={{ width: '100%', mb: 1.5, borderColor: 'rgba(27,94,32,0.16)' }} />

        <Typography
          variant="caption"
          sx={{
            mb: 1,
            color: '#0f3d2e',
            fontWeight: 900,
            textTransform: 'uppercase',
          }}
        >
          Fixtures
        </Typography>

        <Box
          sx={{
            width: '100%',
            display: 'grid',
            gap: 0.75,
          }}
        >
          {fixtures === null ? (
            <Typography variant="body2" sx={{ color: '#60756b', fontWeight: 700 }}>
              Loading fixtures...
            </Typography>
          ) : fixtures.length > 0 ? (
            fixtures.map(fixture => {
              const completed = isFixtureCompleted(fixture);

              return (
                <Box
                  key={fixture.id}
                  sx={{
                    p: 0.85,
                    borderRadius: 1.25,
                    background: completed
                      ? 'linear-gradient(135deg, rgba(217,251,232,0.72) 0%, rgba(255,243,205,0.44) 100%)'
                      : 'rgba(255,255,255,0.48)',
                    border: completed
                      ? '1px solid rgba(15,118,110,0.20)'
                      : '1px solid rgba(27,94,32,0.10)',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: 0.75,
                      flexWrap: 'wrap',
                      mb: 0.35,
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#375448',
                        fontWeight: 750,
                        fontSize: { xs: '0.74rem', md: '0.8rem' },
                        lineHeight: 1.25,
                      }}
                    >
                      {formatDayMonth(fixture.match_date)}
                    </Typography>

                    <Chip
                      label={completed ? 'FT' : formatShortTime(fixture.match_time)}
                      size="small"
                      sx={{
                        height: 20,
                        borderRadius: 1,
                        backgroundColor: completed ? '#d9fbe8' : '#fff3cd',
                        color: completed ? '#12372a' : '#8a5a00',
                        fontWeight: 900,
                        fontSize: '0.62rem',
                      }}
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: '#12372a',
                      fontWeight: 900,
                      fontSize: { xs: '0.76rem', md: '0.84rem' },
                      lineHeight: 1.25,
                    }}
                  >
                    {getFixtureDisplay(fixture)}
                  </Typography>
                </Box>
              );
            })
          ) : (
            <Typography variant="body2" sx={{ color: '#60756b', fontWeight: 700 }}>
              No fixtures found.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};