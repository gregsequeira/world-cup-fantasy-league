import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Flag from 'react-world-flags';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import axios from '../axiosConfig';

const groupRoleOrder = ['Favourite', 'Seeded', 'DarkHorse', 'Underdog'];
const knockoutRoleOrder = ['KOFavourite', 'KO1', 'KO2', 'KO3'];

const roleLabels = {
  Favourite: 'Favourite',
  Seeded: 'Seeded',
  DarkHorse: 'Dark Horse',
  Underdog: 'Underdog',
  KOFavourite: 'KO Favourite',
  KO1: 'KO Team 1',
  KO2: 'KO Team 2',
  KO3: 'KO Team 3',
};

const getSelectionByRole = (selections = [], role) => {
  return selections.find(sel => sel.role === role);
};

const toNumber = (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? 0 : number;
};

const TeamPointsChip = ({ selection, role }) => {
  if (!selection) {
    return (
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(255,255,255,0.45)',
          fontSize: { xs: '0.65rem', md: '0.75rem' },
        }}
      >
        -
      </Typography>
    );
  }

  const eliminated = selection?.eliminated ?? false;

  return (
    <Box
      title={`${roleLabels[role]}: ${selection.team_name} - ${selection.points} pts`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.65,
        px: 0.75,
        py: 0.5,
        borderRadius: 1.5,
        background: eliminated 
          ? 'rgba(110,110,110,0.22)'
          : 'rgba(217,251,232,0.12)',
        border: eliminated
          ? '1px solid rgba(170,170,170,0.35)'
          : '1px solid rgba(217,251,232,0.22)',
        width: 174,
        whiteSpace: 'nowrap',
        opacity: eliminated ? 0.65 : 1,
        transition: 'all 0.25s ease',
      }}
    >
      {selection.flag_code && (
        <Flag
          code={selection.flag_code}
          style={{
            filter: eliminated ? 'grayscale(100%)' : 'none',
            opacity: eliminated ? 0.55 : 1,
            width: 28,
            height: 18,
            objectFit: 'cover',
            borderRadius: 2,
            flexShrink: 0,
            boxShadow: '0 0 0 1px rgba(255,255,255,0.25)',
          }}
        />
      )}

      <Typography
        variant="caption"
        sx={{
          color: '#fff',
          fontSize: { xs: '0.62rem', md: '0.72rem' },
          fontWeight: 750,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          minWidth: 0,
          flex: 1,
          textAlign: 'left',
        }}
      >
        {selection.team_name}
      </Typography>

      <Chip
    label={toNumber(selection.points)}
    size="small"
    sx={{
        height: 20,
        minWidth: 28,
        borderRadius: 1,
        backgroundColor: '#fff3cd',
        color: '#8a5a00',
        fontWeight: 900,
        fontSize: '0.65rem',
        '& .MuiChip-label': {
            px: 0.75,
        },
    }}
/>

{eliminated && (
    <Chip
        label="OUT"
        icon={<CloseIcon />}
        size="small"
        sx={{
            ml: 0.4,
            height: 18,
            backgroundColor: '#616161',
            color: '#fff',
            fontWeight: 900,
            fontSize: '0.55rem',
        }}
    />
)}
    </Box>
  );
};


const OverallLeaderboard = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get('/user-scores/details')
      .then(res => {
        const verified = res.data
          .filter(user => user.verified)
          .sort((a, b) => {
            const pointsDiff = toNumber(b.total_points) - toNumber(a.total_points);
            if (pointsDiff !== 0) return pointsDiff;

            return toNumber(b.total_goal_difference) - toNumber(a.total_goal_difference);
          });

        setScores(verified);
      })
      .catch(() => setScores([]))
      .finally(() => setLoading(false));
  }, []);

  const displayPhase = scores[0]?.display_phase || 'group';
  const showKnockoutView = displayPhase === 'knockout';

  const maxPoints = scores.length > 0
    ? Math.max(...scores.map(user => toNumber(user.total_points)))
    : 0;

  const maxGD = scores.length > 0
    ? Math.max(
        ...scores
          .filter(user => toNumber(user.total_points) === maxPoints)
          .map(user => toNumber(user.total_goal_difference))
      )
    : 0;

  const leaderCount = scores.filter(user =>
    toNumber(user.total_points) === maxPoints &&
    toNumber(user.total_goal_difference) === maxGD
  ).length;

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          background:
            'linear-gradient(135deg, rgba(15,61,46,0.94) 0%, rgba(27,94,32,0.66) 48%, rgba(245,158,11,0.24) 100%)',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.22)',
          boxShadow: '0 18px 50px rgba(15,23,42,0.16)',
          backdropFilter: 'blur(10px)',
          mb: 4,
        }}
      >
        <Box
          sx={{
            px: { xs: 1.5, md: 2 },
            py: 1.25,
            background: 'rgba(7,38,28,0.72)',
            borderBottom: '1px solid rgba(255,255,255,0.14)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{
                color: '#d9fbe8',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: 0,
                display: 'block',
              }}
            >
              Overall Leaderboard
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: 'rgba(217,251,232,0.72)',
                fontWeight: 700,
              }}
            >
              {showKnockoutView
                ? 'Group totals locked in, knockout picks shown separately'
                : 'Group stage picks and points'}
            </Typography>
          </Box>

          {scores.length > 0 && (
            <Chip
              icon={<EmojiEventsIcon sx={{ color: '#8a5a00 !important', fontSize: '0.9rem' }} />}
              label={leaderCount > 1 ? `${leaderCount} tied leaders` : 'Current leader'}
              size="small"
              sx={{
                height: 24,
                borderRadius: 1.25,
                backgroundColor: '#fff3cd',
                color: '#8a5a00',
                fontWeight: 900,
                fontSize: '0.68rem',
              }}
            />
          )}
        </Box>

        <CardContent sx={{ p: { xs: 1, md: 2 } }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress sx={{ color: '#fff7d6' }} />
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: showKnockoutView ? 1120 : 1020 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                      Rank
                    </TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                      User
                    </TableCell>

                    {showKnockoutView ? (
                      <>
                        

                        

                        {knockoutRoleOrder.map(role => (
                          <TableCell key={role} align="center" sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                            {roleLabels[role]}
                          </TableCell>
                        ))}

                        <TableCell align="center" sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                          KO Pts
                        </TableCell>
                      </>
                    ) : (
                      groupRoleOrder.map(role => (
                        <TableCell key={role} align="center" sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                          {roleLabels[role]}
                        </TableCell>
                      ))
                    )}

                    <TableCell align="center" sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                          Group Pts
                        </TableCell>

                    <TableCell align="center" sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                      Total
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, color: '#d9fbe8', borderColor: 'rgba(255,255,255,0.14)', fontSize: { xs: '0.72rem', md: '0.82rem' } }}>
                      GD
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {scores.map((user, index) => {
                    const userPoints = toNumber(user.total_points);
                    const userGD = toNumber(user.total_goal_difference);
                    const isLeader = userPoints === maxPoints && userGD === maxGD;
                    const groupSelections = user.group_selections || user.selections || [];
                    const knockoutSelections = user.knockout_selections || [];

                    return (
                      <TableRow
                        key={user.user_id}
                        sx={{
                          backgroundColor: isLeader ? 'rgba(255,243,205,0.22)' : 'transparent',
                          boxShadow: isLeader ? 'inset 4px 0 0 #f59e0b' : 'none',
                          '& td': {
                            borderColor: 'rgba(255,255,255,0.10)',
                          },
                        }}
                      >
                        <TableCell sx={{ color: '#fff', fontWeight: isLeader ? 900 : 750, fontSize: { xs: '0.74rem', md: '0.84rem' } }}>
                          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, minWidth: 42 }}>
                            <span>{index + 1}</span>
                            {isLeader && (
                              <EmojiEventsIcon
                                sx={{
                                  fontSize: '1rem',
                                  color: '#facc15',
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ color: '#fff', fontWeight: isLeader ? 900 : 750, fontSize: { xs: '0.74rem', md: '0.84rem' } }}>
                          {user.user_name}
                        </TableCell>

                        {showKnockoutView ? (
                          <>
                            

                            {knockoutRoleOrder.map(role => (
                              <TableCell key={role} align="center" sx={{ color: '#fff', minWidth: 184 }}>
                                <TeamPointsChip
                                  selection={getSelectionByRole(knockoutSelections, role)}
                                  role={role}
                                />
                              </TableCell>
                            ))}

                            <TableCell align="center" sx={{ color: '#fff7d6', fontWeight: 950, fontSize: { xs: '0.78rem', md: '0.9rem' } }}>
                              {toNumber(user.knockout_points)}
                            </TableCell>
                          </>
                        ) : (
                          groupRoleOrder.map(role => (
                            <TableCell key={role} align="center" sx={{ color: '#fff', minWidth: 184 }}>
                              <TeamPointsChip
                                selection={getSelectionByRole(groupSelections, role)}
                                role={role}
                              />
                            </TableCell>
                          ))
                        )}

                        <TableCell align="center" sx={{ color: '#fff7d6', fontWeight: 950, fontSize: { xs: '0.78rem', md: '0.9rem' } }}>
                              {toNumber(user.group_points)}
                            </TableCell>

                        <TableCell align="center" sx={{ color: '#fff7d6', fontWeight: 950, fontSize: { xs: '0.78rem', md: '0.9rem' } }}>
                          {userPoints}
                        </TableCell>

                        <TableCell align="center" sx={{ color: '#fff', fontWeight: 850, fontSize: { xs: '0.78rem', md: '0.9rem' } }}>
                          {userGD}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {scores.length === 0 && (
                <Box
                  sx={{
                    p: 2,
                    mt: 1,
                    borderRadius: 1.5,
                    background: 'rgba(255,255,255,0.10)',
                    textAlign: 'center',
                  }}
                >
                  <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontWeight: 800 }}>
                    No leaderboard entries yet.
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OverallLeaderboard;