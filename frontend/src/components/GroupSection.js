import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import KnockoutSelectCard from './KnockoutSelectCard';

const GroupSection = ({ title, teams, selections, onSelect }) => {
  const hasTeam = teams && teams.length > 0;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, rgba(15,61,46,0.84) 0%, rgba(27,94,32,0.56) 55%, rgba(245,158,11,0.18) 100%)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 16px 38px rgba(15,23,42,0.18)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box
        sx={{
          px: 1.5,
          py: 1,
          background: 'rgba(7, 38, 28, 0.78)',
          borderBottom: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            color: '#d9fbe8',
            fontWeight: 900,
            textAlign: 'center',
            letterSpacing: 0,
            fontSize: '0.78rem',
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box sx={{ p: 1.25 }}>
        {hasTeam ? (
          teams.map(team => {
            const selected = Object.values(selections).includes(team.id);

            return (
              <KnockoutSelectCard
                key={team.id}
                team={team}
                selected={selected}
                onClick={teamId => {
                  if (!selected) onSelect(teamId);
                }}
              />
            );
          })
        ) : (
          <Box
            sx={{
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 1.5,
              background: 'rgba(255,255,255,0.12)',
              border: '1px dashed rgba(217,251,232,0.35)',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.78)',
                textAlign: 'center',
                fontWeight: 700,
              }}
            >
              Awaiting team...
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default GroupSection;
