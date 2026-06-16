import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';

const bracket = {
  left: [
    {
      title: 'Round of 32',
      matches: [
        { id: 73, home: 'Runner-up Group A', away: 'Runner-up Group B' },
        { id: 75, home: 'Winner Group F', away: 'Runner-up Group C' },
        { id: 74, home: 'Winner Group E', away: 'Best 3rd Group A/B/C/D/F' },
        { id: 77, home: 'Winner Group I', away: 'Best 3rd Group C/D/F/G/H' },
        { id: 76, home: 'Winner Group C', away: 'Runner-up Group F' },
        { id: 78, home: 'Runner-up Group E', away: 'Runner-up Group I' },
        { id: 79, home: 'Winner Group A', away: 'Best 3rd Group C/E/F/H/I' },
        { id: 80, home: 'Winner Group L', away: 'Best 3rd Group E/H/I/J/K' },
      ],
    },
    {
      title: 'Round of 16',
      matches: [
        { id: 89, home: 'Winner Match 73', away: 'Winner Match 75' },
        { id: 90, home: 'Winner Match 74', away: 'Winner Match 77' },
        { id: 91, home: 'Winner Match 76', away: 'Winner Match 78' },
        { id: 92, home: 'Winner Match 79', away: 'Winner Match 80' },
      ],
    },
    {
      title: 'Quarterfinals',
      matches: [
        { id: 97, home: 'Winner Match 89', away: 'Winner Match 90' },
        { id: 99, home: 'Winner Match 91', away: 'Winner Match 92' },
      ],
    },
    {
      title: 'Semifinal',
      matches: [
        { id: 101, home: 'Winner Match 97', away: 'Winner Match 98' },
      ],
    },
  ],
  right: [
    {
      title: 'Round of 32',
      matches: [
        { id: 83, home: 'Runner-up Group K', away: 'Runner-up Group L' },
        { id: 84, home: 'Winner Group H', away: 'Runner-up Group J' },
        { id: 81, home: 'Winner Group D', away: 'Best 3rd Group B/E/F/I/J' },
        { id: 82, home: 'Winner Group G', away: 'Best 3rd Group A/E/H/I/J' },
        { id: 86, home: 'Winner Group J', away: 'Runner-up Group H' },
        { id: 88, home: 'Runner-up Group D', away: 'Runner-up Group G' },
        { id: 85, home: 'Winner Group B', away: 'Best 3rd Group E/F/G/I/J' },
        { id: 87, home: 'Winner Group K', away: 'Best 3rd Group D/E/I/J/L' },
      ],
    },
    {
      title: 'Round of 16',
      matches: [
        { id: 93, home: 'Winner Match 83', away: 'Winner Match 84' },
        { id: 94, home: 'Winner Match 81', away: 'Winner Match 82' },
        { id: 95, home: 'Winner Match 86', away: 'Winner Match 88' },
        { id: 96, home: 'Winner Match 85', away: 'Winner Match 87' },
      ],
    },
    {
      title: 'Quarterfinals',
      matches: [
        { id: 98, home: 'Winner Match 93', away: 'Winner Match 94' },
        { id: 100, home: 'Winner Match 95', away: 'Winner Match 96' },
      ],
    },
    {
      title: 'Semifinal',
      matches: [
        { id: 102, home: 'Winner Match 99', away: 'Winner Match 100' },
      ],
    },
  ],
  final: {
    title: 'Final',
    match: { id: 104, home: 'Winner Match 101', away: 'Winner Match 102' },
  },
};

const stageGap = {
  0: 1.4,
  1: 7.5,
  2: 20,
  3: 0,
};

const allMobileRounds = [
  { title: 'Round of 32', matches: [...bracket.left[0].matches, ...bracket.right[0].matches].sort((a, b) => a.id - b.id) },
  { title: 'Round of 16', matches: [...bracket.left[1].matches, ...bracket.right[1].matches].sort((a, b) => a.id - b.id) },
  { title: 'Quarterfinals', matches: [...bracket.left[2].matches, ...bracket.right[2].matches].sort((a, b) => a.id - b.id) },
  { title: 'Semifinals', matches: [...bracket.left[3].matches, ...bracket.right[3].matches].sort((a, b) => a.id - b.id) },
  { title: 'Final', matches: [bracket.final.match] },
];

const MatchCard = ({ match, side = 'left', final = false, compact = false }) => (
  <Paper
    elevation={final ? 5 : 2}
    sx={{
      width: compact ? '100%' : final ? 250 : 230,
      borderRadius: 1.5,
      overflow: 'hidden',
      background: final
        ? 'linear-gradient(135deg, rgba(255,248,225,0.98) 0%, rgba(217,251,232,0.98) 100%)'
        : 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(238,247,242,0.92) 100%)',
      border: final ? '2px solid rgba(245,158,11,0.8)' : '1px solid rgba(27,94,32,0.18)',
      position: 'relative',
      flexShrink: 0,
      boxShadow: final
        ? '0 18px 35px rgba(120, 85, 20, 0.22)'
        : '0 8px 22px rgba(15,23,42,0.09)',
      backdropFilter: 'blur(8px)',
      '&::after': compact || final
        ? {}
        : {
            content: '""',
            position: 'absolute',
            top: '50%',
            [side === 'left' ? 'right' : 'left']: -20,
            width: 20,
            borderTop: '2px solid rgba(27,94,32,0.55)',
          },
    }}
  >
    <Box
      sx={{
        px: 1.25,
        py: 0.6,
        background: final ? 'rgba(245,158,11,0.18)' : 'rgba(27,94,32,0.10)',
        borderBottom: '1px solid rgba(27,94,32,0.12)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography
        variant="caption"
        sx={{
          color: '#1b5e20',
          fontWeight: 900,
          fontSize: '0.68rem',
          letterSpacing: 0,
        }}
      >
        Match {match.id}
      </Typography>

      {final && (
        <Chip
          label="Final"
          size="small"
          sx={{
            height: 20,
            fontSize: '0.65rem',
            fontWeight: 800,
            color: '#fff',
            backgroundColor: '#b45309',
          }}
        />
      )}
    </Box>

    <Box sx={{ px: 1.25, py: 0.95 }}>
      <Typography
        variant="body2"
        title={match.home}
        sx={{
          color: '#143428',
          fontWeight: 800,
          fontSize: compact ? '0.82rem' : '0.76rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {match.home}
      </Typography>

      <Box sx={{ my: 0.65, borderTop: '1px solid rgba(27,94,32,0.12)' }} />

      <Typography
        variant="body2"
        title={match.away}
        sx={{
          color: '#143428',
          fontWeight: 800,
          fontSize: compact ? '0.82rem' : '0.76rem',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {match.away}
      </Typography>
    </Box>
  </Paper>
);

const RoundColumn = ({ round, index, side }) => (
  <Box
    sx={{
      width: 250,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: side === 'left' ? 'flex-end' : 'flex-start',
    }}
  >
    <Typography
      variant="subtitle2"
      sx={{
        width: 230,
        mb: 2,
        py: 0.75,
        borderRadius: 1.5,
        textAlign: 'center',
        color: '#d9fbe8',
        backgroundColor: 'rgba(15,61,46,0.82)',
        fontWeight: 900,
        textTransform: 'uppercase',
        fontSize: '0.76rem',
        letterSpacing: 0,
        boxShadow: '0 8px 18px rgba(15,23,42,0.14)',
      }}
    >
      {round.title}
    </Typography>

    <Box
      sx={{
        minHeight: 650,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: index === 3 ? 'center' : 'flex-start',
        gap: `${stageGap[index]}rem`,
      }}
    >
      {round.matches.map(match => (
        <MatchCard key={match.id} match={match} side={side} />
      ))}
    </Box>
  </Box>
);

const MobileRound = ({ round }) => (
  <Paper
    elevation={0}
    sx={{
      mb: 2,
      borderRadius: 2,
      overflow: 'hidden',
      border: '1px solid rgba(27,94,32,0.18)',
      background: 'rgba(255,255,255,0.72)',
      boxShadow: '0 12px 30px rgba(15,23,42,0.10)',
      backdropFilter: 'blur(8px)',
    }}
  >
    <Box sx={{ px: 1.5, py: 1, background: 'rgba(15,61,46,0.88)' }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: '#d9fbe8',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: 0,
        }}
      >
        {round.title}
      </Typography>
    </Box>

    <Box sx={{ p: 1.25, display: 'grid', gap: 1 }}>
      {round.matches.map(match => (
        <MatchCard key={match.id} match={match} compact final={round.title === 'Final'} />
      ))}
    </Box>
  </Paper>
);

const KnockoutBracket = () => {
  return (
    <Box
      sx={{
        p: { xs: 1.25, md: 2 },
        borderRadius: 2,
        background:
          'linear-gradient(135deg, rgba(15,61,46,0.90) 0%, rgba(27,94,32,0.58) 42%, rgba(245,158,11,0.22) 100%)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 2, md: 3 },
          textAlign: 'center',
          color: '#fff',
          fontWeight: 950,
          fontSize: { xs: '1.35rem', md: '2rem' },
          textShadow: '0 3px 12px rgba(0,0,0,0.28)',
        }}
      >
        Knockout Bracket
      </Typography>

      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          overflowX: 'auto',
          pb: 2,
          borderRadius: 2,
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 100%)',
        }}
      >
        <Box
          sx={{
            minWidth: 2250,
            height: 720,
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 250px) 250px repeat(4, 250px)',
            alignItems: 'start',
            px: 2,
            pt: 2,
          }}
        >
          {bracket.left.map((round, index) => (
            <RoundColumn
              key={`left-${round.title}`}
              round={round}
              index={index}
              side="left"
            />
          ))}

          <Box
            sx={{
              width: 250,
              height: 690,
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                width: 250,
                mb: 2,
                py: 0.75,
                borderRadius: 1.5,
                textAlign: 'center',
                color: '#fff7d6',
                backgroundColor: 'rgba(180,83,9,0.86)',
                fontWeight: 900,
                textTransform: 'uppercase',
                fontSize: '0.76rem',
                letterSpacing: 0,
                boxShadow: '0 8px 18px rgba(15,23,42,0.18)',
              }}
            >
              {bracket.final.title}
            </Typography>

            <MatchCard match={bracket.final.match} final />

            <Paper
              elevation={2}
              sx={{
                width: 230,
                mt: 1.5,
                p: 1.4,
                borderRadius: 2,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #12372a 0%, #1b5e20 100%)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.22)',
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  fontWeight: 800,
                  opacity: 0.82,
                }}
              >
                Winner
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 900 }}>
                World Cup Champion
              </Typography>
            </Paper>
          </Box>

          {[...bracket.right].reverse().map((round, index) => (
            <RoundColumn
              key={`right-${round.title}`}
              round={round}
              index={3 - index}
              side="right"
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {allMobileRounds.map(round => (
          <MobileRound key={round.title} round={round} />
        ))}
      </Box>
    </Box>
  );
};

export default KnockoutBracket;