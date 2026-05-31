const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all users' scores (group + knockout)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          u.id AS user_id,
          u.username AS user_name,
          SUM(
              CASE 
                  -- Group stage (rounds 1–3)
                  WHEN ut.role IN ('Favourite','Underdog') AND f.round <= 3 THEN s.points * 2
                  WHEN f.round <= 3 THEN s.points

                  -- Knockout stage (rounds 4–8)
                  WHEN uk.ko_favourite_team_id = s.team_id AND f.round >= 4 THEN s.points * 2
                  WHEN f.round >= 4 THEN s.points
                  ELSE 0
              END
          ) AS total_points,
          SUM(s.goal_difference) AS total_goal_difference
      FROM users u
      LEFT JOIN user_teams ut ON u.id = ut.user_id
      LEFT JOIN user_knockout_selections uk ON u.id = uk.user_id
      JOIN (
          SELECT 
              t.id AS team_id,
              COALESCE(SUM(
                  CASE 
                      -- Group stage scoring
                      WHEN f.status = 'Completed' AND f.round <= 3 AND f.home_team_id = t.id AND f.home_score > f.away_score THEN 3
                      WHEN f.status = 'Completed' AND f.round <= 3 AND f.away_team_id = t.id AND f.away_score > f.home_score THEN 3
                      WHEN f.status = 'Completed' AND f.round <= 3 AND f.home_score = f.away_score AND (f.home_team_id = t.id OR f.away_team_id = t.id) THEN 1

                      -- Knockout scoring (no draws)
                      WHEN f.status = 'Completed' AND f.round >= 4 AND f.home_team_id = t.id AND f.home_score > f.away_score THEN 3
                      WHEN f.status = 'Completed' AND f.round >= 4 AND f.away_team_id = t.id AND f.away_score > f.home_score THEN 3
                      ELSE 0
                  END
              ),0) AS points,
              COALESCE(SUM(
                  CASE 
                      WHEN f.status = 'Completed' AND f.home_team_id = t.id THEN f.home_score - f.away_score
                      WHEN f.status = 'Completed' AND f.away_team_id = t.id THEN f.away_score - f.home_score
                      ELSE 0 END
              ),0) AS goal_difference
          FROM teams t
          LEFT JOIN fixtures f ON t.id = f.home_team_id OR t.id = f.away_team_id
          GROUP BY t.id
      ) s ON (
          ut.team_id = s.team_id 
          OR uk.ko_favourite_team_id = s.team_id 
          OR uk.ko_team1_id = s.team_id 
          OR uk.ko_team2_id = s.team_id 
          OR uk.ko_team3_id = s.team_id
      )
      GROUP BY u.id, u.username
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
      SELECT 
          u.id AS user_id,
          u.username AS user_name,
          SUM(
              CASE 
                  -- Group stage (rounds 1–3)
                  WHEN ut.role IN ('Favourite','Underdog') AND f.round <= 3 THEN s.points * 2
                  WHEN f.round <= 3 THEN s.points

                  -- Knockout stage (rounds 4–8)
                  WHEN uk.ko_favourite_team_id = s.team_id AND f.round >= 4 THEN s.points * 2
                  WHEN f.round >= 4 THEN s.points
                  ELSE 0
              END
          ) AS total_points,
          SUM(s.goal_difference) AS total_goal_difference
      FROM users u
      LEFT JOIN user_teams ut ON u.id = ut.user_id
      LEFT JOIN user_knockout_selections uk ON u.id = uk.user_id
      JOIN (
          SELECT 
              t.id AS team_id,
              COALESCE(SUM(
                  CASE 
                      -- Group stage scoring
                      WHEN f.status = 'Completed' AND f.round <= 3 AND f.home_team_id = t.id AND f.home_score > f.away_score THEN 3
                      WHEN f.status = 'Completed' AND f.round <= 3 AND f.away_team_id = t.id AND f.away_score > f.home_score THEN 3
                      WHEN f.status = 'Completed' AND f.round <= 3 AND f.home_score = f.away_score AND (f.home_team_id = t.id OR f.away_team_id = t.id) THEN 1

                      -- Knockout scoring (no draws)
                      WHEN f.status = 'Completed' AND f.round >= 4 AND f.home_team_id = t.id AND f.home_score > f.away_score THEN 3
                      WHEN f.status = 'Completed' AND f.round >= 4 AND f.away_team_id = t.id AND f.away_score > f.home_score THEN 3
                      ELSE 0
                  END
              ),0) AS points,
              COALESCE(SUM(
                  CASE 
                      WHEN f.status = 'Completed' AND f.home_team_id = t.id THEN f.home_score - f.away_score
                      WHEN f.status = 'Completed' AND f.away_team_id = t.id THEN f.away_score - f.home_score
                      ELSE 0 END
              ),0) AS goal_difference
          FROM teams t
          LEFT JOIN fixtures f ON t.id = f.home_team_id OR t.id = f.away_team_id
          GROUP BY t.id
      ) s ON (
          ut.team_id = s.team_id 
          OR uk.ko_favourite_team_id = s.team_id 
          OR uk.ko_team1_id = s.team_id 
          OR uk.ko_team2_id = s.team_id 
          OR uk.ko_team3_id = s.team_id
      )
      WHERE u.id = $1
      GROUP BY u.id, u.username;
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
