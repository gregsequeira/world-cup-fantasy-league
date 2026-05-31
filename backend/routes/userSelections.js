const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const { isBeforeCutoff } = require('../utils/cutoff');

// User selects their teams (Favourite, Seeded, Dark Horse, Underdog)
router.post('/select', authMiddleware, async (req, res) => {
  try {
    const cutoffCheck = await isBeforeCutoff();
    if (!cutoffCheck) {
      return res.status(400).json({ error: 'Selections are locked after cutoff time' });
    }

    const { favouriteId, seededId, darkHorseId, underdogId } = req.body;

    await pool.query(
      `
      INSERT INTO user_selections (user_id, favourite_team_id, seeded_team_id, dark_horse_team_id, underdog_team_id, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        favourite_team_id = EXCLUDED.favourite_team_id,
        seeded_team_id = EXCLUDED.seeded_team_id,
        dark_horse_team_id = EXCLUDED.dark_horse_team_id,
        underdog_team_id = EXCLUDED.underdog_team_id,
        updated_at = NOW()
      `,
      [req.userId, favouriteId || null, seededId || null, darkHorseId || null, underdogId || null]
    );

    res.json({ message: 'Teams selected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get teams for the logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `
      SELECT 
        us.id,
        us.favourite_team_id,
        us.seeded_team_id,
        us.dark_horse_team_id,
        us.underdog_team_id,
        t_fav.name AS favourite_name,
        t_seed.name AS seeded_name,
        t_dark.name AS dark_horse_name,
        t_under.name AS underdog_name
      FROM user_selections us
      LEFT JOIN teams t_fav ON us.favourite_team_id = t_fav.id
      LEFT JOIN teams t_seed ON us.seeded_team_id = t_seed.id
      LEFT JOIN teams t_dark ON us.dark_horse_team_id = t_dark.id
      LEFT JOIN teams t_under ON us.underdog_team_id = t_under.id
      WHERE us.user_id = $1
      `,
      [userId]
    );

    res.json(result.rows[0] || {}); // return object or empty if none
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user teams' });
  }
});

module.exports = router;
