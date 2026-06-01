// src/components/UserScoreCard.js
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress } from '@mui/material';
import axios from '../axiosConfig';

const UserScoreCard = ({ userId }) => {
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    axios.get(`/user-scores/${userId}`)
      .then(res => setScore(res.data))
      .catch(() => setScore({ total_points: 0, total_goal_difference: 0 }))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 400,
        mx: 'auto',
        mb: 3,
        boxShadow: 6,
        borderRadius: 4,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#fff',
        border: '2px solid #00FFCC',
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#00FFCC' }}>
          Overall Score
        </Typography>
        {loading ? (
          <CircularProgress size={24} sx={{ color: '#00FFCC' }} />
        ) : (
          <>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00FFCC' }}>
              Points: {score?.total_points}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#facc15' }}>
              Goal Difference: {score?.total_goal_difference}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserScoreCard;
