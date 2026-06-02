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
import axios from '../axiosConfig';

const OverallLeaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/user-scores')
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
              <Table size="small" sx={{ minWidth: 400 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>Rank</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>User</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>Points</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>GD</TableCell>
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
                      <TableCell sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>{index + 1}</TableCell>
                      <TableCell sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>{user.user_name}</TableCell>
                      <TableCell align="center" sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>{user.total_points}</TableCell>
                      <TableCell align="center" sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>{user.total_goal_difference}</TableCell>
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
