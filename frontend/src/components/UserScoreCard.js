import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, CircularProgress, Box, Chip } from '@mui/material';
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
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, rgba(15,61,46,0.94) 0%, rgba(27,94,32,0.72) 52%, rgba(245,158,11,0.30) 100%)',
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
          textAlign: 'center',
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
          Overall Score
        </Typography>
      </Box>

      <CardContent
        sx={{
          minHeight: 190,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: { xs: 2, md: 3 },
          textAlign: 'center',
        }}
      >
        {loading ? (
          <CircularProgress size={32} sx={{ color: '#fff7d6' }} />
        ) : (
          <>
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(217,251,232,0.86)',
                fontWeight: 900,
                letterSpacing: 0,
              }}
            >
              Your Tournament Total
            </Typography>

            <Typography
              sx={{
                mt: 0.5,
                mb: 2,
                color: '#fff7d6',
                fontWeight: 950,
                fontSize: { xs: '2.4rem', md: '3.1rem' },
                lineHeight: 1,
                textShadow: '0 4px 16px rgba(0,0,0,0.3)',
              }}
            >
              {score?.total_points ?? 0}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Chip
                label="Points"
                size="small"
                sx={{
                  borderRadius: 1.25,
                  backgroundColor: '#d9fbe8',
                  color: '#12372a',
                  fontWeight: 900,
                }}
              />

              <Chip
                label={`GD ${score?.total_goal_difference ?? 0}`}
                size="small"
                sx={{
                  borderRadius: 1.25,
                  backgroundColor: '#fff3cd',
                  color: '#8a5a00',
                  fontWeight: 900,
                }}
              />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserScoreCard;