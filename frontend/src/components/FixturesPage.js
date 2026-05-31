import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, List, ListItem, Paper } from '@mui/material';
import Flag from 'react-world-flags';
import { formatShortDate, formatShortTime } from '../utils/dateUtils';

function FixturesPage() {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/fixtures')
      .then(res => setFixtures(res.data))
      .catch(err => console.error(err));
  }, []);

  // Group fixtures by round
  const groupedByRound = fixtures.reduce((acc, fixture) => {
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
    <Box sx={{ p: 3, maxWidth: 1040, mx: 'auto', backgroundImage: 'url(/images/background1.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover' }}>
      {sortedRounds.map(round => (
        <Paper key={round} elevation={2} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.15)' }}>
          <Box sx={{ py: 1.5, background: '#d9f5df', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1.2, color: '#1b5e20' }}>
              {round === 'UNASSIGNED' ? 'UNASSIGNED ROUND' : `ROUND ${round}`}
            </Typography>
          </Box>
          <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
            <List disablePadding sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
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
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 3,
                      width: '100%',
                      maxWidth: 860,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
                    }}
                  >
                    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                      {/* Date on left */}
                      <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 110 }}>
                        {formatShortDate(fixture.match_date)}
                      </Typography>

                      {/* Home side with score block */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-end' }}>
                        <Flag code={fixture.home_flag} style={{ width: 26, height: 16, borderRadius: 2, border: '1px solid rgba(0,0,0,0.12)' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {fixture.home_team}
                        </Typography>
                        <Box sx={{ width: 40, height: 40, border: '2px solid #7FC8A9', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', ml: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#7FC8A9' }}>-</Typography>
                        </Box>
                      </Box>

                      {/* vs centered */}
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, px: 2 }}>
                        vs
                      </Typography>

                      {/* Away side with score block */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, justifyContent: 'flex-start' }}>
                        <Box sx={{ width: 40, height: 40, border: '2px solid #7FC8A9', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#7FC8A9' }}>-</Typography>
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {fixture.away_team}
                        </Typography>
                        <Flag code={fixture.away_flag} style={{ width: 26, height: 16, borderRadius: 2, border: '1px solid rgba(0,0,0,0.12)' }} />
                      </Box>

                      {/* Time on right */}
                      <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 70, textAlign: 'right' }}>
                        {formatShortTime(fixture.match_time)}
                      </Typography>
                    </Box>
                    {fixture.venue && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
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
