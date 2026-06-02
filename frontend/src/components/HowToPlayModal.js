import React from 'react';
import { Modal, Box, Typography, Button, Chip, Stack } from '@mui/material';

const HowToPlayModal = ({ open, onClose }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'rgba(15, 23, 42, 0.9)', // ✅ semi-transparent dark background
          borderRadius: 4,
          boxShadow: 24,
          p: { xs: 3, md: 5 },
          width: { xs: '90%', md: 600 },
          maxHeight: '80vh',
          overflowY: 'auto',
          color: '#fff',
          backdropFilter: 'blur(6px)', // ✅ frosted glass effect
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, color: '#00FFCC' }}>
          How the Fantasy League Works
        </Typography>

        <Stack spacing={2}>
          <Chip
            label="⚽ Pick 4 Nations"
            sx={{ bgcolor: '#7FC8A9', color: '#000000', fontWeight: 700 }}
          />
          <Typography variant="body1">
            Select your Favourite, Seeded, Dark Horse, and Underdog teams before the tournament begins.
          </Typography>

          <Chip
            label="📊 Score Points"
            sx={{ bgcolor: '#7FC8A9', color: '#000000', fontWeight: 700 }}
          />
          <Typography variant="body1">
            Earn points as your chosen teams win or draw matches. Special roles like Favourite and Underdog give bonus points.
          </Typography>

          <Chip
            label="🏆 Knockout Stage"
            sx={{ bgcolor: '#7FC8A9', color: '#000000', fontWeight: 700 }}
          />
          <Typography variant="body1">
            Choose again for the knockout rounds and double down on your picks to maximize your score.
          </Typography>

          <Chip
            label="🥇 Climb the Leaderboard"
            sx={{ bgcolor: '#7FC8A9', color: '#000000', fontWeight: 700 }}
          />
          <Typography variant="body1">
            Track your progress in real time and compete with friends for the top spot and prizes.
          </Typography>
        </Stack>

        <Button
          variant="contained"
          color="secondary"
          onClick={onClose}
          sx={{ mt: 4, borderRadius: 3, fontWeight: 700 }}
          fullWidth
        >
          Got it!
        </Button>
      </Box>
    </Modal>
  );
};

export default HowToPlayModal;
