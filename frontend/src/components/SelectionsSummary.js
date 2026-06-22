import React from 'react';
import { Box, Card, CardContent, Typography, Button, Chip } from '@mui/material';
import Flag from 'react-world-flags';

const roles = ['Favourite', 'Team 1', 'Team 2', 'Team 3'];

const roleMeta = {
  Favourite: {
    header: 'Favourite Pick',
    empty: 'Click here to select your favourite team',
    accent: 'gold',
  },
  'Team 1': {
    header: 'Knockout Team',
    empty: 'Select from the teams below',
    accent: 'green',
  },
  'Team 2': {
    header: 'Knockout Team',
    empty: 'Select from the teams below',
    accent: 'green',
  },
  'Team 3': {
    header: 'Knockout Team',
    empty: 'Select from the teams below',
    accent: 'green',
  },
};

const SelectionsSummary = ({
  selections,
  teams,
  onRemove,
  onFavouriteClick,
  onSave,
  selectionsClosed = false,
  hasUnsavedChanges = false
}) => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.75 },
        mb: 4,
        borderRadius: 2,
        background:
          'linear-gradient(135deg, rgba(15,61,46,0.94) 0%, rgba(27,94,32,0.66) 48%, rgba(245,158,11,0.24) 100%)',
        border: '1px solid rgba(255,255,255,0.22)',
        boxShadow: '0 18px 50px rgba(15,23,42,0.16)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 950,
          mb: 0.75,
          color: '#fff',
          textAlign: 'center',
          textShadow: '0 3px 12px rgba(0,0,0,0.28)',
        }}
      >
        Your Knockout Picks
      </Typography>

      <Typography
        variant="body2"
        sx={{
          mb: 2.5,
          color: 'rgba(255,255,255,0.78)',
          textAlign: 'center',
          fontWeight: 700,
        }}
      >
        Choose one favourite and three additional knockout teams.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: 2,
        }}
      >
        {roles.map(role => {
          const teamId = selections[role];
          const team = teams.find(t => t.id === teamId);
          const isFavourite = role === 'Favourite';
          const meta = roleMeta[role];
          const isGold = meta.accent === 'gold';

          return (
            <Card
              key={role}
              elevation={0}
              onClick={() => {
                if (isFavourite && !selectionsClosed) onFavouriteClick();
              }}
              sx={{
                minHeight: 340,
                borderRadius: 2,
                textAlign: 'center',
                overflow: 'hidden',
                position: 'relative',
                background: team
                  ? isGold
                    ? 'linear-gradient(145deg, rgba(255,248,225,0.98) 0%, rgba(217,251,232,0.96) 60%, rgba(255,255,255,0.92) 100%)'
                    : 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(232,245,233,0.88) 56%, rgba(217,251,232,0.76) 100%)'
                  : 'linear-gradient(145deg, rgba(255,255,255,0.72) 0%, rgba(238,247,242,0.66) 100%)',
                border: isGold
                  ? '1px solid rgba(245,158,11,0.62)'
                  : '1px solid rgba(217,251,232,0.42)',
                boxShadow: team
                  ? '0 14px 32px rgba(15,23,42,0.16), inset 0 1px 0 rgba(255,255,255,0.58)'
                  : '0 10px 24px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.42)',
                cursor: isFavourite && !selectionsClosed ? 'pointer' : 'default',
                transition: isFavourite && !selectionsClosed
                  ? 'transform 0.18s ease, box-shadow 0.18s ease'
                  : 'none',
                '&:hover': isFavourite && !selectionsClosed
                  ? {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 18px 38px rgba(15,23,42,0.2), inset 0 1px 0 rgba(255,255,255,0.62)',
                    }
                  : {},
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
                  {meta.header}
                </Typography>
              </Box>

              <CardContent
                sx={{
                  height: '100%',
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
                        mb: 1.5,
                      }}
                    >
                      <Chip label={`Rank ${team.ranking ?? '-'}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(15,118,110,0.10)', color: '#12372a', fontWeight: 850 }} />
                      <Chip label={`Wins ${team.wins ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(27,94,32,0.10)', color: '#12372a', fontWeight: 850 }} />
                      <Chip label={`GF ${team.goals_for ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(245,158,11,0.12)', color: '#6b3f00', fontWeight: 850 }} />
                      <Chip label={`GA ${team.goals_against ?? 0}`} size="small" sx={{ borderRadius: 1.25, backgroundColor: 'rgba(180,83,9,0.10)', color: '#6b3f00', fontWeight: 850 }} />
                    </Box>

                    {!selectionsClosed && (
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          mt: 1.5,
                          borderRadius: 1.5,
                          textTransform: 'none',
                          fontWeight: 900,
                          color: '#fff',
                          backgroundColor: '#b42318',
                          boxShadow: '0 8px 18px rgba(180,35,24,0.22)',
                          '&:hover': {
                            backgroundColor: '#8f1d13',
                            boxShadow: '0 10px 22px rgba(180,35,24,0.28)',
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(role, team.id);
                        }}
                      >
                        Remove
                      </Button>
                    )}
                  </>
                ) : (
                  <Box
                    sx={{
                      flex: 1,
                      width: '100%',
                      minHeight: 170,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 1.5,
                      background: isGold
                        ? 'rgba(255,243,205,0.44)'
                        : 'rgba(217,251,232,0.34)',
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
                        lineHeight: 1.35,
                      }}
                    >
                      {selectionsClosed ? 'Selections are closed' : meta.empty}
                    </Typography>

                    {isFavourite && !selectionsClosed && (
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 1,
                          color: '#8a5a00',
                          fontWeight: 800,
                        }}
                      >
                        Opens team picker
                      </Typography>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={onSave}
          disabled={selectionsClosed || !hasUnsavedChanges}
          sx={{
            width: { xs: '100%', sm: '66%', md: 420 },
            py: { xs: 1.35, md: 1.6 },
            fontWeight: 900,
            borderRadius: 1.5,
            textTransform: 'none',
            backgroundColor: '#0f766e',
            boxShadow: '0 12px 26px rgba(15,118,110,0.28)',
            fontSize: { xs: '1rem', md: '1.08rem' },
            '&:hover': {
              backgroundColor: '#0b625c',
            },
            '&.Mui-disabled': {
              backgroundColor: 'rgba(255,255,255,0.22)',
              color: 'rgba(255,255,255,0.62)',
              boxShadow: 'none',
            },
          }}
        >
          Save Selections
        </Button>
      </Box>
    </Box>
  );
};

export default SelectionsSummary;