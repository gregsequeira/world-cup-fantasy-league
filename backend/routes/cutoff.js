const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT match_date, match_time 
       FROM fixtures 
       ORDER BY match_date ASC, match_time ASC 
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No fixtures found' });
    }

    const { match_date, match_time } = result.rows[0];

    // Ensure proper formatting
    const matchDate = typeof match_date === 'string' ? match_date : match_date.toISOString().split('T')[0];
    const matchTime = typeof match_time === 'string' ? match_time : match_time.toISOString().split('T')[1].slice(0,8);

    const matchDateTime = new Date(`${matchDate}T${matchTime}`);
    if (isNaN(matchDateTime)) {
      return res.status(500).json({ error: 'Invalid date/time format in fixtures' });
    }

    const cutoff = new Date(matchDateTime.getTime() - 2 * 60 * 60 * 1000);

    res.json({ cutoff: cutoff.toISOString() });
  } catch (err) {
    console.error('Cutoff route error:', err);
    res.status(500).json({ error: 'Failed to calculate cutoff' });
  }
});

module.exports = router;
