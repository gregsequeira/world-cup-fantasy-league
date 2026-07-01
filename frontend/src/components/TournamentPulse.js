import React, { useMemo } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import AccountTreeRoundedIcon from '@mui/icons-material/AccountTreeRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import HistoryRoundedIcon from '@mui/icons-material/HistoryRounded';
import SportsSoccerRoundedIcon from '@mui/icons-material/SportsSoccerRounded';
import TimelineRoundedIcon from '@mui/icons-material/TimelineRounded';
import Flag from 'react-world-flags';
import { formatShortDate, formatShortTime } from '../utils/dateUtils';

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
const hasValue = (value) => value !== null && value !== undefined && value !== '';

const getFixtureDate = (fixture) => {
  const date = String(fixture?.match_date || '').slice(0, 10);
  const time = fixture?.match_time || '00:00:00';
  return new Date(`${date}T${time}`);
};

const getTeam = (fixture, side) => ({
  name:
    fixture?.[`${side}_team`] ||
    fixture?.[`${side}_placeholder`] ||
    'To be confirmed',
  flag: fixture?.[`${side}_flag`],
});

const formatScore = (fixture, side) => {
  const status = normaliseStatus(fixture.status);
  if (!['live', 'completed'].includes(status)) return null;

  const score = side === 'home' ? fixture.home_score : fixture.away_score;
  const penalties = side === 'home' ? fixture.penalty_home : fixture.penalty_away;
  if (!hasValue(score)) return null;

  if (normaliseStatus(fixture.decided_by) === 'penalties' && hasValue(penalties)) {
    return `${score} (${penalties})`;
  }

  return String(score);
};

const getWinnerSide = (fixture) => {
  if (normaliseStatus(fixture.status) !== 'completed') return null;

  if (hasValue(fixture.winner_team_id)) {
    if (String(fixture.winner_team_id) === String(fixture.home_team_id)) return 'home';
    if (String(fixture.winner_team_id) === String(fixture.away_team_id)) return 'away';
  }

  const homeScore = Number(fixture.home_score);
  const awayScore = Number(fixture.away_score);
  if (homeScore > awayScore) return 'home';
  if (awayScore > homeScore) return 'away';

  if (Number(fixture.penalty_home) > Number(fixture.penalty_away)) return 'home';
  if (Number(fixture.penalty_away) > Number(fixture.penalty_home)) return 'away';
  return null;
};

const Section = ({ title, subtitle, icon: Icon, accent, children, sx }) => (
  <Paper
    component="section"
    elevation={0}
    sx={{
      minWidth: 0,
      overflow: 'hidden',
      borderRadius: 1,
      background: 'rgba(255,255,255,0.92)',
      border: '1px solid rgba(27,94,32,0.14)',
      boxShadow: '0 14px 34px rgba(15,23,42,0.11)',
      backdropFilter: 'blur(10px)',
      ...sx,
    }}
  >
    <Box
      sx={{
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1.25,
        borderBottom: '1px solid rgba(27,94,32,0.1)',
        background: `linear-gradient(135deg, ${accent}18 0%, rgba(255,255,255,0.7) 100%)`,
      }}
    >
      <Box sx={{ width: 36, height: 36, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: 1, bgcolor: accent, color: '#fff' }}>
        <Icon sx={{ fontSize: 21 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography component="h2" sx={{ color: '#12372a', fontWeight: 950, fontSize: '1rem', lineHeight: 1.2 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ mt: 0.2, color: '#60756b', fontWeight: 650, fontSize: '0.72rem' }}>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
    <Box sx={{ p: { xs: 1.25, sm: 1.75 } }}>{children}</Box>
  </Paper>
);

const TeamName = ({ team, winner, reverse = false }) => (
  <Box
    sx={{
      minWidth: 0,
      display: 'flex',
      flexDirection: reverse ? 'row-reverse' : 'row',
      alignItems: 'center',
      gap: 0.65,
    }}
  >
    {team.flag && (
      <Flag
        code={team.flag}
        style={{ width: 25, height: 17, objectFit: 'cover', borderRadius: 2, flexShrink: 0 }}
      />
    )}
    <Typography
      noWrap
      title={team.name}
      sx={{
        minWidth: 0,
        color: winner ? '#1b5e20' : '#294b3e',
        fontWeight: winner ? 950 : 750,
        fontSize: { xs: '0.75rem', sm: '0.82rem' },
        textAlign: reverse ? 'right' : 'left',
      }}
    >
      {team.name}
    </Typography>
  </Box>
);

const FixtureRow = ({ fixture, showDate = false }) => {
  const home = getTeam(fixture, 'home');
  const away = getTeam(fixture, 'away');
  const homeScore = formatScore(fixture, 'home');
  const awayScore = formatScore(fixture, 'away');
  const winner = getWinnerSide(fixture);
  const live = normaliseStatus(fixture.status) === 'live';
  const completed = normaliseStatus(fixture.status) === 'completed';

  return (
    <Box
      sx={{
        px: { xs: 1, sm: 1.25 },
        py: 1.1,
        display: 'grid',
        gridTemplateColumns: showDate
          ? { xs: '1fr', sm: '82px minmax(0,1fr)' }
          : '1fr',
        gap: { xs: 0.7, sm: 1 },
        alignItems: 'center',
        borderRadius: 1,
        bgcolor: completed ? 'rgba(232,245,233,0.72)' : 'rgba(247,250,248,0.88)',
        border: '1px solid rgba(27,94,32,0.1)',
      }}
    >
      {showDate && (
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography sx={{ color: '#375448', fontWeight: 850, fontSize: '0.7rem' }}>
            {formatShortDate(fixture.match_date)}
          </Typography>
          <Typography sx={{ color: '#73857d', fontWeight: 700, fontSize: '0.67rem' }}>
            {formatShortTime(fixture.match_time)}
          </Typography>
        </Box>
      )}

      <Box sx={{ minWidth: 0 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1fr) auto 18px auto minmax(0,1fr)',
            gap: 0.5,
            alignItems: 'center',
          }}
        >
          <TeamName team={home} winner={winner === 'home'} />
          <Typography sx={{ color: '#12372a', fontWeight: 950, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {homeScore ?? '-'}
          </Typography>
          <Typography sx={{ color: '#829087', textAlign: 'center', fontWeight: 850, fontSize: '0.65rem' }}>VS</Typography>
          <Typography sx={{ color: '#12372a', fontWeight: 950, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            {awayScore ?? '-'}
          </Typography>
          <TeamName team={away} winner={winner === 'away'} reverse />
        </Box>

        <Box sx={{ mt: 0.7, display: 'flex', justifyContent: 'center', gap: 0.7 }}>
          <Chip
            label={live ? 'Live' : completed ? 'Full time' : `Match ${fixture.id}`}
            size="small"
            sx={{
              height: 19,
              borderRadius: 1,
              bgcolor: live ? '#c62828' : completed ? '#1b5e20' : '#fff3cd',
              color: live || completed ? '#fff' : '#8a5a00',
              fontWeight: 900,
              fontSize: '0.58rem',
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

const EmptyMessage = ({ children }) => (
  <Box sx={{ minHeight: 110, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
    <Typography sx={{ color: '#60756b', fontWeight: 700, fontSize: '0.82rem' }}>
      {children}
    </Typography>
  </Box>
);

const TournamentPulse = ({ fixtures = [], scores = [], loading = false }) => {
  const dashboard = useMemo(() => {
    const now = new Date();
    const sortedFixtures = [...fixtures].sort((a, b) => getFixtureDate(a) - getFixtureDate(b));
    const today = sortedFixtures.filter((fixture) => {
      const date = getFixtureDate(fixture);
      return !Number.isNaN(date.getTime()) && date.toDateString() === now.toDateString();
    });
    const upcoming = sortedFixtures.filter(
      (fixture) => normaliseStatus(fixture.status) !== 'completed' && getFixtureDate(fixture) >= now
    );

    const liveToday = today.filter((fixture) => normaliseStatus(fixture.status) === 'live');
    const otherToday = today.filter((fixture) => normaliseStatus(fixture.status) !== 'live');
    const featuredFixtures = today.length
      ? [...liveToday, ...otherToday].slice(0, 4)
      : upcoming.slice(0, 4);

    const completed = sortedFixtures
      .filter((fixture) => normaliseStatus(fixture.status) === 'completed')
      .sort((a, b) => getFixtureDate(b) - getFixtureDate(a));

    const liveFixture = fixtures.find((fixture) => normaliseStatus(fixture.status) === 'live');
    const rounds = [...new Set(fixtures.map((fixture) => Number(fixture.round)).filter(Boolean))].sort((a, b) => a - b);
    const currentRound = liveFixture
      ? Number(liveFixture.round)
      : rounds.find((round) => fixtures.some(
          (fixture) => Number(fixture.round) === round && normaliseStatus(fixture.status) !== 'completed'
        )) || rounds[rounds.length - 1] || 4;

    const currentRoundFixtures = sortedFixtures.filter((fixture) => Number(fixture.round) === currentRound);
    const roundCompleted = currentRoundFixtures.filter(
      (fixture) => normaliseStatus(fixture.status) === 'completed'
    ).length;
    const advancing = new Set(
      currentRoundFixtures.map((fixture) => fixture.winner_team_id).filter(hasValue)
    ).size;

    const verifiedScores = scores
      .filter((user) => user.verified)
      .sort((a, b) => {
        const pointsDifference = Number(b.total_points) - Number(a.total_points);
        if (pointsDifference !== 0) return pointsDifference;
        return Number(b.total_goal_difference) - Number(a.total_goal_difference);
      });

    let previousKey = null;
    let previousRank = 0;
    const podium = verifiedScores.slice(0, 3).map((user, index) => {
      const key = `${Number(user.total_points)}:${Number(user.total_goal_difference)}`;
      const rank = key === previousKey ? previousRank : index + 1;
      previousKey = key;
      previousRank = rank;
      return { ...user, rank };
    });

    return {
      featuredFixtures,
      featuredTitle: today.length ? "Today's matches" : 'Coming up',
      latestResults: completed.slice(0, 3),
      currentRound,
      currentRoundFixtures,
      roundCompleted,
      advancing,
      podium,
    };
  }, [fixtures, scores]);

  if (loading) {
    return (
      <Box sx={{ mt: 2.5, minHeight: 320, display: 'grid', placeItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={38} sx={{ color: '#0f766e' }} />
          <Typography sx={{ mt: 1, color: '#375448', fontWeight: 750 }}>Preparing tournament centre...</Typography>
        </Box>
      </Box>
    );
  }

  const roundTotal = dashboard.currentRoundFixtures.length;
  const progress = roundTotal ? (dashboard.roundCompleted / roundTotal) * 100 : 0;
  const upcomingRoundFixtures = dashboard.currentRoundFixtures
    .filter((fixture) => normaliseStatus(fixture.status) !== 'completed')
    .slice(0, 4);

  return (
    <Box
      sx={{
        mt: { xs: 2, md: 3 },
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.35fr) minmax(320px, 0.85fr)' },
        gap: { xs: 2, md: 2.5 },
        alignItems: 'start',
      }}
    >
      <Section
        title={dashboard.featuredTitle}
        subtitle={dashboard.featuredTitle === "Today's matches" ? 'The action happening today' : 'The next matches on the schedule'}
        icon={SportsSoccerRoundedIcon}
        accent="#0f766e"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {dashboard.featuredFixtures.length ? dashboard.featuredFixtures.map((fixture) => (
            <FixtureRow key={fixture.id} fixture={fixture} showDate={dashboard.featuredTitle !== "Today's matches"} />
          )) : <EmptyMessage>No upcoming fixtures are currently scheduled.</EmptyMessage>}
        </Box>
      </Section>

      <Section
        title="Leaderboard podium"
        subtitle="The players setting the pace"
        icon={EmojiEventsRoundedIcon}
        accent="#b45309"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
          {dashboard.podium.length ? dashboard.podium.map((user) => (
            <Box
              key={user.user_id}
              sx={{
                px: 1.25,
                py: 1,
                display: 'grid',
                gridTemplateColumns: '34px minmax(0,1fr) auto',
                gap: 1,
                alignItems: 'center',
                borderRadius: 1,
                bgcolor: user.rank === 1 ? 'rgba(255,243,205,0.78)' : 'rgba(247,250,248,0.9)',
                border: user.rank === 1 ? '1px solid rgba(180,83,9,0.25)' : '1px solid rgba(27,94,32,0.1)',
              }}
            >
              <Box sx={{ width: 30, height: 30, display: 'grid', placeItems: 'center', borderRadius: 1, bgcolor: user.rank === 1 ? '#b45309' : '#d9fbe8', color: user.rank === 1 ? '#fff' : '#12372a', fontWeight: 950 }}>
                {user.rank}
              </Box>
              <Typography noWrap sx={{ color: '#12372a', fontWeight: 900, fontSize: '0.84rem' }}>
                {user.user_name}
              </Typography>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ color: '#1b5e20', fontWeight: 950, fontSize: '0.88rem' }}>
                  {user.total_points} pts
                </Typography>
                <Typography sx={{ color: '#73857d', fontWeight: 750, fontSize: '0.65rem' }}>
                  GD {user.total_goal_difference}
                </Typography>
              </Box>
            </Box>
          )) : <EmptyMessage>The leaderboard is awaiting scores.</EmptyMessage>}
        </Box>
      </Section>

      <Section
        title={`${ROUND_NAMES[dashboard.currentRound] || 'Tournament'} progress`}
        subtitle="A quick view of the current stage"
        icon={TimelineRoundedIcon}
        accent="#1b5e20"
      >
        {roundTotal ? (
          <Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1 }}>
              {[
                { value: dashboard.roundCompleted, label: 'Completed' },
                { value: roundTotal - dashboard.roundCompleted, label: 'Remaining' },
                { value: dashboard.advancing, label: 'Advanced' },
              ].map((item) => (
                <Box key={item.label} sx={{ p: 1, textAlign: 'center', borderRadius: 1, bgcolor: 'rgba(232,245,233,0.72)', border: '1px solid rgba(27,94,32,0.1)' }}>
                  <Typography sx={{ color: '#12372a', fontWeight: 950, fontSize: '1.25rem' }}>{item.value}</Typography>
                  <Typography sx={{ color: '#60756b', fontWeight: 800, fontSize: '0.65rem' }}>{item.label}</Typography>
                </Box>
              ))}
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mt: 1.5, height: 8, borderRadius: 1, bgcolor: 'rgba(27,94,32,0.12)', '& .MuiLinearProgress-bar': { bgcolor: '#1b5e20' } }}
            />
            <Typography sx={{ mt: 0.7, textAlign: 'right', color: '#60756b', fontWeight: 750, fontSize: '0.68rem' }}>
              {Math.round(progress)}% complete
            </Typography>
          </Box>
        ) : <EmptyMessage>Round progress will appear when fixtures are available.</EmptyMessage>}
      </Section>

      <Section
        title="Latest results"
        subtitle="The three most recently completed matches"
        icon={HistoryRoundedIcon}
        accent="#375448"
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {dashboard.latestResults.length ? dashboard.latestResults.map((fixture) => (
            <FixtureRow key={fixture.id} fixture={fixture} />
          )) : <EmptyMessage>Completed results will appear here.</EmptyMessage>}
        </Box>
      </Section>

      <Section
        title="Knockout path"
        subtitle={`Upcoming ${ROUND_NAMES[dashboard.currentRound] || 'knockout'} matchups`}
        icon={AccountTreeRoundedIcon}
        accent="#8a5a00"
        sx={{ gridColumn: { lg: '1 / -1' } }}
      >
        {upcomingRoundFixtures.length ? (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0,1fr))' }, gap: 1 }}>
            {upcomingRoundFixtures.map((fixture) => (
              <FixtureRow key={fixture.id} fixture={fixture} showDate />
            ))}
          </Box>
        ) : <EmptyMessage>All matches in this round have been completed.</EmptyMessage>}
      </Section>
    </Box>
  );
};

export default TournamentPulse;
