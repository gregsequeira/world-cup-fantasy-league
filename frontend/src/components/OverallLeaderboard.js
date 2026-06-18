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
  Box
} from '@mui/material';
import Flag from 'react-world-flags';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import axios from '../axiosConfig';

const roleOrder = ['Favourite', 'Seeded', 'DarkHorse', 'Underdog'];

const getSelectionByRole = (selections = [], role) => {
  return selections.find(sel => sel.role === role);
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const OverallLeaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/user-scores/details')
      .then(res => {
        const verified = res.data
          .filter(u => u.verified)
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

  const maxPoints = scores.length > 0
    ? Math.max(...scores.map(user => toNumber(user.total_points)))
    : 0;

  const maxGD = scores.length > 0
    ? Math.max(
        ...scores
          .filter(user => toNumber(user.total_points) === maxPoints)
          .map(user => toNumber(user.total_goal_difference))
      )
    : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 6,
          border: '2px solid #00FFCC',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
          backdropFilter: 'blur(6px)',
          p: { xs: 1.5, md: 2 },
          mb: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              color: '#00FFCC',
              fontSize: { xs: '1.3rem', md: '1.8rem' }
            }}
          >
            Leaderboard
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress sx={{ color: '#00FFCC' }} />
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 980 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                      Rank
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                      User
                    </TableCell>

                    {roleOrder.map(role => (
                      <TableCell key={role} align="center" sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                        {role}
                      </TableCell>
                    ))}

                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                      Points
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                      GD
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {scores.map((user, index) => {
                    const userPoints = toNumber(user.total_points);
                    const userGD = toNumber(user.total_goal_difference);
                    const isLeader = userPoints === maxPoints && userGD === maxGD;

                    return (
                      <TableRow
                        key={user.user_id}
                        sx={{
                          backgroundColor: isLeader ? 'rgba(231, 198, 8, 0.45)' : 'inherit'
                        }}
                      >
                        <TableCell sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              minWidth: 34
                            }}
                          >
                            <span>{index + 1}</span>
                            {isLeader && (
                              <EmojiEventsIcon
                                sx={{
                                  fontSize: '1rem',
                                  color: '#facc15'
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                          {user.user_name}
                        </TableCell>

                        {roleOrder.map(role => {
                          const sel = getSelectionByRole(user.selections, role);

                          return (
                            <TableCell key={role} align="center" sx={{ color: '#fff', minWidth: 170 }}>
                              {sel ? (
                                <Box
                                  title={`${role}: ${sel.team_name} - ${sel.points} pts`}
                                  sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 0.6,
                                    px: { xs: 0.75, md: 1 },
                                    py: { xs: 0.4, md: 0.55 },
                                    borderRadius: 1.5,
                                    backgroundColor: 'rgba(255,255,255,0.08)',
                                    border: '1px solid rgba(0,255,204,0.22)',
                                    width: 160,
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {sel.flag_code && (
                                    <Flag
                                      code={sel.flag_code}
                                      style={{
                                        width: 28,
                                        height: 18,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        flexShrink: 0,
                                        boxShadow: '0 0 0 1px rgba(255,255,255,0.25)'
                                      }}
                                    />
                                  )}

                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: '#fff',
                                      fontSize: { xs: '0.62rem', md: '0.72rem' },
                                      fontWeight: 600,
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      whiteSpace: 'nowrap',
                                      minWidth: 0,
                                      flex: 1,
                                      textAlign: 'left'
                                    }}
                                  >
                                    {sel.team_name}
                                  </Typography>

                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: 'rgba(255,255,255,0.7)',
                                      fontSize: { xs: '0.62rem', md: '0.72rem' },
                                      flexShrink: 0
                                    }}
                                  >
                                    -
                                  </Typography>

                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: '#fff',
                                      fontWeight: 800,
                                      fontSize: { xs: '0.7rem', md: '0.82rem' },
                                      lineHeight: 1,
                                      flexShrink: 0
                                    }}
                                  >
                                    {sel.points}
                                  </Typography>
                                </Box>
                              ) : (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'rgba(255,255,255,0.45)',
                                    fontSize: { xs: '0.65rem', md: '0.75rem' }
                                  }}
                                >
                                  -
                                </Typography>
                              )}
                            </TableCell>
                          );
                        })}

                        <TableCell align="center" sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                          {userPoints}
                        </TableCell>

                        <TableCell align="center" sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                          {userGD}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OverallLeaderboard;