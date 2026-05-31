const express = require('express');
const router = express.Router();
const pool = require('../db'); // assuming you use pg Pool

// Get all fixtures
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT f.*, 
             t1.name AS home_team, 
             t2.name AS away_team,
             t1.flag_code AS home_flag,
             t2.flag_code AS away_flag
      FROM fixtures f
      JOIN teams t1 ON f.home_team_id = t1.id
      JOIN teams t2 ON f.away_team_id = t2.id
      ORDER BY f.match_date, f.match_time
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get fixtures for a specific team
router.get('/team/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT f.*, 
             t1.name AS home_team, 
             t2.name AS away_team,
             t1.flag_code AS home_flag,
             t2.flag_code AS away_flag
      FROM fixtures f
      JOIN teams t1 ON f.home_team_id = t1.id
      JOIN teams t2 ON f.away_team_id = t2.id
      WHERE f.home_team_id = $1 OR f.away_team_id = $1
      ORDER BY f.match_date, f.match_time
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Add a new fixture
router.post('/', async (req, res) => {
  try {
    const { home_team_id, away_team_id, match_date, match_time, venue, stage, round } = req.body;
    const result = await pool.query(
      `INSERT INTO fixtures (home_team_id, away_team_id, match_date, match_time, venue, stage, round)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [home_team_id, away_team_id, match_date, match_time, venue, stage, round]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Update fixture result
router.put('/:id/result', async (req, res) => {
  try {
    const { id } = req.params;
    const { home_score, away_score, status } = req.body;

    const result = await pool.query(
      `UPDATE fixtures
       SET home_score = $1, away_score = $2, status = $3
       WHERE id = $4 RETURNING *`,
      [home_score, away_score, status, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
