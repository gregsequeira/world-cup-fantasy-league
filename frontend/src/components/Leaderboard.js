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

const Leaderboard = ({ currentUserId }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/user-scores')
      .then(res => {
        // ✅ Only include verified users
        const verified = res.data.filter(u => u.verified);
        setScores(verified);
      })
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, []);

  const currentIndex = scores.findIndex(u => u.user_id === currentUserId);

  let start = Math.max(0, currentIndex - 3);
  let end = Math.min(scores.length, currentIndex + 4);

  if (currentIndex <= 0) {
    start = 0;
    end = Math.min(scores.length, 7);
  } else if (currentIndex >= scores.length - 3) {
    start = Math.max(0, scores.length - 7);
    end = scores.length;
  }

  const visibleScores = scores.slice(start, end);

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 6,
        border: '2px solid #00FFCC',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#fff',
        backdropFilter: 'blur(6px)',
        p: { xs: 1.5, md: 2 },
        height: '100%',
        mb: 3,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            color: '#00FFCC',
            fontSize: { xs: '1.2rem', md: '1.5rem' }
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
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>Goal Difference</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleScores.map((user) => {
                  const actualRank = scores.findIndex(u => u.user_id === user.user_id) + 1;
                  return (
                    <TableRow
                      key={user.user_id}
                      sx={{
                        backgroundColor: user.user_id === currentUserId ? 'rgba(0,255,204,0.15)' : 'inherit'
                      }}
                    >
                      <TableCell sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>{actualRank}</TableCell>
                      <TableCell sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>{user.user_name}</TableCell>
                      <TableCell align="center" sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>{user.total_points}</TableCell>
                      <TableCell align="center" sx={{ color: '#fff', fontSize: { xs: '0.75rem', md: '0.85rem' } }}>{user.total_goal_difference}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
