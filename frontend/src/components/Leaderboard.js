import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import axios from '../axiosConfig';

const Leaderboard = ({ currentUserId }) => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/user-scores')
      .then(res => setScores(res.data))
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Slice logic: show current user + 6 nearby
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
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', // ✅ same blue gradient as Overall Score
        color: '#fff',
        backdropFilter: 'blur(6px)',
        p: 2,
        height: '100%',   // ✅ aligns vertically with Overall Score
        mb: 3,            // ✅ adds spacing below so it’s not too close to team cards
      }}
    >
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#00FFCC' }}>
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
                <TableCell align="center" sx={{ fontWeight: 'bold', color: '#00FFCC' }}>Goal Difference</TableCell>
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
                    <TableCell sx={{ color: '#fff' }}>{actualRank}</TableCell>
                    <TableCell sx={{ color: '#fff' }}>{user.user_name}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff' }}>{user.total_points}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff' }}>{user.total_goal_difference}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
