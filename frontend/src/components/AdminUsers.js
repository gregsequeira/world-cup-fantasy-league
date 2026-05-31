import React, { useEffect, useState } from 'react';
import { 
  Card, CardContent, Typography, Table, TableHead, TableRow, TableCell, TableBody, 
  Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, 
  Box, Tabs, Tab, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState({ pending: [], verified: [] }); // ✅ separate lists
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [tab, setTab] = useState(0); // 0 = pending, 1 = verified
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    setLoading(true);
    Promise.all([
      axios.get('http://localhost:5000/auth/pending-users', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      axios.get('http://localhost:5000/auth/verified-users', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])
      .then(([pendingRes, verifiedRes]) => {
        setUsers({
          pending: pendingRes.data,
          verified: verifiedRes.data
        });
      })
      .catch(err => {
        console.error('Failed to fetch users', err);
        setUsers({ pending: [], verified: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleVerifyClick = (user) => {
    setSelectedUser(user);
    setOpenConfirm(true);
  };

  const handleConfirmVerify = () => {
    if (!selectedUser) return;
    const token = localStorage.getItem('token');

    axios.post(`http://localhost:5000/auth/verify/${selectedUser.id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        // ✅ Move user from pending → verified
        setUsers(prev => ({
          pending: prev.pending.filter(u => u.id !== res.data.id),
          verified: [...prev.verified, res.data]
        }));
        setSnackbar({ open: true, message: `User ${res.data.name} verified successfully!`, severity: 'success' });
      })
      .catch(err => {
        console.error('Verification failed', err);
        setSnackbar({ open: true, message: 'Verification failed. Please try again.', severity: 'error' });
      })
      .finally(() => {
        setOpenConfirm(false);
        setSelectedUser(null);
      });
  };

  const filteredUsers = tab === 0 ? users.pending : users.verified;

  return (
    <Card sx={{ mt: 3, borderRadius: 3, boxShadow: 8, border: '2px solid #00FFCC', background: 'linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(30,41,59,0.75) 100%)', color: '#fff', backdropFilter: 'blur(8px)', p: 2 }}>
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#00FFCC' }}>
          Manage Users
        </Typography>

        <Tabs 
          value={tab} 
          onChange={(e, newVal) => setTab(newVal)} 
          sx={{ 
            mb: 2,
            '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)' }, // inactive tabs
            '& .Mui-selected': { color: '#00FFCC !important' },   // active tab
            '& .MuiTabs-indicator': { backgroundColor: '#00FFCC' } // underline accent
          }}
        >
          <Tab label="Pending Users" />
          <Tab label="Verified Users" />
        </Tabs>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: '#00FFCC' }} />
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Typography variant="body1" sx={{ textAlign: 'center', color: '#FFD700', fontWeight: 'bold' }}>
            {tab === 0 ? 'No pending users 🎉' : 'No verified users yet'}
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC' }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC' }}>Contact Number</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC' }}>Verified</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: '#00FFCC' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map(user => (
                <TableRow 
                  key={user.id}
                  sx={{
                    backgroundColor: 'rgba(0,255,204,0.08)',
                    '&:hover': { backgroundColor: 'rgba(0,255,204,0.18)' }
                  }}
                >
                  <TableCell sx={{ color: '#fff' }}>{user.name}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{user.email}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{user.contact_number || '—'}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{user.role}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{user.verified ? '✅ Yes' : '❌ No'}</TableCell>
                  <TableCell>
                    {!user.verified && (
                      <Button 
                        variant="contained" 
                        sx={{
                          backgroundColor: '#00FFCC',
                          color: '#000',
                          fontWeight: 'bold',
                          '&:hover': { backgroundColor: '#00e6b8' }
                        }}
                        onClick={() => handleVerifyClick(user)}
                      >
                        Verify
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>Confirm Verification</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to verify <strong>{selectedUser?.name}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenConfirm(false)} color="secondary">Cancel</Button>
          <Button onClick={handleConfirmVerify} sx={{ backgroundColor: '#00FFCC', color: '#000', fontWeight: 'bold' }} variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default AdminUsers;
