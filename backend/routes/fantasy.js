const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// Fantasy leaderboard
router.get('/leaderboard', authMiddleware, async (req, res) => {
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
          SUM(
              CASE 
                  -- Group stage (rounds 1–3)
                  WHEN s.role IN ('Favourite','Underdog') AND f.status = 'Completed' AND f.round::integer <= 3 THEN
                    CASE
                      WHEN s.team_id = f.home_team_id AND f.home_score > f.away_score THEN 6
                      WHEN s.team_id = f.away_team_id AND f.away_score > f.home_score THEN 6
                      WHEN (s.team_id = f.home_team_id OR s.team_id = f.away_team_id) AND f.home_score = f.away_score THEN 2
                      ELSE 0
                    END
                  WHEN f.status = 'Completed' AND f.round::integer <= 3 THEN
                    CASE
                      WHEN s.team_id = f.home_team_id AND f.home_score > f.away_score THEN 3
                      WHEN s.team_id = f.away_team_id AND f.away_score > f.home_score THEN 3
                      WHEN (s.team_id = f.home_team_id OR s.team_id = f.away_team_id) AND f.home_score = f.away_score THEN 1
                      ELSE 0
                    END

                  -- Knockout stage (rounds ≥ 4) → use winner_team_id
                  WHEN f.status = 'Completed' AND f.round::integer >= 4 AND s.role = 'KOFavourite' THEN
                    CASE WHEN s.team_id = f.winner_team_id THEN 6 ELSE 0 END
                  WHEN f.status = 'Completed' AND f.round::integer >= 4 THEN
                    CASE WHEN s.team_id = f.winner_team_id THEN 3 ELSE 0 END
                  ELSE 0
              END
          ) AS total_points,

          SUM(
              CASE 
                  -- GD always based on actual goals, not penalties
                  WHEN f.status = 'Completed' AND f.home_team_id = s.team_id THEN f.home_score - f.away_score
                  WHEN f.status = 'Completed' AND f.away_team_id = s.team_id THEN f.away_score - f.home_score
                  ELSE 0
              END
          ) AS total_goal_difference

      FROM users u
      JOIN selections s ON u.id = s.user_id
      LEFT JOIN fixtures f ON s.team_id = f.home_team_id OR s.team_id = f.away_team_id
      WHERE u.verified = true
      GROUP BY u.id, u.name
      ORDER BY total_points DESC, total_goal_difference DESC, u.name;
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
