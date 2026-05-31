const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
          t.id AS team_id,
          t.name AS team_name,
          t.group_name,
          t.ranking,
          t.flag_code,
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND (f.home_team_id = t.id OR f.away_team_id = t.id)) AS played,
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.home_team_id = t.id AND f.home_score > f.away_score) +
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.away_team_id = t.id AND f.away_score > f.home_score) AS won,
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.home_score = f.away_score AND (f.home_team_id = t.id OR f.away_team_id = t.id)) AS drawn,
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.home_team_id = t.id AND f.home_score < f.away_score) +
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.away_team_id = t.id AND f.away_score < f.home_score) AS lost,
          COALESCE(SUM(CASE WHEN f.home_team_id = t.id THEN f.home_score WHEN f.away_team_id = t.id THEN f.away_score ELSE 0 END),0) AS goals_for,
          COALESCE(SUM(CASE WHEN f.home_team_id = t.id THEN f.away_score WHEN f.away_team_id = t.id THEN f.home_score ELSE 0 END),0) AS goals_against,
          COALESCE(SUM(CASE WHEN f.home_team_id = t.id THEN f.home_score - f.away_score WHEN f.away_team_id = t.id THEN f.away_score - f.home_score ELSE 0 END),0) AS goal_difference,
          COALESCE(SUM(CASE 
              WHEN f.home_team_id = t.id AND f.home_score > f.away_score THEN 3
              WHEN f.away_team_id = t.id AND f.away_score > f.home_score THEN 3
              WHEN f.home_score = f.away_score AND (f.home_team_id = t.id OR f.away_team_id = t.id) THEN 1
              ELSE 0 END),0) AS points
      FROM teams t
      LEFT JOIN fixtures f ON t.id = f.home_team_id OR t.id = f.away_team_id
      GROUP BY t.id, t.name, t.group_name, t.ranking, t.flag_code
      ORDER BY t.group_name, t.ranking ASC;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get stats for a single team
router.get('/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const result = await pool.query(`
      SELECT 
          t.id AS team_id,
          t.name AS team_name,
          t.group_name,
          t.ranking,
          t.flag_code,
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND (f.home_team_id = t.id OR f.away_team_id = t.id)) AS played,
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.home_team_id = t.id AND f.home_score > f.away_score) +
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.away_team_id = t.id AND f.away_score > f.home_score) AS won,
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.home_score = f.away_score AND (f.home_team_id = t.id OR f.away_team_id = t.id)) AS drawn,
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.home_team_id = t.id AND f.home_score < f.away_score) +
          COUNT(f.id) FILTER (WHERE f.status = 'Completed' AND f.away_team_id = t.id AND f.away_score < f.home_score) AS lost,
          COALESCE(SUM(CASE WHEN f.home_team_id = t.id THEN f.home_score WHEN f.away_team_id = t.id THEN f.away_score ELSE 0 END),0) AS goals_for,
          COALESCE(SUM(CASE WHEN f.home_team_id = t.id THEN f.away_score WHEN f.away_team_id = t.id THEN f.home_score ELSE 0 END),0) AS goals_against,
          COALESCE(SUM(CASE WHEN f.home_team_id = t.id THEN f.home_score - f.away_score WHEN f.away_team_id = t.id THEN f.away_score - f.home_score ELSE 0 END),0) AS goal_difference,
          COALESCE(SUM(CASE 
              WHEN f.home_team_id = t.id AND f.home_score > f.away_score THEN 3
              WHEN f.away_team_id = t.id AND f.away_score > f.home_score THEN 3
              WHEN f.home_score = f.away_score AND (f.home_team_id = t.id OR f.away_team_id = t.id) THEN 1
              ELSE 0 END),0) AS points
      FROM teams t
      LEFT JOIN fixtures f ON t.id = f.home_team_id OR t.id = f.away_team_id
      WHERE t.id = $1
      GROUP BY t.id, t.name, t.group_name, t.ranking, t.flag_code;
    `, [teamId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Team not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
