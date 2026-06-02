import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

function StandingsPage() {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    axios.get('/standings')
      .then(res => setStandings(res.data))
      .catch(err => console.error(err));
  }, []);

  const normalizeFlagCode = (code) => {
    if (!code) return undefined;
    const cleaned = code.toString().trim().toUpperCase();
    if (cleaned.length === 2) return cleaned;
    if (cleaned.length === 3) return cleaned.slice(0, 2);
    return cleaned;
  };

  const grouped = standings.reduce((acc, team) => {
    if (!acc[team.group_name]) acc[team.group_name] = [];
    acc[team.group_name].push({ ...team, flag_code: normalizeFlagCode(team.flag_code) });
    return acc;
  }, {});

  const sortedGroups = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  const sortedTeams = (teams) => {
    const allNotPlayed = teams.every(t => (t.played ?? 0) === 0);
    if (allNotPlayed) {
      return teams.slice().sort((a, b) => {
        const ra = a.ranking != null ? a.ranking : Number.MAX_SAFE_INTEGER;
        const rb = b.ranking != null ? b.ranking : Number.MAX_SAFE_INTEGER;
        return ra - rb;
      });
    }
    return teams.slice().sort((a, b) => {
      const pa = a.points ?? 0;
      const pb = b.points ?? 0;
      if (pb !== pa) return pb - pa;
      const gda = a.goal_difference ?? 0;
      const gdb = b.goal_difference ?? 0;
      if (gdb !== gda) return gdb - gda;
      const ra = a.ranking != null ? a.ranking : Number.MAX_SAFE_INTEGER;
      const rb = b.ranking != null ? b.ranking : Number.MAX_SAFE_INTEGER;
      return ra - rb;
    });
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        maxWidth: 1120,
        mx: 'auto',
        backgroundImage: 'url(/images/background1.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundColor: 'rgba(255,255,255,0.16)',
        borderRadius: 4
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          alignItems: 'start'
        }}
      >
        {sortedGroups.map(group => (
          <Paper
            key={group}
            sx={{
              p: { xs: 1.5, md: 2 },
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(168,168,168,0.95) 0%, rgba(125,158,147,0.95) 50%, rgba(107,143,132,0.95) 100%)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.18)',
              minWidth: 0
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 1.5,
                fontWeight: 800,
                textAlign: 'center',
                fontSize: { xs: '0.95rem', md: '1.1rem' }
              }}
            >
              {group}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table size="small" sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow>
                    {['Team','P','W','D','L','GF','GA','GD','Pts'].map(col => (
                      <TableCell
                        key={col}
                        align={col === 'Team' ? 'left' : 'center'}
                        sx={{
                          color: '#f3f7f2',
                          fontSize: { xs: '0.7rem', md: '0.78rem' },
                          py: { xs: 0.5, md: 1 }
                        }}
                      >
                        {col}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTeams(grouped[group]).map(team => (
                    <TableRow
                      key={team.team_id}
                      sx={{
                        '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.08)' }
                      }}
                    >
                      <TableCell
                        sx={{
                          color: '#fff',
                          borderColor: 'rgba(255,255,255,0.15)',
                          py: { xs: 0.5, md: 1 }
                        }}
                      >
                        <Typography
                          sx={{
                            fontWeight: 400,
                            fontSize: { xs: '0.7rem', md: '0.82rem' },
                            maxWidth: { xs: 90, md: 140 },
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                          title={team.team_name}
                        >
                          {team.team_name}
                        </Typography>
                      </TableCell>
                      {[team.played, team.won, team.drawn, team.lost, team.goals_for, team.goals_against, team.goal_difference, team.points].map((val, idx) => (
                        <TableCell
                          key={idx}
                          align="center"
                          sx={{
                            color: '#fff',
                            borderColor: 'rgba(255,255,255,0.15)',
                            py: { xs: 0.5, md: 1 },
                            fontSize: { xs: '0.75rem', md: '0.85rem' },
                            fontWeight: idx === 7 ? 'bold' : 'normal'
                          }}
                        >
                          {val}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default StandingsPage;
