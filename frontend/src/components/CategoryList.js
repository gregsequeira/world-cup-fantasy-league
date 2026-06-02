import React from 'react';
import axios from '../axiosConfig';
import { Box, Typography, Card, CardContent, Divider } from '@mui/material';
import Flag from 'react-world-flags';
import { formatDayMonth, formatShortTime } from '../utils/dateUtils';

function CategoryList({ teams }) {
  const TeamCard = ({ team }) => {
    const [flipped, setFlipped] = React.useState(false);
    const [fixtures, setFixtures] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const fetchFixtures = async () => {
      if (fixtures || loading) return;
      setLoading(true);
      try {
        const res = await axios.get(`/fixtures/team/${team.id}`);
        setFixtures(res.data);
      } catch (err) {
        console.error('Failed to load fixtures', err);
        setFixtures([]);
      } finally {
        setLoading(false);
      }
    };

    const isTouchDevice = () =>
      typeof window !== 'undefined' &&
      ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const handleMouseEnter = () => {
      if (!isTouchDevice()) {
        setFlipped(true);
        fetchFixtures();
      }
    };
    const handleMouseLeave = () => {
      if (!isTouchDevice()) setFlipped(false);
    };
    const handleClick = () => {
      if (isTouchDevice()) {
        setFlipped(prev => !prev);
        if (!fixtures) fetchFixtures();
      }
    };

    return (
      <Box
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        sx={{
          perspective: 1000,
          width: '100%',
          height: '100%',
          cursor: 'pointer'
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          {/* Front */}
          <Card
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              boxShadow: 4,
              borderRadius: 3,
              textAlign: 'center',
              border: '2px solid #7FC8A9',
              background:
                'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
              backfaceVisibility: 'hidden'
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%'
              }}
            >
              <Flag
                code={team.flag_code}
                style={{ width: 60, height: 40, marginBottom: 8 }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  fontSize: { xs: '0.9rem', sm: '1rem' }
                }}
              >
                {team.name}
              </Typography>
              <Divider sx={{ marginY: 1, width: '80%' }} />
              <Typography variant="body2" color="text.secondary">
                Ranking: {team.ranking}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Group: {team.group_name}
              </Typography>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            sx={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              boxShadow: 6,
              borderRadius: 3,
              textAlign: 'left',
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(180deg, #0f172a 0%, #0b1220 100%)',
              color: '#fff',
              p: 1
            }}
          >
            <CardContent sx={{ height: '100%', overflowY: 'auto' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Flag
                  code={team.flag_code}
                  style={{
                    width: 60,
                    height: 40,
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.35)'
                  }}
                />
              </Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}
              >
                Fixtures
              </Typography>
              {loading && <Typography variant="body2">Loading...</Typography>}
              {!loading && fixtures && fixtures.length === 0 && (
                <Typography variant="body2">No fixtures found</Typography>
              )}
              {!loading &&
                fixtures &&
                fixtures.map(f => (
                  <Box key={f.id} sx={{ mb: 0.5 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: '0.8rem', sm: '0.85rem' },
                        lineHeight: 1.2
                      }}
                    >
                      {formatDayMonth(f.match_date)} {f.home_team} vs {f.away_team} {formatShortTime(f.match_time)}
                    </Typography>
                  </Box>
                ))}
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  };

  const categories = ['Seeded', 'Dark Horse', 'Underdog'];

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        backgroundImage: 'url(/images/background1.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}
    >
      {categories.map(cat => (
        <Box
          key={cat}
          sx={{
            mb: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            borderRadius: 3,
            p: { xs: 2, md: 4 },
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              color: '#000',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontSize: { xs: '1.2rem', md: '2rem' }
            }}
          >
            {cat} Teams
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)'
              },
              gap: 3,
              alignItems: 'stretch'
            }}
          >
            {teams
              .filter(t => t.category === cat)
              .map(team => (
                <Box key={team.id} sx={{ height: 240 }}>
                  <TeamCard team={team} />
                </Box>
              ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default CategoryList;
