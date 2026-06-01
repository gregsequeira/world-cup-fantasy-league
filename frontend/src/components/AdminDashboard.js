// src/components/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from '../axiosConfig';

function AdminDashboard() {
  const [stats, setStats] = useState({
    pendingUsers: 0,
    verifiedUsers: 0,
    completedMatches: 0,
    upcomingFixtures: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get('/auth/pending-users', { headers }),
      axios.get('/auth/verified-users', { headers }),
      axios.get('/fixtures'),
    ])
      .then(([pendingRes, verifiedRes, fixturesRes]) => {
        const fixtures = fixturesRes.data || [];
        const completedMatches = fixtures.filter(f => f.status === 'Completed').length;
        const upcomingFixtures = fixtures.filter(f => f.status !== 'Completed').length;

        setStats({
          pendingUsers: pendingRes.data.length,
          verifiedUsers: verifiedRes.data.length,
          completedMatches,
          upcomingFixtures,
        });
      })
      .catch(err => console.error('Failed to fetch stats', err));
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#00FFCC' }}>
        Admin Dashboard
      </Typography>

      {/* ✅ Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Pending Users', value: stats.pendingUsers },
          { label: 'Verified Users', value: stats.verifiedUsers },
          { label: 'Completed Matches', value: stats.completedMatches },
          { label: 'Upcoming Fixtures', value: stats.upcomingFixtures },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Card sx={{ borderRadius: 3, boxShadow: 6, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#fff' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: '#00FFCC', fontWeight: 'bold' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2">{stat.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ✅ Action Cards */}
      <Grid container spacing={3}>
        {/* User Management */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 6, border: '2px solid #00FFCC' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>User Management</Typography>
              <Button component={Link} to="/admin/users" variant="contained"
                sx={{ backgroundColor: '#00FFCC', color: '#000', fontWeight: 'bold', mr: 2 }}>
                Verify Users
              </Button>
              <Button component={Link} to="/admin/promote" variant="outlined"
                sx={{ borderColor: '#00FFCC', color: '#00FFCC', fontWeight: 'bold' }}>
                Promote Users
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Match Results */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: 6, border: '2px solid #00FFCC' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Match Results</Typography>
              <Button component={Link} to="/results" variant="contained"
                sx={{ backgroundColor: '#00FFCC', color: '#000', fontWeight: 'bold', mr: 2 }}>
                Enter Results
              </Button>
              <Button component={Link} to="/fixtures/manage" variant="outlined"
                sx={{ borderColor: '#00FFCC', color: '#00FFCC', fontWeight: 'bold' }}>
                Manage Fixtures
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AdminDashboard;
