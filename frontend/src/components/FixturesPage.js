import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Box, Typography, List, ListItem, Paper } from '@mui/material';
import Flag from 'react-world-flags';
import { formatShortDate, formatShortTime } from '../utils/dateUtils';

function FixturesPage({ fixturesOverride }) {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    if (!fixturesOverride) {
      axios.get('/fixtures')
        .then(res => setFixtures(res.data))
        .catch(err => console.error(err));
    }
  }, [fixturesOverride]);

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

    return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: 1040,
        mx: 'auto',
        backgroundImage: 'url(/images/background1.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      {sortedRounds.map(round => (
        <Paper
          key={round}
          elevation={2}
          sx={{
            mb: 4,
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.15)'
          }}
        >
          <Box sx={{ py: 1.5, background: '#d9f5df', textAlign: 'center' }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: 1.2,
                color: '#1b5e20',
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              {round === 'UNASSIGNED' ? 'UNASSIGNED ROUND' : `ROUND ${round}`}
            </Typography>
          </Box>
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <List
              disablePadding
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                gap: 1
              }}
            >
              {groupedByRound[round]
                .sort((a, b) => {
                  const dateA = new Date(`${a.match_date}T${a.match_time || '00:00'}`);
                  const dateB = new Date(`${b.match_date}T${b.match_time || '00:00'}`);
                  return dateA - dateB;
                })
                .map(fixture => (
                  <ListItem
                    key={fixture.id}
                    sx={{
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      p: { xs: 2, md: 3 },
                      width: '100%',
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
                      gap: { xs: 1.5, sm: 2 }
                    }}
                  >
                    {/* Date */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        minWidth: { xs: 'auto', sm: 110 },
                        fontSize: { xs: '0.85rem', md: '0.95rem' }
                      }}
                    >
                      {formatShortDate(fixture.match_date)}
                    </Typography>

                    {/* Home side */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flex: 1,
                        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                        flexWrap: 'wrap'
                      }}
                    >
                      <Flag
                        code={fixture.home_flag}
                        style={{
                          width: 24,
                          height: 16,
                          borderRadius: 2,
                          border: '1px solid rgba(0,0,0,0.12)'
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '0.9rem', md: '1rem' }
                        }}
                      >
                        {fixture.home_team}
                      </Typography>
                      <Box
                        sx={{
                          width: { xs: 32, md: 40 },
                          height: { xs: 32, md: 40 },
                          border: '2px solid #7FC8A9',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          ml: 1
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800, color: '#000000' }}
                        >
                          {fixture.status === "Upcoming" ? "-" : fixture.home_score}
                        </Typography>
                      </Box>
                    </Box>

                    {/* vs */}
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 800,
                        px: 2,
                        fontSize: { xs: '0.85rem', md: '0.95rem' }
                      }}
                    >
                      vs
                    </Typography>

                    {/* Away side */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flex: 1,
                        justifyContent: { xs: 'flex-start', sm: 'flex-start' },
                        flexWrap: 'wrap'
                      }}
                    >
                      <Box
                        sx={{
                          width: { xs: 32, md: 40 },
                          height: { xs: 32, md: 40 },
                          border: '2px solid #7FC8A9',
                          borderRadius: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 1
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800, color: '#000000' }}
                        >
                          {fixture.status === "Upcoming" ? "-" : fixture.away_score}
                        </Typography>
                      </Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 700,
                          whiteSpace: 'nowrap',
                          fontSize: { xs: '0.9rem', md: '1rem' }
                        }}
                      >
                        {fixture.away_team}
                      </Typography>
                      <Flag
                        code={fixture.away_flag}
                        style={{
                          width: 24,
                          height: 16,
                          borderRadius: 2,
                          border: '1px solid rgba(0,0,0,0.12)'
                        }}
                      />
                    </Box>

                    {/* Time */}
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        minWidth: { xs: 'auto', sm: 70 },
                        textAlign: 'right',
                        fontSize: { xs: '0.85rem', md: '0.95rem' }
                      }}
                    >
                      {formatShortTime(fixture.match_time)}
                    </Typography>

                    {/* Venue */}
                    {fixture.venue && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: { xs: 1, sm: 0 } }}
                      >
                        {fixture.venue}
                      </Typography>
                    )}
                  </ListItem>
                ))}
            </List>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}

export default FixturesPage;
