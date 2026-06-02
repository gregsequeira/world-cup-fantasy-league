import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Box, Typography, Button, Card, CardContent, Divider, Modal } from '@mui/material';
import Flag from 'react-world-flags';

function TeamsSelectionPage() {
  const [teams, setTeams] = useState([]); 
  const [selections, setSelections] = useState({ Favourite: null, Seeded: null, 'Dark Horse': null, Underdog: null });
  const [cutoff, setCutoff] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [openFavouriteModal, setOpenFavouriteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [saveModalMessage, setSaveModalMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('/teams').then(res => setTeams(res.data));

    axios.get('/userSelections/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const data = res.data;
        setSelections({
          Favourite: data.favourite_team_id || null,
          Seeded: data.seeded_team_id || null,
          'Dark Horse': data.dark_horse_team_id || null,
          Underdog: data.underdog_team_id || null
        });
      });

    axios.get('/cutoff').then(res => setCutoff(new Date(res.data.cutoff)));
  }, []);

  useEffect(() => {
    if (!cutoff) return;
    const interval = setInterval(() => {
      const diff = cutoff - new Date();
      if (diff <= 0) {
        setTimeLeft('Selections closed');
        clearInterval(interval);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        const h = String(hours).padStart(2, '0');
        const m = String(minutes).padStart(2, '0');
        const s = String(seconds).padStart(2, '0');

        if (days > 0) {
          setTimeLeft(`${days} days - ${h} hrs - ${m} mins - ${s} secs`);
        } else {
          setTimeLeft(`${h}:${m}:${s}`);
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [cutoff]);

  const toggleSelection = (role, teamId) => {
    if (timeLeft === 'Selections closed') return;
    setSelections(prev => ({
      ...prev,
      [role]: prev[role] === teamId ? null : teamId
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setSaveModalMessage('❌ No token found, please log in again');
      setOpenSaveModal(true);
      return;
    }
    if (!selections.Favourite && !selections.Seeded && !selections['Dark Horse'] && !selections.Underdog) {
      setSaveModalMessage('❌ Please select at least one team');
      setOpenSaveModal(true);
      return;
    }
    try {
      await axios.post('/userSelections/select', {
        favouriteId: selections.Favourite,
        seededId: selections.Seeded,
        darkHorseId: selections['Dark Horse'],
        underdogId: selections.Underdog
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSaveModalMessage('✅ Selections saved successfully');
      setOpenSaveModal(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setSaveModalMessage('❌ Failed to save selections');
      setOpenSaveModal(true);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Countdown */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          my: 4,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
          boxShadow: 6,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            mb: 2,
            textTransform: 'uppercase',
            color: '#FFD700',
            letterSpacing: 2,
            fontSize: { xs: '1rem', md: '1.25rem' }
          }}
        >
          Team Selection Deadline
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'monospace',
            color: timeLeft === 'Selections closed' ? 'error.main' : '#FFFFFF',
            animation: timeLeft !== 'Selections closed' ? 'pulse 1s infinite' : 'none',
            fontSize: { xs: '1.2rem', md: '2rem' },
            '@keyframes pulse': {
              '0%': { opacity: 1 },
              '50%': { opacity: 0.6 },
              '100%': { opacity: 1 },
            },
          }}
        >
          {timeLeft}
        </Typography>
      </Box>
            {/* User Selections */}
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
          boxShadow: 6,
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {['Favourite','Seeded','Dark Horse','Underdog'].map(role => {
            const teamId = selections[role];
            const team = teams.find(t => t.id === teamId);

            return (
              <Card
                key={role}
                onClick={() => {
                  if (role === 'Favourite' && timeLeft !== 'Selections closed') {
                    setOpenFavouriteModal(true);
                  }
                }}
                sx={{
                  textAlign: 'center',
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #f0f0f0 0%, #d9e4dd 50%, #cfd8dc 100%)',
                  boxShadow: 4,
                  p: 2,
                  cursor: role === 'Favourite' && timeLeft !== 'Selections closed' ? 'pointer' : 'default',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: role === 'Favourite' && timeLeft !== 'Selections closed' ? 8 : 4,
                  },
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  {role}
                </Typography>
                {team ? (
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Flag code={team.flag_code} style={{ width: 60, height: 40, marginBottom: 8 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {team.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ranking: {team.ranking}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ mt: 2 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelection(role, team.id);
                      }}
                      disabled={timeLeft === 'Selections closed'}
                    >
                      Remove
                    </Button>
                  </CardContent>
                ) : (
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color: role === 'Favourite' ? 'rgb(255, 0, 43)' : 'text.secondary',
                        fontStyle: 'italic',
                        fontWeight: role === 'Favourite' ? 'bold' : 'normal',
                        cursor: role === 'Favourite' && timeLeft !== 'Selections closed' ? 'pointer' : 'default',
                      }}
                    >
                      {role === 'Favourite' ? 'Click here to select your favourite team' : 'Select from the teams below'}
                    </Typography>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </Box>

        {/* Save Selections Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={timeLeft === 'Selections closed'}
            sx={{
              width: { xs: '100%', sm: '66%' },
              py: { xs: 1.5, md: 2 },
              fontWeight: 'bold',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #7FC8A9 0%, #4CAF50 100%)',
              boxShadow: 6,
              fontSize: { xs: '1rem', md: '1.2rem' },
              textAlign: 'center',
              '&:hover': {
                background: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
              },
            }}
          >
            Save Selections
          </Button>
        </Box>

        {/* Feedback modal */}
        <Modal
          open={openSaveModal}
          onClose={() => setOpenSaveModal(false)}
          aria-labelledby="save-modal-title"
          aria-describedby="save-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
              minWidth: { xs: 280, sm: 300 },
              textAlign: 'center',
            }}
          >
            <Typography id="save-modal-title" variant="h6">
              Team Selection Status
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography 
              id="save-modal-description"
              sx={{
                fontWeight: 'bold',
                color: saveModalMessage.includes('✅') ? 'success.main' : 'error.main', 
              }}
            >
              {saveModalMessage}
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => setOpenSaveModal(false)}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
            {/* Category Cards */}
      {['Seeded','Dark Horse','Underdog'].map(role => (
        <Box
          key={role}
          sx={{
            mb: 5,
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            background: 'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
            boxShadow: 6,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              mb: 3,
              fontWeight: 'bold',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: 2,
              color: '#FFD700',
              fontSize: { xs: '1.2rem', md: '1.5rem' }
            }}
          >
            {role} Teams
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
              gap: 3,
              justifyItems: 'center',
            }}
          >
            {teams
              .filter(t => (!t.category || t.category === role) && !Object.values(selections).includes(t.id))
              .sort((a, b) => a.ranking - b.ranking)
              .map(team => {
                const selected = selections[role] === team.id;
                return (
                  <Card
                    key={team.id}
                    onClick={() => toggleSelection(role, team.id)}
                    sx={{
                      width: { xs: '100%', sm: 220 },
                      height: { xs: 'auto', sm: 220 },
                      cursor: timeLeft === 'Selections closed' ? 'not-allowed' : 'pointer',
                      border: selected ? '3px solid #7FC8A9' : '2px solid #7FC8A9',
                      boxShadow: selected ? 8 : 4,
                      borderRadius: 3,
                      textAlign: 'center',
                      background: 'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Flag code={team.flag_code} style={{ width: 60, height: 40, marginBottom: 8 }} />
                      <Typography variant="h6" sx={{ fontWeight: 'bold', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
                        {team.name}
                      </Typography>
                      <Divider sx={{ marginY: 1, width: '80%' }} />
                      <Typography variant="body2" color="text.secondary">Ranking: {team.ranking}</Typography>
                      <Typography variant="body2" color="text.secondary">Group: {team.group_name}</Typography>
                    </CardContent>
                  </Card>
                );
              })}
          </Box>
        </Box>
      ))}

      {/* Favourite Team Modal */}
      <Modal open={openFavouriteModal} onClose={() => setOpenFavouriteModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 600 },
            maxHeight: '80vh',
            overflowY: 'auto',
            borderRadius: 3,
            boxShadow: 24,
            p: { xs: 2, md: 4 },
            background: 'linear-gradient(135deg, #a8a8a8 0%, #7d9e93 50%, #6b8f84 100%)',
          }}
        >
          <Button
            onClick={() => setOpenFavouriteModal(false)}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: '#fff',
              backgroundColor: '#d32f2f',
              '&:hover': { backgroundColor: '#b71c1c' },
            }}
          >
            Close
          </Button>

          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: 'bold',
              textTransform: 'uppercase',
              color: '#FFD700',
              letterSpacing: 1,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            Select Favourite Team
          </Typography>

          {/* Search Bar */}
          <Box sx={{ mb: 3 }}>
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                fontSize: '16px',
              }}
            />
          </Box>

          {/* Team Grid */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {teams
              .filter(team =>
                team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                team.group_name?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => a.ranking - b.ranking)
              .map(team => (
                <Card
                  key={team.id}
                  onClick={() => {
                    toggleSelection('Favourite', team.id);
                    setOpenFavouriteModal(false);
                    setSearchTerm('');
                  }}
                  sx={{
                    width: { xs: '100%', sm: 180 },
                    cursor: 'pointer',
                    border: selections['Favourite'] === team.id ? '3px solid #7FC8A9' : '1px solid #ccc',
                    borderRadius: 2,
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    '&:hover': { boxShadow: 6 },
                  }}
                >
                  <CardContent>
                    <Flag code={team.flag_code} style={{ width: 50, height: 30, marginBottom: 8 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {team.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Ranking: {team.ranking}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}

export default TeamsSelectionPage;