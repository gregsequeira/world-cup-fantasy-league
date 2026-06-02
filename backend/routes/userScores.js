const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all users' scores (group + knockout)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      WITH selections AS (
        SELECT user_id, 'Favourite' AS role, favourite_team_id AS team_id FROM user_selections
        UNION ALL SELECT user_id, 'Seeded' AS role, seeded_team_id FROM user_selections
        UNION ALL SELECT user_id, 'DarkHorse' AS role, dark_horse_team_id FROM user_selections
        UNION ALL SELECT user_id, 'Underdog' AS role, underdog_team_id FROM user_selections
        UNION ALL SELECT user_id, 'KOFavourite' AS role, ko_favourite_team_id FROM user_knockout_selections
        UNION ALL SELECT user_id, 'KO1' AS role, ko_team1_id FROM user_knockout_selections
        UNION ALL SELECT user_id, 'KO2' AS role, ko_team2_id FROM user_knockout_selections
        UNION ALL SELECT user_id, 'KO3' AS role, ko_team3_id FROM user_knockout_selections
      )
      SELECT
          u.id AS user_id,
          u.name AS user_name,
          COALESCE(SUM(
              CASE
                  WHEN f.status = 'Completed' AND f.round::integer <= 3 AND sel.role IN ('Favourite','Underdog') THEN
                    CASE
                      WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 6
                      WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 6
                      WHEN (sel.team_id = f.home_team_id OR sel.team_id = f.away_team_id) AND f.home_score = f.away_score THEN 2
                      ELSE 0
                    END
                  WHEN f.status = 'Completed' AND f.round::integer <= 3 THEN
                    CASE
                      WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 3
                      WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 3
                      WHEN (sel.team_id = f.home_team_id OR sel.team_id = f.away_team_id) AND f.home_score = f.away_score THEN 1
                      ELSE 0
                    END
                  WHEN f.status = 'Completed' AND f.round::integer >= 4 AND sel.role = 'KOFavourite' THEN
                    CASE
                      WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 6
                      WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 6
                      ELSE 0
                    END
                  WHEN f.status = 'Completed' AND f.round::integer >= 4 THEN
                    CASE
                      WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 3
                      WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 3
                      ELSE 0
                    END
                  ELSE 0
              END
          ), 0) AS total_points,
          COALESCE(SUM(
              CASE
                WHEN f.status = 'Completed' AND sel.team_id = f.home_team_id THEN f.home_score - f.away_score
                WHEN f.status = 'Completed' AND sel.team_id = f.away_team_id THEN f.away_score - f.home_score
                ELSE 0
              END
          ), 0) AS total_goal_difference
      FROM users u
      LEFT JOIN selections sel ON u.id = sel.user_id
      LEFT JOIN fixtures f ON sel.team_id = f.home_team_id OR sel.team_id = f.away_team_id
      GROUP BY u.id, u.name
      ORDER BY total_points DESC, total_goal_difference DESC;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get score for a single user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(`
      WITH selections AS (
        SELECT user_id, 'Favourite' AS role, favourite_team_id AS team_id FROM user_selections
        UNION ALL SELECT user_id, 'Seeded' AS role, seeded_team_id FROM user_selections
        UNION ALL SELECT user_id, 'DarkHorse' AS role, dark_horse_team_id FROM user_selections
        UNION ALL SELECT user_id, 'Underdog' AS role, underdog_team_id FROM user_selections
        UNION ALL SELECT user_id, 'KOFavourite' AS role, ko_favourite_team_id FROM user_knockout_selections
        UNION ALL SELECT user_id, 'KO1' AS role, ko_team1_id FROM user_knockout_selections
        UNION ALL SELECT user_id, 'KO2' AS role, ko_team2_id FROM user_knockout_selections
        UNION ALL SELECT user_id, 'KO3' AS role, ko_team3_id FROM user_knockout_selections
      )
      SELECT
          u.id AS user_id,
          u.name AS user_name,
          COALESCE(SUM(
              CASE
                  WHEN f.status = 'Completed' AND f.round::integer <= 3 AND sel.role IN ('Favourite','Underdog') THEN
                    CASE
                      WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 6
                      WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 6
                      WHEN (sel.team_id = f.home_team_id OR sel.team_id = f.away_team_id) AND f.home_score = f.away_score THEN 2
                      ELSE 0
                    END
                  WHEN f.status = 'Completed' AND f.round::integer <= 3 THEN
                    CASE
                      WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 3
                      WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 3
                      WHEN (sel.team_id = f.home_team_id OR sel.team_id = f.away_team_id) AND f.home_score = f.away_score THEN 1
                      ELSE 0
                    END
                  WHEN f.status = 'Completed' AND f.round::integer >= 4 AND sel.role = 'KOFavourite' THEN
                    CASE
                      WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 6
                      WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 6
                      ELSE 0
                    END
                  WHEN f.status = 'Completed' AND f.round::integer >= 4 THEN
                    CASE
                      WHEN sel.team_id = f.home_team_id AND f.home_score > f.away_score THEN 3
                      WHEN sel.team_id = f.away_team_id AND f.away_score > f.home_score THEN 3
                      ELSE 0
                    END
                  ELSE 0
              END
          ), 0) AS total_points,
          COALESCE(SUM(
              CASE
                WHEN f.status = 'Completed' AND sel.team_id = f.home_team_id THEN f.home_score - f.away_score
                WHEN f.status = 'Completed' AND sel.team_id = f.away_team_id THEN f.away_score - f.home_score
                ELSE 0
              END
          ), 0) AS total_goal_difference
      FROM users u
      LEFT JOIN selections sel ON u.id = sel.user_id
      LEFT JOIN fixtures f ON sel.team_id = f.home_team_id OR sel.team_id = f.away_team_id
      WHERE u.id = $1
      GROUP BY u.id, u.name;
    `, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found or no teams selected' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
