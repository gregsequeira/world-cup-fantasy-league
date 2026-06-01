import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Box } from '@mui/material';
import axios from '../axiosConfig';

const OverallLeaderboard = () => {
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

  return (
    <Box sx={{ p: 4 }}>
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 6,
          border: '2px solid #00FFCC',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // ✅ same blue gradient
          color: '#fff',
          backdropFilter: 'blur(6px)',
          p: 2,
          mb: 4, // ✅ spacing below
        }}
      >
        <CardContent>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#00FFCC' }}>
            Leaderboard
          </Typography>

          {loading ? (
            <CircularProgress sx={{ color: '#00FFCC' }} />
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC' }}>Rank</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC' }}>User</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC' }}>Points</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC' }}>GD</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scores.map((user, index) => (
                  <TableRow 
                    key={user.user_id}
                    sx={{
                      backgroundColor: index < 3 ? 'rgba(255,215,0,0.15)' : 'inherit' // ✅ highlight top 3
                    }}
                  >
                    <TableCell sx={{ color: '#fff' }}>{index + 1}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{user.user_name}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff' }}>{user.total_points}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff' }}>{user.total_goal_difference}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OverallLeaderboard;
