import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';

import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
} from '@mui/material';

import Flag from 'react-world-flags';

function KnockoutResultsPage() {
  const [fixtures, setFixtures] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadFixtures = async () => {
    try {
      const res = await axios.get('/fixtures');

      const knockoutFixtures = res.data.filter(
        fixture =>
          ['4', '5', '6', '7', '8'].includes(
            String(fixture.round)
          )
      );

      setFixtures(knockoutFixtures);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadFixtures();
  }, []);

  const updateFixture = (id, field, value) => {
    setFixtures(prev =>
      prev.map(fixture =>
        fixture.id === id
          ? {
              ...fixture,
              [field]: value,
            }
          : fixture
      )
    );
  };

  const saveResult = async fixture => {
    try {
      setSaving(true);

      await axios.put(
        `/fixtures/${fixture.id}/result`,
        {
          home_score:
            fixture.home_score === ''
              ? null
              : Number(fixture.home_score),

          away_score:
            fixture.away_score === ''
              ? null
              : Number(fixture.away_score),

          penalty_home:
            fixture.penalty_home === ''
              ? null
              : Number(fixture.penalty_home),

          penalty_away:
            fixture.penalty_away === ''
              ? null
              : Number(fixture.penalty_away),

          status: fixture.status,
        }
      );

      setMessage(
        `Match ${fixture.id} saved successfully`
      );

      await loadFixtures();
    } catch (err) {
      console.error(err);
      setMessage('Error saving result');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: 900,
        }}
      >
        Knockout Results
      </Typography>

      {message && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      )}

      <Grid container spacing={2}>
        {fixtures.map(fixture => {
          const homeName =
            fixture.home_team ||
            fixture.home_placeholder;

          const awayName =
            fixture.away_team ||
            fixture.away_placeholder;

          const tied =
            Number(fixture.home_score) ===
              Number(fixture.away_score) &&
            fixture.home_score !== null &&
            fixture.away_score !== null;

          return (
            <Grid
              item
              xs={12}
              md={6}
              key={fixture.id}
            >
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    mb: 2,
                    fontWeight: 800,
                  }}
                >
                  Match {fixture.id}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    gap: 1,
                  }}
                >
                  {fixture.home_flag && (
                    <Flag
                      code={fixture.home_flag}
                      style={{
                        width: 24,
                      }}
                    />
                  )}

                  <Typography>
                    {homeName}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 2,
                    gap: 1,
                  }}
                >
                  {fixture.away_flag && (
                    <Flag
                      code={fixture.away_flag}
                      style={{
                        width: 24,
                      }}
                    />
                  )}

                  <Typography>
                    {awayName}
                  </Typography>
                </Box>

                <Grid
                  container
                  spacing={2}
                >
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Home Score"
                      type="number"
                      value={
                        fixture.home_score ?? ''
                      }
                      onChange={e =>
                        updateFixture(
                          fixture.id,
                          'home_score',
                          e.target.value
                        )
                      }
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Away Score"
                      type="number"
                      value={
                        fixture.away_score ?? ''
                      }
                      onChange={e =>
                        updateFixture(
                          fixture.id,
                          'away_score',
                          e.target.value
                        )
                      }
                    />
                  </Grid>

                  {tied && (
                    <>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Home Pens"
                          type="number"
                          value={
                            fixture.penalty_home ??
                            ''
                          }
                          onChange={e =>
                            updateFixture(
                              fixture.id,
                              'penalty_home',
                              e.target.value
                            )
                          }
                        />
                      </Grid>

                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Away Pens"
                          type="number"
                          value={
                            fixture.penalty_away ??
                            ''
                          }
                          onChange={e =>
                            updateFixture(
                              fixture.id,
                              'penalty_away',
                              e.target.value
                            )
                          }
                        />
                      </Grid>
                    </>
                  )}

                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      value={
                        fixture.status ||
                        'Upcoming'
                      }
                      onChange={e =>
                        updateFixture(
                          fixture.id,
                          'status',
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="Upcoming">
                        Upcoming
                      </MenuItem>

                      <MenuItem value="Completed">
                        Completed
                      </MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={saving}
                      onClick={() =>
                        saveResult(fixture)
                      }
                    >
                      Save Result
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default KnockoutResultsPage;