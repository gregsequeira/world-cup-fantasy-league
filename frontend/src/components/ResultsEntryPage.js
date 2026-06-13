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
  const [editingFixtures, setEditingFixtures] = useState({});

  useEffect(() => {
    axios.get('/fixtures')
      .then(res => {
        setFixtures(res.data);

        const initialScores = {};
        res.data.forEach(fixture => {
          initialScores[fixture.id] = {
            home_score: fixture.home_score ?? '',
            away_score: fixture.away_score ?? ''
          };
        });

        setScoreInputs(initialScores);
      })
      .catch(err => console.error(err));
  }, []);

  const isFixtureCompleted = (fixture) => {
    const statusCompleted = String(fixture.status || '').trim().toLowerCase() === 'completed';
    const hasResult = fixture.home_score !== null && fixture.home_score !== undefined
      && fixture.away_score !== null && fixture.away_score !== undefined;

    return statusCompleted || hasResult;
  };

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

  const handleEdit = (fixture) => {
    setEditingFixtures(prev => ({
      ...prev,
      [fixture.id]: true
    }));

    setScoreInputs(prev => ({
      ...prev,
      [fixture.id]: {
        home_score: fixture.home_score ?? '',
        away_score: fixture.away_score ?? ''
      }
    }));
  };

  const handleSubmit = (fixtureId) => {
    const scores = scoreInputs[fixtureId] || {};
    const homeScore = parseInt(scores.home_score, 10);
    const awayScore = parseInt(scores.away_score, 10);

    if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) {
      alert('Please enter both scores before submitting.');
      return;
    }

    axios.put(`/fixtures/${fixtureId}/result`, {
      home_score: homeScore,
      away_score: awayScore,
      status: 'Completed'
    })
      .then(res => {
        setFixtures(prev =>
          prev.map(f =>
            f.id === fixtureId
              ? { ...f, ...res.data, status: 'Completed' }
              : f
          )
        );

        setScoreInputs(prev => ({
          ...prev,
          [fixtureId]: {
            home_score: homeScore,
            away_score: awayScore
          }
        }));

        setEditingFixtures(prev => ({
          ...prev,
          [fixtureId]: false
        }));
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
    <Box sx={{ p: { xs: 1.5, md: 3 }, maxWidth: 1040, mx: 'auto' }}>
      {sortedRounds.map(round => (
        <Paper key={round} elevation={2} sx={{ mb: 4, borderRadius: 4, overflow: 'hidden' }}>
          <Box sx={{ py: 1.5, background: '#d9f5df', textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {round === 'UNASSIGNED' ? 'UNASSIGNED ROUND' : `ROUND ${round}`}
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 1.5, md: 3 } }}>
            <List disablePadding sx={{ width: '100%' }}>
              {groupedByRound[round]
                .sort((a, b) => getFixtureDateTime(a) - getFixtureDateTime(b))
                .map(fixture => {
                  const isCompleted = isFixtureCompleted(fixture);
                  const isEditing = Boolean(editingFixtures[fixture.id]);
                  const showInputs = !isCompleted || isEditing;
                  const scores = scoreInputs[fixture.id] || {};

                  return (
                    <ListItem
                      key={fixture.id}
                      sx={{
                        mb: 2,
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        borderRadius: 2,
                        background: isCompleted
                          ? 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 50%, #81c784 100%)'
                          : 'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
                        color: isCompleted ? '#1b5e20' : 'inherit',
                        boxShadow: isCompleted ? '0 0 10px rgba(27,94,32,0.4)' : 'none',
                        transition: 'background 0.3s ease',
                        px: { xs: 1.25, md: 2 },
                        py: { xs: 1.5, md: 2 }
                      }}
                    >
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr auto',
                            md: '110px minmax(250px, 1fr) 44px minmax(250px, 1fr) 70px'
                          },
                          gridTemplateAreas: {
                            xs: `
                              "date time"
                              "home home"
                              "vs vs"
                              "away away"
                            `,
                            md: '"date home vs away time"'
                          },
                          alignItems: 'center',
                          gap: { xs: 1, md: 2 },
                          width: '100%'
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            gridArea: 'date',
                            fontWeight: 700,
                            minWidth: { md: 110 },
                            fontSize: { xs: '0.8rem', md: '0.875rem' }
                          }}
                        >
                          {formatShortDate(fixture.match_date)}
                        </Typography>

                        <Box
                          sx={{
                            gridArea: 'home',
                            display: 'grid',
                            gridTemplateColumns: '30px minmax(0, 1fr) 58px',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%'
                          }}
                        >
                          <Flag code={fixture.home_flag} style={{ width: 26, height: 16 }} />

                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              textAlign: { xs: 'left', md: 'right' },
                              fontSize: { xs: '0.9rem', md: '1rem' }
                            }}
                          >
                            {fixture.home_team}
                          </Typography>

                          {showInputs ? (
                            <TextField
                              type="number"
                              size="small"
                              sx={{ width: 54, justifySelf: 'center' }}
                              value={scores.home_score ?? ''}
                              onChange={(e) => handleScoreChange(fixture.id, 'home_score', e.target.value)}
                            />
                          ) : (
                            <Box sx={{ width: 54, textAlign: 'center', fontWeight: 800 }}>
                              {fixture.home_score}
                            </Box>
                          )}
                        </Box>

                        <Typography
                          variant="subtitle2"
                          sx={{
                            gridArea: 'vs',
                            fontWeight: 900,
                            textAlign: 'center',
                            justifySelf: 'center',
                            color: isCompleted ? '#1b5e20' : '#1f2937'
                          }}
                        >
                          vs
                        </Typography>

                        <Box
                          sx={{
                            gridArea: 'away',
                            display: 'grid',
                            gridTemplateColumns: '58px minmax(0, 1fr) 30px',
                            alignItems: 'center',
                            gap: 1,
                            width: '100%'
                          }}
                        >
                          {showInputs ? (
                            <TextField
                              type="number"
                              size="small"
                              sx={{ width: 54, justifySelf: 'center' }}
                              value={scores.away_score ?? ''}
                              onChange={(e) => handleScoreChange(fixture.id, 'away_score', e.target.value)}
                            />
                          ) : (
                            <Box sx={{ width: 54, textAlign: 'center', fontWeight: 800 }}>
                              {fixture.away_score}
                            </Box>
                          )}

                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              textAlign: 'left',
                              fontSize: { xs: '0.9rem', md: '1rem' }
                            }}
                          >
                            {fixture.away_team}
                          </Typography>

                          <Flag code={fixture.away_flag} style={{ width: 26, height: 16 }} />
                        </Box>

                        <Typography
                          variant="body2"
                          sx={{
                            gridArea: 'time',
                            fontWeight: 700,
                            minWidth: { md: 70 },
                            textAlign: 'right',
                            fontSize: { xs: '0.8rem', md: '0.875rem' }
                          }}
                        >
                          {isCompleted ? 'FT' : formatShortTime(fixture.match_time)}
                        </Typography>
                      </Box>

                      {fixture.venue && (
                        <Typography color="text.secondary" sx={{ mt: 1, fontSize: { xs: '0.72rem', md: '0.75rem' } }}>
                          {fixture.venue}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1, mt: 1 }}>
                        {isCompleted && !isEditing && (
                          <>
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleEdit(fixture)}
                              sx={{
                                minHeight: 24,
                                height: 24,
                                px: 1.25,
                                py: 0,
                                borderRadius: 999,
                                textTransform: 'none',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                lineHeight: 1,
                                color: '#0f3557',
                                backgroundColor: '#b9ddff',
                                boxShadow: 'none',
                                '&:hover': {
                                  backgroundColor: '#9cccff',
                                  boxShadow: 'none'
                                }
                              }}
                            >
                              Edit Result
                            </Button>

                            <Chip
                              label="Completed"
                              color="success"
                              size="small"
                              sx={{
                                height: 24,
                                fontWeight: 700
                              }}
                            />
                          </>
                        )}

                        {showInputs && (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSubmit(fixture.id)}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 700
                            }}
                          >
                            Submit Result
                          </Button>
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

export default ResultsEntryPage;