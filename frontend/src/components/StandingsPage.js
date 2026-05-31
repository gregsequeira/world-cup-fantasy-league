import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
// Flags removed from standings display; names used instead

function StandingsPage() {
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/standings')
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

  // Group teams by group_name
  const grouped = standings.reduce((acc, team) => {
    if (!acc[team.group_name]) acc[team.group_name] = [];
    acc[team.group_name].push({ ...team, flag_code: normalizeFlagCode(team.flag_code) });
    return acc;
  }, {});

  // Keep groups in alphabetical order (Group A .. Group L)
  const sortedGroups = Object.keys(grouped).sort((a, b) => a.localeCompare(b));

  const sortedTeams = (teams) => {
    // If no games played in this group (all teams have played 0), order by ranking.
    const allNotPlayed = teams.every(t => (t.played ?? 0) === 0);
    if (allNotPlayed) {
      return teams.slice().sort((a, b) => {
        const ra = a.ranking != null ? a.ranking : Number.MAX_SAFE_INTEGER;
        const rb = b.ranking != null ? b.ranking : Number.MAX_SAFE_INTEGER;
        return ra - rb;
      });
    }

    // Otherwise order by points (desc), then goal_difference (desc), then ranking (asc)
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
    <Box sx={{ p: 3, maxWidth: 1120, mx: 'auto', backgroundImage: 'url(/images/background1.png)', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: 'cover', backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 4 }}>
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'start' }}>
        {sortedGroups.map(group => (
          <Paper
            key={group}
            sx={{
              p: 2,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(168,168,168,0.95) 0%, rgba(125,158,147,0.95) 50%, rgba(107,143,132,0.95) 100%)',
              color: '#fff',
              minWidth: 0,
              border: '1px solid rgba(255,255,255,0.18)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 800, textAlign: 'center', fontSize: { xs: '1rem', md: '1.1rem' } }}>
              {group}
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 0 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: '#f3f7f2', fontSize: '0.78rem', py: 1 }}>Team</TableCell>
                  <TableCell align="center" sx={{ color: '#f3f7f2', fontSize: '0.78rem', py: 1 }}>P</TableCell>
                  <TableCell align="center" sx={{ color: '#f3f7f2', fontSize: '0.78rem', py: 1 }}>W</TableCell>
                  <TableCell align="center" sx={{ color: '#f3f7f2', fontSize: '0.78rem', py: 1 }}>D</TableCell>
                  <TableCell align="center" sx={{ color: '#f3f7f2', fontSize: '0.78rem', py: 1 }}>L</TableCell>
                  <TableCell align="center" sx={{ color: '#f3f7f2', fontSize: '0.78rem', py: 1 }}>GF</TableCell>
                  <TableCell align="center" sx={{ color: '#f3f7f2', fontSize: '0.78rem', py: 1 }}>GA</TableCell>
                  <TableCell align="center" sx={{ color: '#f3f7f2', fontSize: '0.78rem', py: 1 }}>GD</TableCell>
                  <TableCell align="center" sx={{ color: '#f3f7f2', fontSize: '0.78rem', py: 1 }}>Pts</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedTeams(grouped[group]).map(team => (
                  <TableRow key={team.team_id} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(255,255,255,0.08)' } }}>
                    <TableCell sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', py: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} aria-label={team.team_name}>
                              <Typography
                                sx={{
                                  fontWeight: 400,
                                  fontSize: { xs: '0.72rem', md: '0.82rem' },
                                  textAlign: 'center',
                                  maxWidth: { xs: 80, md: 120 },
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                                title={team.team_name}
                              >
                                {team.team_name}
                              </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', py: 1, fontSize: '0.85rem' }}>{team.played}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', py: 1, fontSize: '0.85rem' }}>{team.won}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', py: 1, fontSize: '0.85rem' }}>{team.drawn}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', py: 1, fontSize: '0.85rem' }}>{team.lost}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', py: 1, fontSize: '0.85rem' }}>{team.goals_for}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', py: 1, fontSize: '0.85rem' }}>{team.goals_against}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.15)', py: 1, fontSize: '0.85rem' }}>{team.goal_difference}</TableCell>
                    <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold', borderColor: 'rgba(255,255,255,0.15)', py: 1, fontSize: '0.9rem' }}>{team.points}</TableCell>
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
