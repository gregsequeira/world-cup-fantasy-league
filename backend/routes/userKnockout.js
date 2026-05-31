const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Utility: knockout cutoff check
async function isBeforeKnockoutCutoff() {
  const cutoff = new Date('2026-06-28T19:00:00+02:00'); // South Africa time (UTC+2)
  return new Date() < cutoff;
}

// User selects knockout teams (1 favourite + 3 others)
router.post('/select', authMiddleware, async (req, res) => {
  try {
    if (!(await isBeforeKnockoutCutoff())) {
      return res.status(400).json({ error: 'Knockout selections are locked after cutoff time' });
    }

    const { koFavouriteId, ko1Id, ko2Id, ko3Id } = req.body;

    // Upsert into user_knockout_selections
    await pool.query(
      `
      INSERT INTO user_knockout_selections (user_id, ko_favourite_team_id, ko_team1_id, ko_team2_id, ko_team3_id, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      ON CONFLICT (user_id)
      DO UPDATE SET
        ko_favourite_team_id = EXCLUDED.ko_favourite_team_id,
        ko_team1_id = EXCLUDED.ko_team1_id,
        ko_team2_id = EXCLUDED.ko_team2_id,
        ko_team3_id = EXCLUDED.ko_team3_id,
        updated_at = NOW()
      `,
      [req.userId, koFavouriteId || null, ko1Id || null, ko2Id || null, ko3Id || null]
    );

    res.json({ message: 'Knockout teams selected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get knockout teams for the logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    const result = await pool.query(
      `
      SELECT 
        us.id,
        us.ko_favourite_team_id,
        us.ko_team1_id,
        us.ko_team2_id,
        us.ko_team3_id,
        t_fav.name AS ko_favourite_name,
        t1.name AS ko1_name,
        t2.name AS ko2_name,
        t3.name AS ko3_name
      FROM user_knockout_selections us
      LEFT JOIN teams t_fav ON us.ko_favourite_team_id = t_fav.id
      LEFT JOIN teams t1 ON us.ko_team1_id = t1.id
      LEFT JOIN teams t2 ON us.ko_team2_id = t2.id
      LEFT JOIN teams t3 ON us.ko_team3_id = t3.id
      WHERE us.user_id = $1
      `,
      [userId]
    );

    res.json(result.rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch knockout teams' });
  }
});

module.exports = router;
