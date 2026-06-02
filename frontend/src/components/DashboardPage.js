import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress
} from '@mui/material';
import axios from '../axiosConfig';
import { TeamCard } from './TeamCard';
import UserScoreCard from './UserScoreCard';
import Leaderboard from './Leaderboard';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selections, setSelections] = useState({
    Favourite: null,
    Seeded: null,
    'Dark Horse': null,
    Underdog: null,
  });
  const [cutoff, setCutoff] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loadingTeams, setLoadingTeams] = useState(true);

  useEffect(() => {
    axios.get('/cutoff')
      .then(res => setCutoff(new Date(res.data.cutoff)))
      .catch(err => console.error('Cutoff fetch failed', err));
  }, []);

  useEffect(() => {
    if (!cutoff) return;
    const interval = setInterval(() => {
      const diff = cutoff - new Date();
      if (diff <= 0) {
        setTimeLeft('Selections closed');
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${days} days - ${hours} hours - ${minutes} mins - ${seconds} secs`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cutoff]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/auth/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setUser({
          id: res.data.id,
          name: res.data.name,
          role: res.data.role,
          verified: res.data.verified,
        });
      })
      .catch(err => console.error('Failed to fetch user info', err));

    axios.get('/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoadingTeams(false));

    axios.get('/userSelections/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const data = res.data;
        setSelections({
          Favourite: data.favourite_team_id || null,
          Seeded: data.seeded_team_id || null,
          'Dark Horse': data.dark_horse_team_id || null,
          Underdog: data.underdog_team_id || null,
        });
      })
      .catch(err => console.error(err));
  }, []);

  if (!user) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h5">Please log in to view your dashboard.</Typography>
      </Box>
    );
  }

  const getTeamDetails = (teamId) => teams.find(t => t.id === teamId);

  // ✅ Return JSX
  return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Welcome + Account Status */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
          gap: 2
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: "#00FFCC",
            fontWeight: 'bold',
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          {user.name ? `Welcome, ${user.name}` : 'Welcome to Your Dashboard'}
        </Typography>

        <Card
          sx={{
            minWidth: { xs: '100%', sm: 220 },
            borderRadius: 3,
            boxShadow: 4,
            textAlign: 'center',
            border: '2px solid #7FC8A9',
            background: 'linear-gradient(135deg, rgba(168,168,168,0.75) 0%, rgba(125,158,147,0.75) 50%, rgba(107,143,132,0.75) 100%)',
            backdropFilter: 'blur(6px)',
            p: 1,
          }}
        >
          <CardContent sx={{ p: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Account Status
            </Typography>
            {user.verified ? (
              <Typography variant="body2" color="success.main">✅ Verified</Typography>
            ) : (
              <Typography variant="body2" color="warning.main">⏳ Pending</Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Countdown Timer */}
      {timeLeft !== 'Selections closed' && (
        <Card
          sx={{
            mb: 3,
            borderRadius: 3,
            boxShadow: 8,
            textAlign: 'center',
            border: '2px solid #7FC8A9',
            background: 'linear-gradient(135deg, rgba(168,168,168,0.75) 0%, rgba(125,158,147,0.75) 50%, rgba(107,143,132,0.75) 100%)',
            fontWeight: 'bold',
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                textTransform: 'uppercase',
                color: '#FFD700',
                mb: 2,
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              Team Selection Deadline
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 'bold',
                color: '#00FFCC',
                letterSpacing: 2,
                fontSize: { xs: '1rem', md: '1.5rem' }
              }}
            >
              {timeLeft}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Score + Leaderboard */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 3,
          mb: 4,
          width: '100%',
          alignItems: 'stretch'
        }}
      >
        <UserScoreCard userId={user.id} />

        {user.verified ? (
          <Leaderboard currentUserId={user.id} />
        ) : (
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 6,
              textAlign: 'center',
              border: '2px solid #00FFCC',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
              color: '#fff',
              p: 2,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#00FFCC' }}>
                Leaderboard unlocks once verified
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      {/* Teams Section */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          boxShadow: 6,
          background: 'rgba(255, 255, 255, 0.65)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', fontSize: { xs: '1.2rem', md: '1.5rem' } }}
          >
            Your Teams
          </Typography>

          {loadingTeams ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress sx={{ color: '#00FFCC' }} />
            </Box>
          ) : selections.Favourite || selections.Seeded || selections['Dark Horse'] || selections.Underdog ? (
            <>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(280px, 1fr))' },
                  gap: 2
                }}
              >
                {selections.Favourite && getTeamDetails(selections.Favourite) && (
                  <TeamCard label="FAVOURITE" team={getTeamDetails(selections.Favourite)} />
                )}
                {selections.Seeded && getTeamDetails(selections.Seeded) && (
                  <TeamCard label="SEEDED" team={getTeamDetails(selections.Seeded)} />
                )}
                {selections['Dark Horse'] && getTeamDetails(selections['Dark Horse']) && (
                  <TeamCard label="DARK HORSE" team={getTeamDetails(selections['Dark Horse'])} />
                )}
                {selections.Underdog && getTeamDetails(selections.Underdog) && (
                  <TeamCard label="UNDERDOG" team={getTeamDetails(selections.Underdog)} />
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  href="/teams"
                  sx={{
                    mt: 2,
                    px: { xs: 4, md: 8 },
                    py: { xs: 1.5, md: 2 },
                    fontWeight: 'bold',
                    fontSize: { xs: '1rem', md: '1.25rem' },
                    backgroundColor: '#00FFCC',
                    color: '#000',
                    '&:hover': { backgroundColor: '#00e6b8' },
                  }}
                  variant="contained"
                  disabled={timeLeft === 'Selections closed'}
                >
                  Edit Teams
                </Button>
              </Box>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', mt: 1, textAlign: 'center' }}
              >
                {timeLeft && timeLeft !== 'Selections closed' ? `Selections close in ${timeLeft}` : ''}
              </Typography>
            </>
          ) : (
            <Typography>
              No teams selected yet. <Button variant="contained" href="/teams">Select Teams</Button>
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default DashboardPage;

