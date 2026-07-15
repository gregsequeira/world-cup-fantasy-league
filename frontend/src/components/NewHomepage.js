import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Chip, Paper, Typography } from '@mui/material';
import axios from '../axiosConfig';
import AnnouncementBanner from '../components/AnnouncementBanner';
import HeroSection from '../components/HeroSection';
import TournamentPulse from '../components/TournamentPulse';

const ROUND_NAMES = {
  1: 'Round 1',
  2: 'Round 2',
  3: 'Round 3',
  4: 'Round of 32',
  5: 'Round of 16',
  6: 'Quarter-finals',
  7: 'Semi-finals',
  8: 'Final',
};

const normaliseStatus = (status) => String(status || '').toLowerCase();

const getFixtureDate = (fixture) => {
  const date = String(fixture?.match_date || '').slice(0, 10);
  const time = fixture?.match_time || '00:00:00';
  return new Date(`${date}T${time}`);
};

const getTeamName = (fixture, side) =>
  fixture?.[`${side}_team`] || fixture?.[`${side}_placeholder`] || 'To be confirmed';

const getWinnerSide = (fixture) => {
  if (normaliseStatus(fixture?.status) !== 'completed') return null;

  if (fixture?.winner_team_id) {
    if (String(fixture.winner_team_id) === String(fixture.home_team_id)) return 'home';
    if (String(fixture.winner_team_id) === String(fixture.away_team_id)) return 'away';
  }

  const homeScore = Number(fixture?.home_score);
  const awayScore = Number(fixture?.away_score);
  if (homeScore > awayScore) return 'home';
  if (awayScore > homeScore) return 'away';

  if (Number(fixture?.penalty_home) > Number(fixture?.penalty_away)) return 'home';
  if (Number(fixture?.penalty_away) > Number(fixture?.penalty_home)) return 'away';
  return null;
};

const getChampionTeam = (fixture) => {
  const winnerSide = getWinnerSide(fixture);
  if (!winnerSide) return null;
  return getTeamName(fixture, winnerSide);
};

const StageCard = ({ label, value, detail }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      borderRadius: 1.5,
      background: 'rgba(255,255,255,0.88)',
      border: '1px solid rgba(27,94,32,0.12)',
      boxShadow: '0 12px 28px rgba(15,23,42,0.08)',
      minHeight: 120,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: 1,
    }}
  >
    <Box>
      <Typography sx={{ color: '#60756b', fontWeight: 850, fontSize: '0.72rem', textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.6, color: '#12372a', fontWeight: 950, fontSize: { xs: '0.98rem', sm: '1.08rem' }, lineHeight: 1.25 }}>
        {value}
      </Typography>
    </Box>
    <Typography sx={{ color: '#73857d', fontWeight: 650, fontSize: '0.75rem', lineHeight: 1.45 }}>
      {detail}
    </Typography>
  </Paper>
);

const NewHomepage = () => {
  const [fixtures, setFixtures] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.allSettled([
      axios.get('/fixtures'),
      axios.get('/user-scores'),
    ]).then(([fixturesResult, scoresResult]) => {
      if (!active) return;

      if (fixturesResult.status === 'fulfilled') {
        setFixtures(Array.isArray(fixturesResult.value.data) ? fixturesResult.value.data : []);
      } else {
        console.error('Fixtures could not be loaded', fixturesResult.reason);
      }

      if (scoresResult.status === 'fulfilled') {
        setScores(Array.isArray(scoresResult.value.data) ? scoresResult.value.data : []);
      } else {
        console.error('Leaderboard could not be loaded', scoresResult.reason);
      }

      if (fixturesResult.status === 'rejected' && scoresResult.status === 'rejected') {
        setError('Tournament information could not be loaded. Please refresh the page shortly.');
      }

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const verifiedLeaderboard = useMemo(() => {
    return scores
      .filter((user) => user.verified)
      .sort((a, b) => {
        const pointsDifference = Number(b.total_points) - Number(a.total_points);
        if (pointsDifference !== 0) return pointsDifference;
        return Number(b.total_goal_difference) - Number(a.total_goal_difference);
      });
  }, [scores]);

  const finalFixture = useMemo(() => {
    const finalMatch = fixtures.find((fixture) => Number(fixture.round) === 8);
    if (finalMatch) return finalMatch;

    return [...fixtures]
      .sort((a, b) => getFixtureDate(b) - getFixtureDate(a))
      .find((fixture) => Number(fixture.round) >= 7) || null;
  }, [fixtures]);

  const finalists = useMemo(() => {
    if (!finalFixture) return [];

    return [getTeamName(finalFixture, 'home'), getTeamName(finalFixture, 'away')]
      .filter((name, index, array) => name && array.indexOf(name) === index);
  }, [finalFixture]);

  const championTeam = useMemo(() => getChampionTeam(finalFixture), [finalFixture]);

  const leaderboardLeaders = useMemo(() => {
    if (!verifiedLeaderboard.length) return [];

    const topScore = verifiedLeaderboard[0];

    return verifiedLeaderboard.filter(
      (user) =>
        Number(user.total_points) === Number(topScore.total_points) &&
        Number(user.total_goal_difference) === Number(topScore.total_goal_difference)
    );
  }, [verifiedLeaderboard]);

  const leaderboardLeaderNames = leaderboardLeaders.map((user) => user.user_name).join(' & ');
  const leaderboardLeader = leaderboardLeaders[0];
  const isFinalStage = Boolean(finalFixture) && Number(finalFixture.round) >= 7;

  return (
    <Box
      className="homepage"
      sx={{
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(180deg, rgba(244,251,247,0.88) 0%, rgba(238,247,242,0.94) 44%, rgba(230,241,236,0.96) 100%), url(/images/header.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        backgroundRepeat: 'no-repeat',
      }}
    >
      <HeroSection />

      <Box
        component="main"
        sx={{
          width: '100%',
          maxWidth: 1280,
          mx: 'auto',
          px: { xs: 1.5, sm: 2, md: 3 },
          pt: { xs: 2, md: 3 },
          pb: { xs: 4, md: 6 },
        }}
      >
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Paper
          elevation={0}
          sx={{
            mb: 2,
            p: { xs: 2, md: 2.5 },
            borderRadius: 1,
            background: 'linear-gradient(135deg, rgba(255,248,225,0.98) 0%, rgba(255,255,255,0.96) 45%, rgba(217,251,232,0.94) 100%)',
            border: '1px solid rgba(245,158,11,0.24)',
            boxShadow: '0 16px 38px rgba(15,23,42,0.11)',
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
            <Box sx={{ maxWidth: 700 }}>
              <Chip
                label={isFinalStage ? 'Final stage' : 'Tournament update'}
                size="small"
                sx={{
                  mb: 1.2,
                  height: 28,
                  color: '#8a5a00',
                  backgroundColor: '#fff3cd',
                  fontWeight: 900,
                  borderRadius: 1.5,
                }}
              />

              <Typography
                variant="h5"
                sx={{
                  color: '#12372a',
                  fontWeight: 950,
                  lineHeight: 1.15,
                  fontSize: { xs: '1.35rem', sm: '1.65rem' },
                }}
              >
                {isFinalStage ? 'The tournament has reached its decisive match.' : 'The latest tournament storylines are on display.'}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: '#60756b',
                  fontWeight: 650,
                  lineHeight: 1.55,
                  maxWidth: 760,
                }}
              >
                {isFinalStage
                  ? 'The final pairing, the likely fantasy winner, and the championship result are now the only stories that matter.'
                  : 'Keep up with the fixtures, rankings, and momentum as the competition moves toward its closing stages.'}
              </Typography>
            </Box>

            <Chip
              label={isFinalStage ? 'Winner watch' : 'Live tournament feed'}
              sx={{
                mt: { xs: 0.5, sm: 0 },
                height: 30,
                backgroundColor: '#d9fbe8',
                color: '#12372a',
                fontWeight: 900,
              }}
            />
          </Box>

          <Box
            sx={{
              mt: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' },
              gap: 1.5,
            }}
          >
            <StageCard
              label="Fantasy leader"
              value={leaderboardLeaderNames || 'Leaderboard waiting for verified scores'}
              detail={leaderboardLeader
                ? `${leaderboardLeader.total_points} pts, GD ${leaderboardLeader.total_goal_difference}`
                : 'The winner picture appears once the leaderboard settles.'}
            />

            <StageCard
              label="Finalists"
              value={finalists.length ? finalists.join(' vs ') : 'Final pairing to be confirmed'}
              detail={finalFixture
                ? `${ROUND_NAMES[Number(finalFixture.round)] || 'Final'} on the schedule`
                : 'The last two teams will be shown here once the bracket is complete.'}
            />

            <StageCard
              label="Championship result"
              value={championTeam || 'Awaiting the final whistle'}
              detail={championTeam
                ? 'The world champion is now known.'
                : 'This card will lock in once the decisive match is complete.'}
            />
          </Box>
        </Paper>

        <AnnouncementBanner
          fixtures={fixtures}
          scores={scores}
          loading={loading}
        />

        <TournamentPulse
          fixtures={fixtures}
          scores={scores}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default NewHomepage;
