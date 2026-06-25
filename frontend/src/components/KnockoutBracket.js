import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Box, Paper, Typography, Chip } from '@mui/material';
import Flag from 'react-world-flags';

// --- MatchCard stays unchanged ---
const MatchCard = ({
match,
side = 'left',
final = false,
compact = false,
}) => {

const formatFixtureDate = () => {
  if (!match.matchDate) return '';

  const d = new Date(match.matchDate);

  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
};

    const formatScore = (score, penalties) => {
if (score === null || score === undefined) {
return '';
}
if (
  match.decidedBy === 'penalties' &&
  penalties !== null &&
  penalties !== undefined
) {
  return `${score} (${penalties})`;
}
return score;
};

const hasResult =
match.homeScore !== null &&
match.homeScore !== undefined &&
match.awayScore !== null &&
match.awayScore !== undefined;

const homeWinner =
hasResult &&
(
match.homeScore > match.awayScore ||
(
match.decidedBy === 'penalties' &&
match.penaltyHome > match.penaltyAway
)
);

const awayWinner =
hasResult &&
(
match.awayScore > match.homeScore ||
(
match.decidedBy === 'penalties' &&
match.penaltyAway > match.penaltyHome
)
);

const TeamRow = ({
team,
flag,
score,
winner,
}) => (
<Box
sx={{
display: 'flex',
alignItems: 'center',
justifyContent: 'space-between',
gap: 1,
p: 0.8,
borderRadius: 1.25,
background: winner
? 'linear-gradient(135deg, rgba(217,251,232,0.72) 0%, rgba(255,255,255,0.9) 100%)'
: 'rgba(255,255,255,0.55)',
border: winner
? '1px solid rgba(27,94,32,0.22)'
: '1px solid rgba(15,23,42,0.06)',
boxShadow: winner
? '0 6px 16px rgba(27,94,32,0.15)'
: 'none',
opacity: hasResult && !winner ? 0.65 : 1,
}}
>
<Box
sx={{
display: 'flex',
alignItems: 'center',
gap: 1,
minWidth: 0,
flex: 1,
}}
>
{flag ? (
<Flag
code={flag}
style={{
width: 28,
height: 18,
borderRadius: 2,
flexShrink: 0,
boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
}}
/>
) : (
<Box
sx={{
width: 28,
height: 18,
borderRadius: 0.5,
background: 'rgba(15,61,46,0.12)',
flexShrink: 0,
}}
/>
)}
    <Typography
      title={team}
      sx={{
        fontWeight: winner ? 900 : 800,
        color: winner ? '#0f3d2e' : '#143428',
        fontSize: compact ? '0.82rem' : '0.78rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {team}
    </Typography>
  </Box>

  <Box
    sx={{
      minWidth: 52,
      px: 1,
      py: 0.45,
      borderRadius: 1.2,
      textAlign: 'center',
      background: winner
        ? 'linear-gradient(135deg, #1b5e20 0%, #0f766e 100%)'
        : 'linear-gradient(135deg, rgba(15,118,110,0.10) 0%, rgba(217,251,232,0.42) 100%)',
      color: winner ? '#fff' : '#12372a',
      border: winner
        ? '1px solid rgba(27,94,32,0.25)'
        : '1px solid rgba(15,118,110,0.15)',
      fontWeight: 900,
      fontSize: '0.82rem',
      boxShadow: winner
        ? '0 4px 12px rgba(27,94,32,0.25)'
        : 'none',
    }}
  >
    {score}
  </Box>
</Box>
);

return (
<Paper
elevation={0}
sx={{
width: compact ? '100%' : final ? 260 : 235,
borderRadius: 2,
overflow: 'hidden',
position: 'relative',
background: final
? 'linear-gradient(145deg, rgba(255,248,225,0.98) 0%, rgba(217,251,232,0.98) 60%, rgba(255,255,255,0.94) 100%)'
: 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(238,247,242,0.92) 100%)',
border: final
? '2px solid rgba(245,158,11,0.7)'
: '1px solid rgba(27,94,32,0.15)',
boxShadow: final
? '0 18px 38px rgba(180,83,9,0.20)'
: '0 10px 24px rgba(15,23,42,0.10)',
backdropFilter: 'blur(8px)',
    '&::after':
      compact || final
        ? {}
        : {
            content: '""',
            position: 'absolute',
            top: '50%',
            [side === 'left' ? 'right' : 'left']: -28,
            width: 28,
            borderTop: '2px solid rgba(27,94,32,0.55)',
          },
  }}
>
  <Box
    sx={{
      px: 1.25,
      py: 0.55,
      background: final
        ? 'linear-gradient(135deg, #b45309 0%, #f59e0b 42%, #1b5e20 100%)'
        : 'linear-gradient(135deg, #0f3d2e 0%, #0f766e 46%, #1b5e20 100%)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <Box>
  <Typography
    variant="caption"
    sx={{
      color: '#fff',
      fontWeight: 900,
      display: 'block',
      lineHeight: 1.1,
    }}
  >
    Match {match.id}
  </Typography>

  <Typography
    variant="caption"
    sx={{
      color: 'rgba(255,255,255,0.82)',
      fontSize: '0.60rem',
      lineHeight: 1,
    }}
  >
    {formatFixtureDate()}
    {match.matchTime ? ` • ${match.matchTime.slice(0,5)}` : ''}
  </Typography>
</Box>

    {final && (
      <Chip
        label="Final"
        size="small"
        sx={{
          height: 20,
          fontSize: '0.65rem',
          fontWeight: 900,
          backgroundColor: 'rgba(255,255,255,0.2)',
          color: '#fff',
        }}
      />
    )}
  </Box>

  <Box
  sx={{
    p: 1,
    opacity: hasResult ? 1 : 0.92,
    transition: 'all .25s ease',
  }}
>
  <TeamRow
    team={match.home}
    flag={match.homeFlag}
    score={formatScore(
      match.homeScore,
      match.penaltyHome
    )}
    winner={homeWinner}
  />

  <Box sx={{ height: 8 }} />

  <TeamRow
    team={match.away}
    flag={match.awayFlag}
    score={formatScore(
      match.awayScore,
      match.penaltyAway
    )}
    winner={awayWinner}
  />
</Box>
</Paper>
);
};


// --- RoundColumn stays unchanged ---
const stageGap = {
  0: 1.4,
  1: 3.5,
  2: 6,
  3: 0,
};

const roundOffsets = {
  0: 0,
  1: 72,
  2: 188,
  3: 284,
};

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
        transform: `translateY(${roundOffsets[index]}px)`,
      }}
    >
      {round.matches.map(match => (
        <MatchCard key={match.id} match={match} side={side} />
      ))}
    </Box>
  </Box>
);

// --- KnockoutBracket main component setup ---
const KnockoutBracket = () => {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    axios.get('/fixtures')
      .then(res => setFixtures(res.data))
      .catch(err => console.error(err));
  }, []);

  // map DB round values to frontend labels
  const roundMap = {
    '4': 'Round of 32',
    '5': 'Round of 16',
    '6': 'Quarterfinals',
    '7': 'Semifinals',
    '8': 'Final',
  };

  const buildMatch = f => ({
  id: f.id,

  matchDate: f.match_date,
  matchTime: f.match_time,

  home: f.home_team || f.home_placeholder,
  away: f.away_team || f.away_placeholder,

  homeFlag: f.home_flag,
  awayFlag: f.away_flag,

  homeScore: f.home_score,
  awayScore: f.away_score,

  penaltyHome: f.penalty_home,
  penaltyAway: f.penalty_away,

  decidedBy: f.decided_by,
});

  // group fixtures by round (using roundMap)
  const rounds = {
    'Round of 32': fixtures.filter(f => roundMap[f.round] === 'Round of 32'),
    'Round of 16': fixtures.filter(f => roundMap[f.round] === 'Round of 16'),
    'Quarterfinals': fixtures.filter(f => roundMap[f.round] === 'Quarterfinals'),
    'Semifinals': fixtures.filter(f => roundMap[f.round] === 'Semifinals'),
    'Final': fixtures.filter(f => roundMap[f.round] === 'Final'),
  };

  const getMatches = (roundName, ids) =>
  rounds[roundName]
    .filter(f => ids.includes(f.id))
    .map(buildMatch);

const leftRounds = [
  {
    title: 'Round of 32',
    matches: getMatches('Round of 32', [73, 75, 74, 77, 76, 78, 79, 80]),
  },
  {
    title: 'Round of 16',
    matches: getMatches('Round of 16', [89, 90, 91, 92]),
  },
  {
    title: 'Quarterfinals',
    matches: getMatches('Quarterfinals', [97, 99]),
  },
  {
    title: 'Semifinals',
    matches: getMatches('Semifinals', [101]),
  },
];

const rightRounds = [
  {
    title: 'Round of 32',
    matches: getMatches('Round of 32', [83, 84, 81, 82, 86, 88, 85, 87]),
  },
  {
    title: 'Round of 16',
    matches: getMatches('Round of 16', [93, 94, 95, 96]),
  },
  {
    title: 'Quarterfinals',
    matches: getMatches('Quarterfinals', [98, 100]),
  },
  {
    title: 'Semifinals',
    matches: getMatches('Semifinals', [102]),
  },
];

const finalMatch =
  rounds['Final']?.length > 0
    ? buildMatch(rounds['Final'][0])
    : null;

    const champion = (() => {
  if (!finalMatch) return null;

  const hasResult =
    finalMatch.homeScore !== null &&
    finalMatch.homeScore !== undefined &&
    finalMatch.awayScore !== null &&
    finalMatch.awayScore !== undefined;

  if (!hasResult) return null;

  const homeWins =
    finalMatch.decidedBy === 'penalties'
      ? finalMatch.penaltyHome > finalMatch.penaltyAway
      : finalMatch.homeScore > finalMatch.awayScore;

  return homeWins
    ? {
        name: finalMatch.home,
        flag: finalMatch.homeFlag,
      }
    : {
        name: finalMatch.away,
        flag: finalMatch.awayFlag,
      };
})();

    // --- MobileRound stays unchanged ---
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
          <MatchCard
            key={match.id}
            match={match}
            compact
            final={round.title === 'Final'}
          />
        ))}
      </Box>
    </Paper>
  );

  // --- Return block ---
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

      {/* Desktop view */}
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
          {leftRounds.map((round, index) => (
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
              Final
            </Typography>

            {finalMatch && <MatchCard match={finalMatch} final />}

            <Paper
elevation={0}
sx={{
width: 260,
mt: 2,
p: 2,
borderRadius: 2,
textAlign: 'center',

background:
  'linear-gradient(145deg, rgba(255,248,225,0.98) 0%, rgba(217,251,232,0.98) 100%)',

border: '2px solid rgba(245,158,11,0.75)',

boxShadow:
  '0 18px 40px rgba(180,83,9,0.22)',

position: 'relative',
overflow: 'hidden',

'&::before': {
  content: '""',
  position: 'absolute',
  inset: 0,
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)',
  pointerEvents: 'none',
},

}}

>

<Box
sx={{
position: 'relative',
zIndex: 1,
}}

>
<Typography
  sx={{
    fontSize: '2rem',
    mb: 0.5,
    textShadow: '0 4px 12px rgba(180,83,9,0.35)',
  }}
>
  🏆
</Typography>

<Typography
  variant="caption"
  sx={{
    display: 'block',
    fontWeight: 900,
    color: '#8a5a00',
    textTransform: 'uppercase',
    mb: 1,
  }}
>
  World Champion
</Typography>

{champion ? (
  <>
    {champion.flag && (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 1,
        }}
      >
        <Flag
          code={champion.flag}
          style={{
            width: 70,
            height: 46,
            borderRadius: 4,
            boxShadow: '0 8px 18px rgba(0,0,0,0.18)',
          }}
        />
      </Box>
    )}

    <Typography
      sx={{
        fontWeight: 950,
        color: '#12372a',
        fontSize: '1.05rem',
      }}
    >
      {champion.name}
    </Typography>
  </>
) : (
  <Typography
    sx={{
      fontWeight: 800,
      color: '#60756b',
    }}
  >
    Champion TBD
  </Typography>
)}

  </Box>
</Paper>
          </Box>

          {[...rightRounds].reverse().map((round, index) => (
            <RoundColumn
              key={`right-${round.title}`}
              round={round}
              index={3 - index}
              side="right"
            />
          ))}
        </Box>
      </Box>

      {/* Mobile view */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        {[...leftRounds, ...rightRounds, { title: 'Final', matches: finalMatch ? [finalMatch] : [] }].map(round => (
          <MobileRound key={round.title} round={round} />
        ))}
      </Box>
    </Box>
  );
};

export default KnockoutBracket;