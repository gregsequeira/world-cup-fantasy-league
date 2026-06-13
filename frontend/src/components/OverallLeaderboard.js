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
import axios from '../axiosConfig';

const OverallLeaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/user-scores/details')
      .then(res => {
        const verified = res.data.filter(u => u.verified);
        setScores(verified);
      })
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, []);

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
              <Table size="small" sx={{ minWidth: 620 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                      Rank
                    </TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                      User
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                      Teams & Points
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                      Points
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                      GD
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {scores.map((user, index) => (
                    <TableRow
                      key={user.user_id}
                      sx={{
                        backgroundColor: index < 3 ? 'rgba(255,215,0,0.15)' : 'inherit'
                      }}
                    >
                      <TableCell sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                        {index + 1}
                      </TableCell>

                      <TableCell sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                        {user.user_name}
                      </TableCell>

                      <TableCell align="center" sx={{ color: '#fff', minWidth: 220 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: { xs: 0.75, md: 1 },
                            py: 0.5
                          }}
                        >
                          {user.selections?.map(sel => (
                            <Box
                              key={`${sel.role}-${sel.team_id}`}
                              title={`${sel.team_name}: ${sel.points} pts`}
                              sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 0.75,
                                px: { xs: 0.75, md: 1 },
                                py: { xs: 0.4, md: 0.55 },
                                borderRadius: 1.5,
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(0,255,204,0.22)',
                                minWidth: { xs: 54, md: 64 },
                                justifyContent: 'center'
                              }}
                            >
                              {sel.flag_code && (
                                <Flag
                                  code={sel.flag_code}
                                  style={{
                                    width: 30,
                                    height: 20,
                                    objectFit: 'cover',
                                    borderRadius: 2,
                                    boxShadow: '0 0 0 1px rgba(255,255,255,0.25)'
                                  }}
                                />
                              )}
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#fff',
                                  fontWeight: 700,
                                  fontSize: { xs: '0.72rem', md: '0.82rem' },
                                  lineHeight: 1
                                }}
                              >
                                {sel.points}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </TableCell>

                      <TableCell align="center" sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                        {user.total_points}
                      </TableCell>

                      <TableCell align="center" sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>
                        {user.total_goal_difference}
                      </TableCell>
                    </TableRow>
                  ))}
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