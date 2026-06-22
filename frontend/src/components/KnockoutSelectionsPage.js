import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import {
  Box,
  Typography,
  Button,
  Modal,
  Divider,
  Paper,
  Card,
  CardContent
} from '@mui/material';
import Flag from 'react-world-flags';
import CountdownTimer from './CountdownTimer';
import SelectionsSummary from './SelectionsSummary';
import GroupSection from './GroupSection';

const emptySelections = {
  Favourite: null,
  'Team 1': null,
  'Team 2': null,
  'Team 3': null,
};

const KnockoutSelectionsPage = () => {
  const [teams, setTeams] = useState([]);
  const [selections, setSelections] = useState(emptySelections);
  const [savedSelections, setSavedSelections] = useState(emptySelections);
  const [cutoff, setCutoff] = useState(null);
  const [now, setNow] = useState(new Date());
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [saveModalMessage, setSaveModalMessage] = useState('');
  const [openFavouriteModal, setOpenFavouriteModal] = useState(false);

  const winnerSlots = [
    'Winner Group A',
    'Winner Group B',
    'Winner Group C',
    'Winner Group D',
    'Winner Group E',
    'Winner Group F',
    'Winner Group G',
    'Winner Group H',
    'Winner Group I',
    'Winner Group J',
    'Winner Group K',
    'Winner Group L'
  ];

  const runnerUpSlots = [
    'Runner-up Group A',
    'Runner-up Group B',
    'Runner-up Group C',
    'Runner-up Group D',
    'Runner-up Group E',
    'Runner-up Group F',
    'Runner-up Group G',
    'Runner-up Group H',
    'Runner-up Group I',
    'Runner-up Group J',
    'Runner-up Group K',
    'Runner-up Group L'
  ];

  const bestThirdSlots = [
    'Best 3rd Group A/B/C/D/F',
    'Best 3rd Group C/D/F/G/H',
    'Best 3rd Group C/E/F/H/I',
    'Best 3rd Group E/H/I/J/K',
    'Best 3rd Group B/E/F/I/J',
    'Best 3rd Group A/E/H/I/J',
    'Best 3rd Group E/F/G/I/J',
    'Best 3rd Group D/E/I/J/L'
  ];

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('/teams')
      .then(res => setTeams(res.data))
      .catch(err => console.error(err));

    axios.get('/userKnockout/my', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const data = res.data;

        const loadedSelections = {
          Favourite: data.ko_favourite_team_id || null,
          'Team 1': data.ko_team1_id || null,
          'Team 2': data.ko_team2_id || null,
          'Team 3': data.ko_team3_id || null,
        };

        setSelections(loadedSelections);
        setSavedSelections(loadedSelections);
      })
      .catch(err => console.error(err));

    axios.get('/cutoff')
      .then(res => setCutoff(new Date(res.data.cutoff)))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const selectionsClosed = cutoff ? now >= cutoff : false;
  const selectedTeamIds = Object.values(selections).filter(Boolean);
  const qualifiedTeams = teams.filter(team => team.knockout_slot);

  const hasUnsavedChanges =
    selections.Favourite !== savedSelections.Favourite ||
    selections['Team 1'] !== savedSelections['Team 1'] ||
    selections['Team 2'] !== savedSelections['Team 2'] ||
    selections['Team 3'] !== savedSelections['Team 3'];

  const handleSelect = (teamId) => {
    if (selectionsClosed) return;

    const slots = ['Team 1', 'Team 2', 'Team 3'];
    const alreadySelected = selectedTeamIds.includes(teamId);

    if (alreadySelected) return;

    const emptySlot = slots.find(slot => !selections[slot]);

    if (emptySlot) {
      setSelections(prev => ({ ...prev, [emptySlot]: teamId }));
    }
  };

  const handleRemove = (role) => {
    if (selectionsClosed) return;

    setSelections(prev => ({ ...prev, [role]: null }));
  };

  const handleFavouriteClick = () => {
    if (selectionsClosed) return;

    setOpenFavouriteModal(true);
  };

  const handleFavouriteSelect = (teamId) => {
    if (selectionsClosed) return;

    setSelections(prev => ({
      ...prev,
      Favourite: teamId
    }));

    setOpenFavouriteModal(false);
  };

  const handleSave = async () => {
    if (selectionsClosed || !hasUnsavedChanges) return;

    const token = localStorage.getItem('token');

    const selectionsToSave = {
      Favourite: selections.Favourite,
      'Team 1': selections['Team 1'],
      'Team 2': selections['Team 2'],
      'Team 3': selections['Team 3'],
    };

    try {
      await axios.post('/userKnockout/select', {
        koFavouriteId: selectionsToSave.Favourite,
        ko1Id: selectionsToSave['Team 1'],
        ko2Id: selectionsToSave['Team 2'],
        ko3Id: selectionsToSave['Team 3'],
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSavedSelections(selectionsToSave);
      setSaveModalMessage('Knockout selections saved successfully');
      setOpenSaveModal(true);
    } catch (err) {
      console.error(err.response?.data || err.message);
      setSaveModalMessage('Failed to save selections');
      setOpenSaveModal(true);
    }
  };

  const renderSlotsGrid = (slots, title) => (
    <Box sx={{ mt: { xs: 4, md: 5 } }}>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontWeight: 950,
          textAlign: 'center',
          color: '#fff',
          textShadow: '0 3px 12px rgba(0,0,0,0.28)',
          fontSize: { xs: '1.25rem', md: '1.55rem' },
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
          gap: { xs: 1.5, md: 2 },
        }}
      >
        {slots.map(slot => {
          const slotTeams = teams.filter(team => team.knockout_slot === slot);

          return (
            <GroupSection
              key={slot}
              title={slot}
              teams={slotTeams}
              selections={selections}
              onSelect={handleSelect}
            />
          );
        })}
      </Box>
    </Box>
  );

  const availableFavouriteTeams = qualifiedTeams.filter(team =>
    !selectedTeamIds.includes(team.id) || selections.Favourite === team.id
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage:
          'linear-gradient(180deg, rgba(244,251,247,0.82) 0%, rgba(15,61,46,0.62) 38%, rgba(15,61,46,0.86) 100%), url(/images/header.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        backgroundAttachment: { xs: 'scroll', md: 'fixed' },
        backgroundRepeat: 'no-repeat',
        px: { xs: 1.5, md: 4 },
        py: { xs: 3, md: 6 },
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Typography
          variant="h3"
          sx={{
            mb: { xs: 2, md: 3 },
            textAlign: 'center',
            color: '#fff',
            fontWeight: 950,
            fontSize: { xs: '1.75rem', md: '2.6rem' },
            textShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}
        >
          Knockout Selections
        </Typography>

        <CountdownTimer cutoff={cutoff} />

        <SelectionsSummary
          selections={selections}
          teams={teams}
          onRemove={handleRemove}
          onFavouriteClick={handleFavouriteClick}
          onSave={handleSave}
          selectionsClosed={selectionsClosed}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {renderSlotsGrid(winnerSlots, 'Group Winners')}
        {renderSlotsGrid(runnerUpSlots, 'Group Runners-up')}
        {renderSlotsGrid(bestThirdSlots, 'Best 3rd Place Teams')}

        <Modal open={openFavouriteModal} onClose={() => setOpenFavouriteModal(false)}>
          <Paper
            elevation={0}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 'calc(100% - 32px)', sm: 560, md: 760 },
              maxHeight: '82vh',
              overflowY: 'auto',
              borderRadius: 2,
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(238,247,242,0.98) 100%)',
              border: '1px solid rgba(27,94,32,0.18)',
              boxShadow: '0 24px 60px rgba(15,23,42,0.24)',
              p: { xs: 2, md: 3 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 950,
                color: '#12372a',
                textAlign: 'center',
              }}
            >
              Choose Favourite Knockout Pick
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 0.75,
                mb: 2,
                color: '#60756b',
                fontWeight: 650,
                textAlign: 'center',
              }}
            >
              Select one qualified knockout team as your favourite.
            </Typography>

            <Divider sx={{ mb: 2, borderColor: 'rgba(27,94,32,0.16)' }} />

            {availableFavouriteTeams.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                  gap: 1.5,
                }}
              >
                {availableFavouriteTeams.map(team => {
                  const isCurrentFavourite = selections.Favourite === team.id;

                  return (
                    <Card
                      key={team.id}
                      elevation={0}
                      onClick={() => handleFavouriteSelect(team.id)}
                      sx={{
                        cursor: selectionsClosed ? 'default' : 'pointer',
                        borderRadius: 1.5,
                        textAlign: 'center',
                        background: isCurrentFavourite
                          ? 'linear-gradient(135deg, rgba(217,251,232,0.98) 0%, rgba(255,243,205,0.98) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(238,247,242,0.95) 100%)',
                        border: isCurrentFavourite
                          ? '2px solid rgba(245,158,11,0.78)'
                          : '1px solid rgba(27,94,32,0.18)',
                        boxShadow: isCurrentFavourite
                          ? '0 12px 28px rgba(180,83,9,0.18)'
                          : '0 8px 22px rgba(15,23,42,0.08)',
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                        '&:hover': selectionsClosed
                          ? {}
                          : {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 14px 30px rgba(15,23,42,0.14)',
                            },
                      }}
                    >
                      <CardContent sx={{ p: 2 }}>
                        {team.flag_code && (
                          <Flag
                            code={team.flag_code}
                            style={{
                              width: 62,
                              height: 40,
                              marginBottom: 10,
                              borderRadius: 3
                            }}
                          />
                        )}

                        <Typography sx={{ fontWeight: 900, color: '#12372a' }}>
                          {team.name}
                        </Typography>

                        <Typography variant="body2" sx={{ color: '#60756b', fontWeight: 650 }}>
                          {team.knockout_slot}
                        </Typography>
                      </CardContent>
                    </Card>
                  );
                })}
              </Box>
            ) : (
              <Box
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: 'rgba(217,251,232,0.55)',
                  border: '1px solid rgba(27,94,32,0.14)',
                  textAlign: 'center',
                }}
              >
                <Typography sx={{ color: '#375448', fontWeight: 800 }}>
                  No knockout teams are available yet.
                </Typography>

                <Typography variant="body2" sx={{ mt: 0.75, color: '#60756b', fontWeight: 650 }}>
                  Teams will appear here once their knockout slots have been confirmed.
                </Typography>
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button
                variant="outlined"
                onClick={() => setOpenFavouriteModal(false)}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 800,
                  color: '#0f766e',
                  borderColor: 'rgba(15,118,110,0.38)',
                }}
              >
                Cancel
              </Button>
            </Box>
          </Paper>
        </Modal>

        <Modal open={openSaveModal} onClose={() => setOpenSaveModal(false)}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: 'calc(100% - 32px)', sm: 360 },
              bgcolor: 'rgba(255,255,255,0.96)',
              borderRadius: 2,
              border: '1px solid rgba(27,94,32,0.16)',
              boxShadow: '0 24px 60px rgba(15,23,42,0.22)',
              p: { xs: 3, md: 4 },
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                color: '#12372a',
              }}
            >
              Knockout Selection Status
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography
              sx={{
                fontWeight: 800,
                color: saveModalMessage.includes('successfully') ? 'success.main' : 'error.main',
              }}
            >
              {saveModalMessage}
            </Typography>

            <Button
              variant="contained"
              sx={{
                mt: 3,
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 800,
                backgroundColor: '#0f766e',
                '&:hover': {
                  backgroundColor: '#0b625c',
                },
              }}
              onClick={() => setOpenSaveModal(false)}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default KnockoutSelectionsPage;