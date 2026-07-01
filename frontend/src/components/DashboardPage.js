import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  CircularProgress,
  Chip
} from '@mui/material';
import Flag from 'react-world-flags';
import axios from '../axiosConfig';
import { TeamCard } from './TeamCard';
import UserScoreCard from './UserScoreCard';
import Leaderboard from './Leaderboard';

const emptyGroupSelections = {
  Favourite: null,
  Seeded: null,
  'Dark Horse': null,
  Underdog: null,
};

const emptyKnockoutSelections = {
  Favourite: null,
  'Team 1': null,
  'Team 2': null,
  'Team 3': null,
};

const knockoutRoles = ['Favourite', 'Team 1', 'Team 2', 'Team 3'];

const knockoutRoleMeta = {
  Favourite: {
    label: 'Favourite Pick',
    accent: 'gold',
  },
  'Team 1': {
    label: 'Knockout Team',
    accent: 'green',
  },
  'Team 2': {
    label: 'Knockout Team',
    accent: 'green',
  },
  'Team 3': {
    label: 'Knockout Team',
    accent: 'green',
  },
};

const KnockoutPickCard = ({ role, team }) => {
  const meta = knockoutRoleMeta[role];
  const isGold = meta.accent === 'gold';
  const [stats, setStats] = useState(null);

useEffect(() => {
  if (!team?.id) return;


  axios
    .get(`/standings/${team.id}?minRound=4`)
    .then(res => setStats(res.data))
    .catch(() =>
      setStats({
        won: 0,
        goals_for: 0,
        goals_against: 0,
      })
    )
}, [team?.id]);

  return (
    <Card
      elevation={0}
      sx={{
        minHeight: 255,
        borderRadius: 2,
        textAlign: 'center',
        overflow: 'hidden',
        background: team
          ? isGold
            ? 'linear-gradient(145deg, rgba(255,248,225,0.98) 0%, rgba(217,251,232,0.96) 60%, rgba(255,255,255,0.92) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(232,245,233,0.88) 56%, rgba(217,251,232,0.76) 100%)'
          : 'linear-gradient(145deg, rgba(255,255,255,0.72) 0%, rgba(238,247,242,0.66) 100%)',
        border: isGold
          ? '1px solid rgba(245,158,11,0.62)'
          : '1px solid rgba(217,251,232,0.42)',
        boxShadow: '0 14px 32px rgba(15,23,42,0.14), inset 0 1px 0 rgba(255,255,255,0.52)',
      }}
    >
      <Box
        sx={{
          height: 54,
          background: isGold
            ? 'linear-gradient(135deg, #b45309 0%, #f59e0b 42%, #1b5e20 100%)'
            : 'linear-gradient(135deg, #0f3d2e 0%, #0f766e 46%, #1b5e20 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 1,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: '#fff',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: 0,
          }}
        >
          {meta.label}
        </Typography>
      </Box>

      <CardContent
        sx={{
          px: 2,
          pt: team ? 0 : 2,
          pb: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {team ? (
          <>
            <Box
              sx={{
                mt: -1.25,
                mb: 1.25,
                p: 0.55,
                borderRadius: 1.5,
                background: 'rgba(255,255,255,0.86)',
                boxShadow: '0 10px 22px rgba(15,23,42,0.18)',
                border: isGold
                  ? '1px solid rgba(245,158,11,0.42)'
                  : '1px solid rgba(27,94,32,0.16)',
              }}
            >
              {team.flag_code && (
                <Flag
                  code={team.flag_code}
                  style={{
                    width: 72,
                    height: 48,
                    borderRadius: 4,
                    display: 'block',
                    objectFit: 'cover',
                  }}
                />
              )}
            </Box>

            <Chip
              label={role}
              size="small"
              sx={{
                mb: 1,
                height: 22,
                borderRadius: 1.25,
                backgroundColor: isGold ? '#fff3cd' : '#d9fbe8',
                color: isGold ? '#8a5a00' : '#12372a',
                fontWeight: 900,
                fontSize: '0.68rem',
              }}
            />

            <Typography
              title={team.name}
              sx={{
                fontWeight: 950,
                color: '#12372a',
                mb: 0.75,
                fontSize: '1.05rem',
                lineHeight: 1.15,
                maxWidth: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {team.name}
            </Typography>

            {team.knockout_slot && (
              <Chip
                label={team.knockout_slot}
                size="small"
                sx={{
                  mb: 1.25,
                  maxWidth: '100%',
                  borderRadius: 1.25,
                  backgroundColor: 'rgba(15,118,110,0.12)',
                  color: '#0f3d2e',
                  fontWeight: 850,
                  fontSize: '0.68rem',
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                }}
              />
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 0.75,
                width: '100%',
              }}
            >
              <Chip label={`Rank ${team.ranking ?? '-'}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(15,118,110,0.10)', color: '#12372a', fontWeight: 850 }} />
              <Chip label={`Wins ${stats?.won ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(27,94,32,0.10)', color: '#12372a', fontWeight: 850 }} />
              <Chip label={`GF ${stats?.goals_for ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(245,158,11,0.12)', color: '#6b3f00', fontWeight: 850 }} />
              <Chip label={`GA ${stats?.goals_against ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(180,83,9,0.10)', color: '#6b3f00', fontWeight: 850 }} />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              width: '100%',
              minHeight: 150,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1.5,
              background: isGold ? 'rgba(255,243,205,0.44)' : 'rgba(217,251,232,0.34)',
              border: isGold
                ? '1px dashed rgba(180,83,9,0.34)'
                : '1px dashed rgba(27,94,32,0.26)',
              px: 2,
            }}
          >
            <Chip
              label={role}
              size="small"
              sx={{
                mb: 1.25,
                height: 22,
                borderRadius: 1.25,
                backgroundColor: isGold ? '#fff3cd' : '#d9fbe8',
                color: isGold ? '#8a5a00' : '#12372a',
                fontWeight: 900,
                fontSize: '0.68rem',
              }}
            />

            <Typography
              variant="body2"
              sx={{
                color: isGold ? '#b45309' : '#60756b',
                fontStyle: 'italic',
                fontWeight: 850,
              }}
            >
              No pick saved yet
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selections, setSelections] = useState(emptyGroupSelections);
  const [knockoutSelections, setKnockoutSelections] = useState(emptyKnockoutSelections);
  const [cutoff, setCutoff] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [loadingKnockoutSelections, setLoadingKnockoutSelections] = useState(true);

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

        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
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

    axios.get('/userKnockout/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        const data = res.data;
        setKnockoutSelections({
          Favourite: data.ko_favourite_team_id || null,
          'Team 1': data.ko_team1_id || null,
          'Team 2': data.ko_team2_id || null,
          'Team 3': data.ko_team3_id || null,
        });
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingKnockoutSelections(false));
  }, []);

  const getTeamDetails = (teamId) => teams.find(team => String(team.id) === String(teamId));

  if (!user) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage:
            'linear-gradient(180deg, rgba(244,251,247,0.82) 0%, rgba(15,61,46,0.72) 100%), url(/images/header.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          px: { xs: 2, md: 4 },
          py: { xs: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            maxWidth: 720,
            mx: 'auto',
            p: { xs: 2.5, md: 4 },
            borderRadius: 2,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(27,94,32,0.16)',
            boxShadow: '0 18px 50px rgba(15,23,42,0.14)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#12372a' }}>
            Please log in to view your dashboard.
          </Typography>
        </Box>
      </Box>
    );
  }

  const hasSelections = selections.Favourite || selections.Seeded || selections['Dark Horse'] || selections.Underdog;
  const hasKnockoutSelections = Object.values(knockoutSelections).some(Boolean);
  const selectionsClosed = timeLeft === 'Selections closed';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(180deg, rgba(244,251,247,0.82) 0%, rgba(15,61,46,0.62) 38%, rgba(15,61,46,0.86) 100%), url(/images/header.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        backgroundRepeat: 'no-repeat',
        px: { xs: 1.5, md: 4 },
        py: { xs: 3, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Box
          sx={{
            mb: 3,
            p: { xs: 2, md: 2.75 },
            borderRadius: 2,
            background:
              'linear-gradient(135deg, rgba(15,61,46,0.92) 0%, rgba(27,94,32,0.68) 52%, rgba(245,158,11,0.24) 100%)',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: '0 18px 50px rgba(15,23,42,0.14)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', sm: 'center' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: '#d9fbe8', fontWeight: 900, letterSpacing: 0 }}>
                Fantasy Dashboard
              </Typography>

              <Typography
                variant="h3"
                sx={{
                  color: '#fff',
                  fontWeight: 950,
                  fontSize: { xs: '1.75rem', md: '2.6rem' },
                  textShadow: '0 4px 16px rgba(0,0,0,0.35)',
                  lineHeight: 1.1,
                }}
              >
                {user.name ? `Welcome, ${user.name}` : 'Welcome to Your Dashboard'}
              </Typography>
            </Box>

            <Card
              elevation={0}
              sx={{
                minWidth: { xs: '100%', sm: 220 },
                borderRadius: 2,
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.28)',
                background: 'rgba(255,255,255,0.90)',
                boxShadow: '0 12px 30px rgba(15,23,42,0.10)',
              }}
            >
              <CardContent sx={{ p: 1.5 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 1, color: '#12372a' }}>
                  Account Status
                </Typography>

                <Chip
                  label={user.verified ? 'Verified' : 'Pending'}
                  size="small"
                  sx={{
                    borderRadius: 1.25,
                    fontWeight: 900,
                    backgroundColor: user.verified ? '#d9fbe8' : '#fff3cd',
                    color: user.verified ? '#12372a' : '#8a5a00',
                  }}
                />
              </CardContent>
            </Card>
          </Box>
        </Box>

        {!selectionsClosed && (
          <Card
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 2,
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.22)',
              background:
                'linear-gradient(135deg, rgba(15,61,46,0.92) 0%, rgba(27,94,32,0.72) 52%, rgba(245,158,11,0.28) 100%)',
              boxShadow: '0 18px 50px rgba(15,23,42,0.14)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <CardContent>
              <Typography variant="overline" sx={{ color: '#d9fbe8', fontWeight: 900, letterSpacing: 0 }}>
                Knockout Selection Deadline
              </Typography>

              <Typography
                variant="h4"
                sx={{
                  mt: 0.5,
                  color: '#fff7d6',
                  fontWeight: 950,
                  fontSize: { xs: '1.4rem', md: '2rem' },
                  textShadow: '0 3px 12px rgba(0,0,0,0.28)',
                }}
              >
                {timeLeft}
              </Typography>
            </CardContent>
          </Card>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            mb: 4,
            width: '100%',
            alignItems: 'stretch',
          }}
        >
          <UserScoreCard userId={user.id} />

          {user.verified ? (
            <Leaderboard currentUserId={user.id} />
          ) : (
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.22)',
                background:
                  'linear-gradient(135deg, rgba(15,61,46,0.92) 0%, rgba(27,94,32,0.62) 100%)',
                color: '#fff',
                p: 2,
                height: '100%',
                boxShadow: '0 18px 50px rgba(15,23,42,0.14)',
              }}
            >
              <CardContent>
                <Typography variant="body2" sx={{ fontWeight: 900, color: '#d9fbe8' }}>
                  Leaderboard unlocks once verified
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>

        <Card
          elevation={0}
          sx={{
            mb: 3,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(27,94,32,0.16)',
            boxShadow: '0 18px 50px rgba(15,23,42,0.14)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 950,
                color: '#12372a',
                fontSize: { xs: '1.25rem', md: '1.55rem' },
              }}
            >
              Your Group Stage Teams
            </Typography>

            {loadingTeams ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress sx={{ color: '#0f766e' }} />
              </Box>
            ) : hasSelections ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(280px, 1fr))' },
                  gap: 2,
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
            ) : (
              <Box
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  background: 'rgba(217,251,232,0.55)',
                  textAlign: 'center',
                  border: '1px solid rgba(27,94,32,0.14)',
                }}
              >
                <Typography sx={{ mb: 2, color: '#375448', fontWeight: 750 }}>
                  No group stage teams selected yet.
                </Typography>

                <Button
                  variant="contained"
                  href="/teams"
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 900,
                    backgroundColor: '#0f766e',
                    '&:hover': {
                      backgroundColor: '#0b625c',
                    },
                  }}
                >
                  Select Teams
                </Button>
              </Box>
            )}

            <Divider sx={{ my: 3, borderColor: 'rgba(27,94,32,0.16)' }} />

            <Typography
              variant="h5"
              sx={{
                mb: 2,
                fontWeight: 950,
                color: '#12372a',
                fontSize: { xs: '1.25rem', md: '1.55rem' },
              }}
            >
              Your Knockout Picks
            </Typography>

            {loadingKnockoutSelections || loadingTeams ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                <CircularProgress sx={{ color: '#0f766e' }} />
              </Box>
            ) : hasKnockoutSelections ? (
              <>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
                    gap: 2,
                  }}
                >
                  {knockoutRoles.map(role => (
                    <KnockoutPickCard
                      key={role}
                      role={role}
                      team={getTeamDetails(knockoutSelections[role])}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Button
                    href="/knockout"
                    variant="contained"
                    disabled={selectionsClosed}
                    sx={{
                      width: { xs: '100%', sm: 'auto' },
                      px: { xs: 4, md: 8 },
                      py: { xs: 1.25, md: 1.55 },
                      fontWeight: 900,
                      fontSize: { xs: '1rem', md: '1.08rem' },
                      borderRadius: 1.5,
                      textTransform: 'none',
                      backgroundColor: '#0f766e',
                      boxShadow: '0 12px 26px rgba(15,118,110,0.28)',
                      '&:hover': {
                        backgroundColor: '#0b625c',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(15,118,110,0.35)',
                        color: 'rgba(255,255,255,0.75)',
                      },
                    }}
                  >
                    Update Knockout Picks
                  </Button>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                  background: 'rgba(255,243,205,0.45)',
                  textAlign: 'center',
                  border: '1px solid rgba(180,83,9,0.18)',
                }}
              >
                <Typography sx={{ mb: 2, color: '#6b3f00', fontWeight: 800 }}>
                  No knockout picks saved yet.
                </Typography>

                <Button
                  variant="contained"
                  href="/knockout"
                  disabled={selectionsClosed}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 900,
                    backgroundColor: '#0f766e',
                    '&:hover': {
                      backgroundColor: '#0b625c',
                    },
                    '&.Mui-disabled': {
                      backgroundColor: 'rgba(15,118,110,0.35)',
                      color: 'rgba(255,255,255,0.75)',
                    },
                  }}
                >
                  Select Knockout Teams
                </Button>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    mt: 1.25,
                    color: '#8a5a00',
                    fontWeight: 700,
                  }}
                >
                  {timeLeft && !selectionsClosed ? `Selections close in ${timeLeft}` : ''}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default DashboardPage;