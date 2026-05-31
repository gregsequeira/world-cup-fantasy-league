import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Divider, Box } from '@mui/material';
import Flag from 'react-world-flags';
import axios from 'axios';
import { formatDayMonth, formatShortTime } from '../utils/dateUtils'; // ✅ shared utils

export const TeamCard = ({ label, team }) => {
  const [fixtures, setFixtures] = useState(null);
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (!team?.id) return;

    // ✅ Fetch fixtures
    axios.get(`http://localhost:5000/fixtures/team/${team.id}`)
      .then(res => setFixtures(res.data))
      .catch(() => setFixtures([]));

    // ✅ Fetch stats from /standings/:teamId
    setLoadingStats(true);
    axios.get(`http://localhost:5000/standings/${team.id}`)
      .then(res => {
        let s = res.data;

        // ✅ Apply double points rule for Favourite & Underdog
        if (label.toLowerCase().includes('favourite') || label.toLowerCase().includes('underdog')) {
          s.points = s.points * 2;
        }

        setStats(s);
      })
      .catch(() => setStats({ points: 0, goal_difference: 0, goals_for: 0, goals_against: 0 }))
      .finally(() => setLoadingStats(false));
  }, [team?.id, label]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Team Card */}
      <Card
        sx={{
          width: 340,
          minWidth: 300,
          boxShadow: 4,
          borderRadius: 3,
          textAlign: 'center',
          border: '2px solid #7FC8A9',
          background: 'linear-gradient(135deg, rgba(168,168,168,0.85) 0%, rgba(125,158,147,0.85) 50%, rgba(107,143,132,0.85) 100%)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <CardContent>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{label}</Typography>
          {team.flag_code && <Flag code={team.flag_code} style={{ width: 60, height: 40, marginBottom: 8 }} />}
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{team.name}</Typography>
          <Divider sx={{ my: 1, width: '80%' }} />
          {team.ranking && <Typography variant="body2" color="text.secondary">Ranking: {team.ranking}</Typography>}
          {team.group_name && <Typography variant="body2" color="text.secondary">{team.group_name}</Typography>}

          {/* Fixtures */}
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>Fixtures</Typography>
          {fixtures && fixtures.map(f => (
            <Box key={f.id} sx={{ mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontSize: '0.85rem', lineHeight: 1.1 }}>
                {formatDayMonth(f.match_date)} {f.home_team} vs {f.away_team} {formatShortTime(f.match_time)}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card
        sx={{
          width: 340,
          minWidth: 300,
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
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, color: '#00FFCC' }}>
            Stats
          </Typography>
          {loadingStats ? (
            <Typography variant="body2">Loading stats...</Typography>
          ) : (
            <>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#00FFCC' }}>
                Points: {stats?.points}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#facc15' }}>
                Goal Difference: {stats?.goal_difference}
              </Typography>
              <Typography variant="body2" sx={{ color: '#f3f4f6' }}>
                Goals For: {stats?.goals_for}
              </Typography>
              <Typography variant="body2" sx={{ color: '#f3f4f6' }}>
                Goals Against: {stats?.goals_against}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
