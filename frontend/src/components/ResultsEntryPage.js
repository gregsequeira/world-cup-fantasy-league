import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import {
  Box,
  Typography,
  List,
  ListItem,
  Paper,
  TextField,
  Button,
  Chip
} from '@mui/material';
import Flag from 'react-world-flags';
import { formatShortDate, formatShortTime } from '../utils/dateUtils';

function ResultsEntryPage() {
  const [fixtures, setFixtures] = useState([]);
  const [scoreInputs, setScoreInputs] = useState({});

  useEffect(() => {
    axios.get('/fixtures')
      .then(res => setFixtures(res.data))
      .catch(err => console.error(err));
  }, []);

  const getFixtureDateTime = (fixture) => {
    const datePart = fixture.match_date?.split('T')[0];
    const timePart = fixture.match_time || '00:00:00';

    return new Date(`${datePart}T${timePart}`);
  };

  const handleScoreChange = (fixtureId, field, value) => {
    setScoreInputs(prev => ({
      ...prev,
      [fixtureId]: {
        ...prev[fixtureId],
        [field]: value
      }
    }));
  };

  const handleSubmit = (fixtureId) => {
    const scores = scoreInputs[fixtureId] || {};

    axios.put(`/fixtures/${fixtureId}/result`, {
      home_score: parseInt(scores.home_score, 10),
      away_score: parseInt(scores.away_score, 10),
      status: 'Completed'
    })
      .then(res => {
        setFixtures(prev =>
          prev.map(f => (f.id === fixtureId ? res.data : f))
        );
      })
      .catch(err => console.error(err));
  };

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
    <Box sx={{ p: 3, maxWidth: 1040, mx: 'auto' }}>
      {sortedRounds.map(round => (
        <Paper key={round} elevation={2} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ py: 1.5, background: '#d9f5df', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {round === 'UNASSIGNED' ? 'UNASSIGNED ROUND' : `ROUND ${round}`}
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <List disablePadding sx={{ width: '100%' }}>
              {groupedByRound[round]
                .sort((a, b) => getFixtureDateTime(a) - getFixtureDateTime(b))
                .map(fixture => {
                  const fixtureDateTime = getFixtureDateTime(fixture);
                  const now = new Date();
                  const canSubmit = now >= fixtureDateTime;
                  const scores = scoreInputs[fixture.id] || {};
                  const hasScores = scores.home_score !== undefined && scores.away_score !== undefined;

                  return (
                    <ListItem
                      key={fixture.id}
                      sx={{
                        mb: 2,
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        borderRadius: 2,
                        background: fixture.status === 'Completed'
                          ? 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 50%, #81c784 100%)'
                          : 'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
                        color: fixture.status === 'Completed' ? '#1b5e20' : 'inherit',
                        boxShadow: fixture.status === 'Completed' ? '0 0 10px rgba(27,94,32,0.4)' : 'none',
                        transition: 'background 0.3s ease',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 110 }}>
                          {formatShortDate(fixture.match_date)}
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Flag code={fixture.home_flag} style={{ width: 26, height: 16 }} />
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {fixture.home_team}
                          </Typography>

                          {fixture.status === 'Completed' ? (
                            <Box sx={{ width: 40, textAlign: 'center', fontWeight: 800 }}>
                              {fixture.home_score}
                            </Box>
                          ) : (
                            <TextField
                              type="number"
                              size="small"
                              sx={{ width: 50 }}
                              value={scores.home_score || ''}
                              onChange={(e) => handleScoreChange(fixture.id, 'home_score', e.target.value)}
                            />
                          )}
                        </Box>

                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                          vs
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {fixture.status === 'Completed' ? (
                            <Box sx={{ width: 40, textAlign: 'center', fontWeight: 800 }}>
                              {fixture.away_score}
                            </Box>
                          ) : (
                            <TextField
                              type="number"
                              size="small"
                              sx={{ width: 50 }}
                              value={scores.away_score || ''}
                              onChange={(e) => handleScoreChange(fixture.id, 'away_score', e.target.value)}
                            />
                          )}

                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {fixture.away_team}
                          </Typography>
                          <Flag code={fixture.away_flag} style={{ width: 26, height: 16 }} />
                        </Box>

                        <Typography variant="body2" sx={{ fontWeight: 700, minWidth: 70, textAlign: 'right' }}>
                          {fixture.status === 'Completed' ? 'FT' : formatShortTime(fixture.match_time)}
                        </Typography>
                      </Box>

                      {fixture.venue && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          {fixture.venue}
                        </Typography>
                      )}

                      {fixture.status === 'Completed' && (
                        <Chip
                          label="Completed"
                          color="success"
                          size="small"
                          sx={{ mt: 1, alignSelf: 'flex-end' }}
                        />
                      )}

                      {fixture.status !== 'Completed' && (
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{ mt: 1, alignSelf: 'flex-end' }}
                          disabled={!canSubmit || !hasScores}
                          onClick={() => handleSubmit(fixture.id)}
                        >
                          Submit Result
                        </Button>
                      )}
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

export default ResultsEntryPage;