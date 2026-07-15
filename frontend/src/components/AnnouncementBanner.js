import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  CircularProgress,
  Fade,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import SportsSoccerRoundedIcon from '@mui/icons-material/SportsSoccerRounded';

const ROTATION_TIME = 8000;

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

const fixtureDate = (fixture) => {
  const date = String(fixture?.match_date || '').slice(0, 10);
  const time = fixture?.match_time || '00:00:00';
  return new Date(`${date}T${time}`);
};

const formatFixtureDate = (fixture) => {
  const date = fixtureDate(fixture);
  if (Number.isNaN(date.getTime())) return 'Kick-off to be confirmed';

  return new Intl.DateTimeFormat('en-ZA', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

const formatTimeUntil = (fixture, now) => {
  const difference = fixtureDate(fixture) - now;
  if (!Number.isFinite(difference) || difference <= 0) return null;

  const days = Math.floor(difference / 86400000);
  const hours = Math.floor((difference / 3600000) % 24);
  const minutes = Math.floor((difference / 60000) % 60);

  if (days > 0) return `${days}d ${hours}h away`;
  if (hours > 0) return `${hours}h ${minutes}m away`;
  return `${Math.max(minutes, 1)}m away`;
};

const AnnouncementBanner = ({ fixtures = [], scores = [], loading = false, isFinalStage = false }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(clock);
  }, []);

  const tournament = useMemo(() => {
    const liveFixture = fixtures.find(
      (fixture) => normaliseStatus(fixture.status) === 'live'
    );

    const upcomingFixtures = fixtures
      .filter((fixture) => {
        const status = normaliseStatus(fixture.status);
        return status !== 'completed' && fixtureDate(fixture) >= now;
      })
      .sort((a, b) => fixtureDate(a) - fixtureDate(b));

    const featuredFixture = liveFixture || upcomingFixtures[0] || null;

    const fixtureRounds = [...new Set(
      fixtures.map((fixture) => Number(fixture.round)).filter(Boolean)
    )].sort((a, b) => a - b);

    const currentRound = liveFixture
      ? Number(liveFixture.round)
      : fixtureRounds.find((round) =>
          fixtures.some(
            (fixture) =>
              Number(fixture.round) === round &&
              normaliseStatus(fixture.status) !== 'completed'
          )
        ) || fixtureRounds[fixtureRounds.length - 1] || 4;

    const roundFixtures = fixtures.filter(
      (fixture) => Number(fixture.round) === currentRound
    );
    const completedFixtures = roundFixtures.filter(
      (fixture) => normaliseStatus(fixture.status) === 'completed'
    ).length;

    return {
      featuredFixture,
      currentRound,
      roundFixtures,
      completedFixtures,
    };
  }, [fixtures, now]);

  const leaders = useMemo(() => {
    const verifiedScores = scores
      .filter((user) => user.verified)
      .sort((a, b) => {
        const pointsDifference = Number(b.total_points) - Number(a.total_points);
        if (pointsDifference !== 0) return pointsDifference;
        return Number(b.total_goal_difference) - Number(a.total_goal_difference);
      });

    if (!verifiedScores.length) return [];
    const first = verifiedScores[0];

    return verifiedScores.filter(
      (user) =>
        Number(user.total_points) === Number(first.total_points) &&
        Number(user.total_goal_difference) === Number(first.total_goal_difference)
    );
  }, [scores]);

  const slides = useMemo(() => {
    const fixture = tournament.featuredFixture;
    const homeTeam = fixture?.home_team || fixture?.home_placeholder || 'To be confirmed';
    const awayTeam = fixture?.away_team || fixture?.away_placeholder || 'To be confirmed';
    const isLive = normaliseStatus(fixture?.status) === 'live';
    const timeUntil = fixture ? formatTimeUntil(fixture, now) : null;
    const leader = leaders[0];
    const leaderNames = leaders.map((user) => user.user_name).join(' & ');
    const roundTotal = tournament.roundFixtures.length;
    const progress = roundTotal
      ? (tournament.completedFixtures / roundTotal) * 100
      : 0;

    return [
      {
        id: 'fixture',
        eyebrow: isFinalStage ? 'Final showdown' : isLive ? 'Live now' : 'Next fixture',
        icon: SportsSoccerRoundedIcon,
        title: fixture ? `${homeTeam} vs ${awayTeam}` : 'Next fixture coming soon',
        description: fixture
          ? formatFixtureDate(fixture)
          : 'The next confirmed fixture will appear here.',
        chips: [
          fixture && `Match ${fixture.id}`,
          fixture && ROUND_NAMES[Number(fixture.round)],
          isLive ? 'In progress' : timeUntil,
        ].filter(Boolean),
        accent: '#0f766e',
      },
      {
        id: 'leader',
        eyebrow: isFinalStage ? 'Winner watch' : leaders.length > 1 ? 'Joint leaders' : 'Current leader',
        icon: EmojiEventsRoundedIcon,
        title: leader
          ? leaders.length > 2
            ? `${leaders.length} players share the lead`
            : leaderNames
          : 'Leaderboard awaiting results',
        description: leader
          ? isFinalStage
            ? 'The title race now has a clear front-runner.'
            : 'Setting the pace as the knockout stage unfolds.'
          : 'Scores will appear as completed results are entered.',
        chips: leader
          ? [`${leader.total_points} points`, `GD ${leader.total_goal_difference}`]
          : [],
        accent: '#b45309',
      },
      {
        id: 'stage',
        eyebrow: isFinalStage ? 'Final stage' : 'Tournament progress',
        icon: GroupsRoundedIcon,
        title: isFinalStage ? 'Championship match' : ROUND_NAMES[tournament.currentRound] || 'Knockout stage',
        description: roundTotal
          ? isFinalStage
            ? `${tournament.completedFixtures} of ${roundTotal} fixtures decided in the final round.`
            : `${tournament.completedFixtures} of ${roundTotal} fixtures completed.`
          : 'Fixtures will appear as the tournament progresses.',
        chips: roundTotal
          ? [isFinalStage ? 'Final match' : `${roundTotal - tournament.completedFixtures} remaining`]
          : [],
        progress,
        accent: '#1b5e20',
      },
    ];
  }, [isFinalStage, leaders, now, tournament]);

  useEffect(() => {
    if (paused || loading) return undefined;

    const rotation = setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, ROTATION_TIME);

    return () => clearInterval(rotation);
  }, [loading, paused, slides.length]);

  const showSlide = (index) => {
    setActiveSlide((index + slides.length) % slides.length);
  };

  const slide = slides[activeSlide];
  const SlideIcon = slide.icon;

  return (
    <Paper
      elevation={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{
        position: 'relative',
        minHeight: { xs: 290, sm: 230 },
        p: { xs: 2, md: 2.75 },
        overflow: 'hidden',
        borderRadius: 1,
        color: '#163226',
        background:
          'linear-gradient(135deg, rgba(255,248,225,0.98) 0%, rgba(255,255,255,0.96) 48%, rgba(217,251,232,0.95) 100%)',
        border: '1px solid rgba(245,158,11,0.36)',
        boxShadow: '0 16px 42px rgba(15,23,42,0.14)',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: 5,
          bgcolor: slide.accent,
          transition: 'background-color 300ms ease',
        }}
      />

      {loading ? (
        <Box sx={{ minHeight: { xs: 245, sm: 180 }, display: 'grid', placeItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={32} sx={{ color: '#0f766e' }} />
            <Typography sx={{ mt: 1, color: '#375448', fontWeight: 750 }}>
              Loading tournament update...
            </Typography>
          </Box>
        </Box>
      ) : (
        <Fade key={slide.id} in timeout={450}>
          <Box
            sx={{
              minHeight: { xs: 245, sm: 180 },
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'auto minmax(0, 1fr)' },
              gap: { xs: 1.5, md: 2.5 },
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                width: 58,
                height: 58,
                mx: { xs: 'auto', md: 0 },
                display: 'grid',
                placeItems: 'center',
                borderRadius: 1,
                color: '#fff',
                bgcolor: slide.accent,
                boxShadow: `0 10px 24px ${slide.accent}3d`,
              }}
            >
              <SlideIcon sx={{ fontSize: 31 }} />
            </Box>

            <Box sx={{ minWidth: 0, textAlign: { xs: 'center', md: 'left' } }}>
              <Chip
                label={slide.eyebrow}
                size="small"
                sx={{
                  mb: 1,
                  height: 23,
                  borderRadius: 1,
                  bgcolor: `${slide.accent}18`,
                  color: slide.accent,
                  border: `1px solid ${slide.accent}33`,
                  fontWeight: 900,
                  fontSize: '0.68rem',
                  textTransform: 'uppercase',
                }}
              />

              <Typography
                component="h2"
                sx={{
                  color: '#12372a',
                  fontWeight: 950,
                  fontSize: { xs: '1.18rem', md: '1.55rem' },
                  lineHeight: 1.2,
                }}
              >
                {slide.title}
              </Typography>

              <Typography sx={{ mt: 0.7, color: '#4d685c', fontWeight: 650, fontSize: '0.87rem' }}>
                {slide.description}
              </Typography>

              {slide.progress !== undefined && (
                <LinearProgress
                  variant="determinate"
                  value={slide.progress}
                  sx={{
                    mt: 1.5,
                    maxWidth: 430,
                    mx: { xs: 'auto', md: 0 },
                    height: 7,
                    borderRadius: 1,
                    bgcolor: 'rgba(27,94,32,0.12)',
                    '& .MuiLinearProgress-bar': { bgcolor: slide.accent },
                  }}
                />
              )}

              {!!slide.chips.length && (
                <Box sx={{ mt: 1.3, display: 'flex', flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' }, gap: 0.7 }}>
                  {slide.chips.map((chip) => (
                    <Chip
                      key={chip}
                      label={chip}
                      size="small"
                      sx={{ height: 24, borderRadius: 1, bgcolor: '#fff', color: '#375448', fontWeight: 800, border: '1px solid rgba(27,94,32,0.13)' }}
                    />
                  ))}
                </Box>
              )}
            </Box>

          </Box>
        </Fade>
      )}

      <Box sx={{ mt: 1.2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
        <IconButton size="small" aria-label="Previous update" onClick={() => showSlide(activeSlide - 1)}>
          <ChevronLeftRoundedIcon />
        </IconButton>

        {slides.map((item, index) => (
          <Box
            key={item.id}
            component="button"
            type="button"
            aria-label={`Show ${item.eyebrow}`}
            onClick={() => showSlide(index)}
            sx={{
              width: index === activeSlide ? 24 : 8,
              height: 8,
              p: 0,
              border: 0,
              borderRadius: 1,
              cursor: 'pointer',
              bgcolor: index === activeSlide ? slide.accent : 'rgba(55,84,72,0.24)',
              transition: 'all 220ms ease',
            }}
          />
        ))}

        <IconButton size="small" aria-label="Next update" onClick={() => showSlide(activeSlide + 1)}>
          <ChevronRightRoundedIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default AnnouncementBanner;
