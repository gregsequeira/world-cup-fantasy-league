import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import axios from '../axiosConfig';

const toNumber = (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const Leaderboard = ({ currentUserId }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/user-scores')
      .then(res => {
        const verified = res.data
          .filter(user => user.verified)
          .sort((a, b) => {
            const pointsDiff = toNumber(b.total_points) - toNumber(a.total_points);
            if (pointsDiff !== 0) return pointsDiff;

            return toNumber(b.total_goal_difference) - toNumber(a.total_goal_difference);
          });

        setScores(verified);
      })
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, []);

  const currentIndex = scores.findIndex(user => String(user.user_id) === String(currentUserId));

  let start = 0;
  let end = Math.min(scores.length, 7);

  if (currentIndex > -1) {
    start = Math.max(0, currentIndex - 3);
    end = Math.min(scores.length, currentIndex + 4);

    if (currentIndex <= 0) {
      start = 0;
      end = Math.min(scores.length, 7);
    } else if (currentIndex >= scores.length - 3) {
      start = Math.max(0, scores.length - 7);
      end = scores.length;
    }
  }

  const visibleScores = scores.slice(start, end);

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, rgba(15,61,46,0.94) 0%, rgba(27,94,32,0.66) 48%, rgba(245,158,11,0.24) 100%)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: '0 18px 50px rgba(15,23,42,0.16)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.25,
          background: 'rgba(7,38,28,0.72)',
          borderBottom: '1px solid rgba(255,255,255,0.14)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#d9fbe8',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: 0,
          }}
        >
          Leaderboard
        </Typography>

        <Chip
          label="Nearby Ranks"
          size="small"
          sx={{
            height: 22,
            borderRadius: 1.25,
            backgroundColor: '#fff3cd',
            color: '#8a5a00',
            fontWeight: 900,
            fontSize: '0.68rem',
          }}
        />
      </Box>

      <CardContent sx={{ p: { xs: 1.25, md: 2 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#fff7d6' }} />
          </Box>
        ) : (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small" sx={{ minWidth: 430 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                    Rank
                  </TableCell>
                  <TableCell sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                    User
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                    Points
                  </TableCell>
                  <TableCell align="center" sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                    GD
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {visibleScores.map(user => {
                  const isCurrentUser = String(user.user_id) === String(currentUserId);
                  const actualRank = scores.findIndex(score => String(score.user_id) === String(user.user_id)) + 1;

                  return (
                    <TableRow
                      key={user.user_id}
                      sx={{
                        backgroundColor: isCurrentUser ? 'rgba(255,243,205,0.22)' : 'transparent',
                        '& td': {
                          borderColor: 'rgba(255,255,255,0.10)',
                        },
                      }}
                    >
                      <TableCell sx={{ color: '#fff', fontWeight: isCurrentUser ? 900 : 700, fontSize: { xs: '0.74rem', md: '0.84rem' } }}>
                        {actualRank}
                      </TableCell>

                      <TableCell sx={{ color: '#fff', fontWeight: isCurrentUser ? 900 : 700, fontSize: { xs: '0.74rem', md: '0.84rem' } }}>
                        {user.user_name}
                        {isCurrentUser && (
                          <Chip
                            label="You"
                            size="small"
                            sx={{
                              ml: 1,
                              height: 20,
                              borderRadius: 1.25,
                              backgroundColor: '#d9fbe8',
                              color: '#12372a',
                              fontWeight: 900,
                              fontSize: '0.64rem',
                            }}
                          />
                        )}
                      </TableCell>

                      <TableCell align="center" sx={{ color: '#fff7d6', fontWeight: 900, fontSize: { xs: '0.74rem', md: '0.84rem' } }}>
                        {toNumber(user.total_points)}
                      </TableCell>

                      <TableCell align="center" sx={{ color: '#fff', fontWeight: 800, fontSize: { xs: '0.74rem', md: '0.84rem' } }}>
                        {toNumber(user.total_goal_difference)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {visibleScores.length === 0 && (
              <Box
                sx={{
                  p: 2,
                  mt: 1,
                  borderRadius: 1.5,
                  background: 'rgba(255,255,255,0.10)',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontWeight: 800 }}>
                  No leaderboard entries yet.
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;