import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Divider, Box } from '@mui/material';
import Flag from 'react-world-flags';
import axios from '../axiosConfig';
import { formatDayMonth, formatShortTime } from '../utils/dateUtils';

export const TeamCard = ({ label, team }) => {
  const [fixtures, setFixtures] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!team?.id) return;

    axios.get(`/fixtures/team/${team.id}`)
      .then(res => setFixtures(res.data))
      .catch(() => setFixtures([]));

    setLoadingStats(true);
    axios.get(`/standings/${team.id}`)
      .then(res => {
        let s = res.data;
        if (label.toLowerCase().includes('favourite') || label.toLowerCase().includes('underdog')) {
          s.points = s.points * 2;
        }
        setStats(s);
      })
      .catch(() => setStats({ points: 0, goal_difference: 0, goals_for: 0, goals_against: 0 }))
      .finally(() => setLoadingStats(false));
  }, [team?.id, label]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: { xs: '100%', sm: 360 },
        mx: 'auto',
        mb: 3
      }}
    >
      {/* Team Card */}
      <Card
        sx={{
          width: '100%',
          boxShadow: 4,
          borderRadius: 3,
          textAlign: 'center',
          border: '2px solid #7FC8A9',
          background: 'linear-gradient(135deg, rgba(168,168,168,0.85) 0%, rgba(125,158,147,0.85) 50%, rgba(107,143,132,0.85) 100%)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.9rem', md: '1rem' } }}
          >
            {label}
          </Typography>
          {team.flag_code && (
            <Flag
              code={team.flag_code}
              style={{ width: 60, height: 40, marginBottom: 8 }}
            />
          )}
          <Typography
            variant="body1"
            sx={{ fontWeight: 'bold', fontSize: { xs: '0.95rem', md: '1rem' } }}
          >
            {team.name}
          </Typography>
          <Divider sx={{ my: 1, width: '80%' }} />
          {team.ranking && (
            <Typography variant="body2" color="text.secondary">
              Ranking: {team.ranking}
            </Typography>
          )}
          {team.group_name && (
            <Typography variant="body2" color="text.secondary">
              {team.group_name}
            </Typography>
          )}

          {/* Fixtures */}
          <Divider sx={{ my: 2 }} />
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '0.85rem', md: '0.95rem' } }}
          >
            Fixtures
          </Typography>
          {fixtures && fixtures.map(f => (
            <Box key={f.id} sx={{ mb: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ fontSize: { xs: '0.75rem', md: '0.85rem' }, lineHeight: 1.2 }}
              >
                {formatDayMonth(f.match_date)} {f.home_team} vs {f.away_team} {formatShortTime(f.match_time)}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card
        sx={{
          width: '100%',
          mt: 1.5,
          boxShadow: 6,
          borderRadius: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
          border: '2px solid #00FFCC',
        }}
      >
        <CardContent>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 'bold',
              mb: 1,
              color: '#00FFCC',
              fontSize: { xs: '0.9rem', md: '1rem' }
            }}
          >
            Stats
          </Typography>
          {loadingStats ? (
            <Typography variant="body2">Loading stats...</Typography>
          ) : (
            <>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', color: '#00FFCC', fontSize: { xs: '0.95rem', md: '1rem' } }}
              >
                Points: {stats?.points}
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 'bold', color: '#facc15', fontSize: { xs: '0.95rem', md: '1rem' } }}
              >
                Goal Difference: {stats?.goal_difference}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f3f4f6', fontSize: { xs: '0.8rem', md: '0.9rem' } }}
              >
                Goals For: {stats?.goals_for}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: '#f3f4f6', fontSize: { xs: '0.8rem', md: '0.9rem' } }}
              >
                Goals Against: {stats?.goals_against}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
