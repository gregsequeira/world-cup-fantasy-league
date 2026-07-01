import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';
import Flag from 'react-world-flags';

const KnockoutSelectCard = ({ team, selected, onClick }) => {
    const [stats, setStats] = useState(null);
const [loadingStats, setLoadingStats] = useState(false);

useEffect(() => {
  if (!team?.id) return;

  setLoadingStats(true);

  axios.get(`/standings/${team.id}?minRound=4`)
    .then(res => setStats(res.data))
    .catch(() =>
      setStats({
        won: 0,
        goals_for: 0,
        goals_against: 0,
        points: 0,
        goal_difference: 0,
      })
    )
    .finally(() => setLoadingStats(false));
}, [team?.id]);
  return (
    <Card
      elevation={0}
      onClick={() => {
  if (!selected) onClick(team.id);
}}
      sx={{
        cursor: selected ? 'default' : 'pointer',
        borderRadius: 2,
        textAlign: 'center',
        overflow: 'hidden',
        position: 'relative',
        minHeight: 230,
        background: selected
          ? 'linear-gradient(145deg, rgba(255,248,225,0.98) 0%, rgba(217,251,232,0.98) 58%, rgba(255,255,255,0.94) 100%)'
          : 'linear-gradient(145deg, rgba(255,255,255,0.88) 0%, rgba(232,245,233,0.86) 56%, rgba(217,251,232,0.72) 100%)',
        border: selected
          ? '2px solid rgba(245,158,11,0.9)'
          : '1px solid rgba(217,251,232,0.55)',
        boxShadow: selected
          ? '0 18px 38px rgba(180,83,9,0.22), inset 0 1px 0 rgba(255,255,255,0.72)'
          : '0 12px 28px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.55)',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: selected
            ? '0 20px 42px rgba(180,83,9,0.26), inset 0 1px 0 rgba(255,255,255,0.74)'
            : '0 18px 38px rgba(15,23,42,0.22), inset 0 1px 0 rgba(255,255,255,0.62)',
          borderColor: selected ? 'rgba(245,158,11,0.95)' : 'rgba(217,251,232,0.9)',
        },
      }}
    >
      <Box
        sx={{
          height: 46,
          background: selected
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
          {selected ? 'Selected Team' : 'Available Pick'}
        </Typography>
      </Box>

      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          px: 2,
          pt: 0,
          pb: 2,
        }}
      >
        <Box
          sx={{
            mt: -2.5,
            mb: 1.25,
            p: 0.55,
            borderRadius: 1.5,
            background: 'rgba(255,255,255,0.86)',
            boxShadow: '0 10px 22px rgba(15,23,42,0.18)',
            border: selected
              ? '1px solid rgba(245,158,11,0.42)'
              : '1px solid rgba(27,94,32,0.16)',
          }}
        >
          {team.flag_code ? (
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
          ) : (
            <Box
              sx={{
                width: 72,
                height: 48,
                borderRadius: 1,
                background: 'rgba(15,61,46,0.12)',
              }}
            />
          )}
        </Box>

        {selected && (
          <Chip
            label="Selected"
            size="small"
            sx={{
              mb: 1,
              height: 22,
              borderRadius: 1.25,
              backgroundColor: '#1b5e20',
              color: '#fff',
              fontWeight: 900,
              fontSize: '0.68rem',
            }}
          />
        )}

        <Typography
          title={team.name}
          sx={{
            fontWeight: 950,
            color: '#12372a',
            mb: 1.25,
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

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0.75,
            width: '100%',
            mb: 1,
          }}
        >
          {loadingStats ? (
  <Chip
    label="Loading..."
    size="small"
    sx={{
      gridColumn: '1 / -1',
      borderRadius: 1.25,
      backgroundColor: 'rgba(15,118,110,0.10)',
      color: '#12372a',
      fontWeight: 850,
    }}
  />
) : (
  <>
    <Chip
  label={`Rank ${team.ranking ?? '-'}`}
  size="small"
  sx={{
    borderRadius: 1.25,
    backgroundColor: 'rgba(15,118,110,0.10)',
    color: '#12372a',
    fontWeight: 850,
  }}
/>
    
    <Chip
      label={`Wins ${stats?.won ?? 0}`}
      size="small"
      sx={{
        borderRadius: 1.25,
        backgroundColor: 'rgba(27,94,32,0.10)',
        color: '#12372a',
        fontWeight: 850,
      }}
    />

    <Chip
      label={`GF ${stats?.goals_for ?? 0}`}
      size="small"
      sx={{
        borderRadius: 1.25,
        backgroundColor: 'rgba(245,158,11,0.12)',
        color: '#6b3f00',
        fontWeight: 850,
      }}
    />

    <Chip
      label={`GA ${stats?.goals_against ?? 0}`}
      size="small"
      sx={{
        borderRadius: 1.25,
        backgroundColor: 'rgba(180,83,9,0.10)',
        color: '#6b3f00',
        fontWeight: 850,
      }}
    />
  </>
)}
        </Box>

        <Typography
          variant="caption"
          sx={{
            mt: 'auto',
            color: selected ? '#8a5a00' : '#60756b',
            fontWeight: 800,
          }}
        >
          {selected ? 'Click another card to change selection' : 'Click to add this team'}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default KnockoutSelectCard;